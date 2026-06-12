<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { kbd } from "../components/kbd";
  import "../styles/kbd.css";

  interface Props {
  size?: "sm" | "md" | "lg";
  children?: import("svelte").Snippet;
  [key: string]: unknown;
}

  let {
    size = "sm",
    children,
    ...rest
  }: Props = $props();

  let element: HTMLElement;
  let instance: ReturnType<typeof kbd.mount> | undefined;

  $effect(() => {
    instance?.update({
    size,
    });
  });

  onMount(() => {
    instance = kbd.mount(element, {
    size,
    });
  });

  onDestroy(() => {
    instance?.destroy();
  });
</script>

<kbd
  {...rest}
  bind:this={element}
  data-bambi-kbd=""
  data-size={size}
>
  {@render children?.()}
</kbd>
