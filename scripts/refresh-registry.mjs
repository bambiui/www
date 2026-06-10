import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourceArgIndex = process.argv.indexOf("--source");
const explicitSource =
  sourceArgIndex >= 0
    ? process.argv[sourceArgIndex + 1]
    : process.env.BAMBI_SOURCE_DIR;
const defaultSourceRoot = path.join(repoRoot, "..", "platform");
const sourceRoot = path.resolve(explicitSource ?? defaultSourceRoot);
const cliEntry = path.join(sourceRoot, "dist-cli", "index.js");
const publicRoot = path.join(repoRoot, "public");
const registryRoot = path.join(publicRoot, "registry");
const manifestPath = path.join(publicRoot, "registry.json");
const localRegistryUrl = pathToFileURL(publicRoot).href;
const frameworks = ["vanilla", "react", "solid", "svelte", "vue"];
const components = ["button", "tabs"];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with exit code ${result.status}`,
    );
  }
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute, base)));
    } else if (entry.isFile()) {
      files.push(path.relative(base, absolute).replaceAll(path.sep, "/"));
    }
  }

  return files.sort();
}

async function hashFile(filePath) {
  const content = await readFile(filePath);
  return {
    hash: createHash("sha256").update(content).digest("hex"),
    size: content.byteLength,
  };
}

if (!(await exists(sourceRoot))) {
  if (explicitSource) {
    throw new Error(`Registry source directory does not exist: ${sourceRoot}`);
  }

  if ((await exists(manifestPath)) && (await exists(registryRoot))) {
    console.log(
      `No local platform checkout found at ${sourceRoot}; using committed public registry.`,
    );
    process.exit(0);
  }

  throw new Error(
    `No local platform checkout found at ${sourceRoot}, and no committed public registry exists.`,
  );
}

if (!(await exists(cliEntry))) {
  run("pnpm", ["--dir", sourceRoot, "build:cli"]);
}

const nextRegistryRoot = await mkdtemp(
  path.join(os.tmpdir(), "bambi-public-registry-"),
);
await mkdir(path.join(nextRegistryRoot, "generated"), { recursive: true });

for (const framework of frameworks) {
  const tempRoot = await mkdtemp(
    path.join(os.tmpdir(), `bambi-registry-${framework}-`),
  );
  await writeFile(
    path.join(tempRoot, "package.json"),
    JSON.stringify({ type: "module" }, null, 2),
  );

  for (const component of components) {
    run("node", [
      cliEntry,
      "add",
      component,
      "--cwd",
      tempRoot,
      "--framework",
      framework,
      "--out-dir",
      "registry",
      "--style-file",
      "registry/styles/index.css",
      "--registry-url",
      localRegistryUrl,
      "--force",
    ]);
  }

  await cp(
    path.join(tempRoot, "registry"),
    path.join(nextRegistryRoot, "generated", framework),
    {
      recursive: true,
    },
  );
  await rm(tempRoot, { recursive: true, force: true });
}

await rm(registryRoot, { recursive: true, force: true });
await cp(nextRegistryRoot, registryRoot, { recursive: true });
await rm(nextRegistryRoot, { recursive: true, force: true });

const generatedRoot = path.join(registryRoot, "generated");
const generatedFiles = await walk(generatedRoot);
const files = [];
for (const relativePath of generatedFiles) {
  const publicPath = `registry/generated/${relativePath}`;
  files.push({
    path: publicPath,
    ...(await hashFile(path.join(generatedRoot, relativePath))),
  });
}

const manifest = {
  version: 1,
  name: "bambiui",
  source: "platform",
  components,
  frameworks,
  entrypoints: {
    manifest: "registry.json",
    generated: "registry/generated",
  },
  files,
};

await writeFile(
  path.join(publicRoot, "registry.json"),
  `${JSON.stringify(manifest, null, 2)}
`,
);

console.log(
  `Wrote ${files.length} registry files to ${path.relative(repoRoot, registryRoot)}`,
);
