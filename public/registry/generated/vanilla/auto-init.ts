import { badge } from "./components/badge";
import { button } from "./components/button";
import { kbd } from "./components/kbd";
import { tabs } from "./components/tabs";

type ComponentRoot = Document | DocumentFragment | HTMLElement;

export const components = [badge, button, kbd, tabs] as const;

function getDefaultRoot(): Document | undefined {
  return typeof document === "undefined" ? undefined : document;
}

export function autoInit(root: ComponentRoot | undefined = getDefaultRoot()): void {
  if (!root) return;
  for (const component of components) component.init(root);
}

export function destroyAll(root: ComponentRoot | undefined = getDefaultRoot()): void {
  if (!root) return;
  for (const component of components) component.destroy(root);
}
