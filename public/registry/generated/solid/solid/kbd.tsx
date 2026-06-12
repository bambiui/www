import { createEffect, onCleanup, onMount, splitProps, type JSX } from "solid-js";
import { kbd } from "../components/kbd";
import "../styles/kbd.css";

export interface KbdProps
  extends JSX.HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg";
}

export function Kbd(props: KbdProps) {
  const [local, rest] = splitProps(props, [
    "size"
  ]);
  let element!: HTMLElement;
  let instance: ReturnType<typeof kbd.mount> | undefined;
  const size = () => local.size ?? "sm";

  onMount(() => {
    instance = kbd.mount(element, {
        size: size(),
    });
  });

  createEffect(() => {
    instance?.update({
        size: size(),
    });
  });

  onCleanup(() => {
    instance?.destroy();
  });

  return (
    <kbd
      {...rest}
      ref={element}
      data-bambi-kbd=""
      data-size={size()}
    />
  );
}
