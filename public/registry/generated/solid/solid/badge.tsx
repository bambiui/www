import { createEffect, onCleanup, onMount, splitProps, type JSX } from "solid-js";
import { badge } from "../components/badge";
import "../styles/badge.css";

export interface BadgeProps
  extends JSX.HTMLAttributes<HTMLElement> {
  variant?: "default" | "secondary" | "outline" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
}

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, [
    "variant",
    "size"
  ]);
  let element!: HTMLElement;
  let instance: ReturnType<typeof badge.mount> | undefined;
  const variant = () => local.variant ?? "default";
  const size = () => local.size ?? "sm";

  onMount(() => {
    instance = badge.mount(element, {
        variant: variant(),
        size: size(),
    });
  });

  createEffect(() => {
    instance?.update({
        variant: variant(),
        size: size(),
    });
  });

  onCleanup(() => {
    instance?.destroy();
  });

  return (
    <span
      {...rest}
      ref={element}
      data-bambi-badge=""
      data-variant={variant()}
      data-size={size()}
    />
  );
}
