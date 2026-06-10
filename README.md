# bambiui www

Landing page and static registry host for `bambiui`.

## Development

```sh
pnpm install
pnpm registry:refresh
pnpm check
```

The committed files under `public/registry` and `public/registry.json` are generated from the local `platform` checkout. Override the source path with:

```sh
BAMBI_SOURCE_DIR=/path/to/platform pnpm registry:refresh
```
