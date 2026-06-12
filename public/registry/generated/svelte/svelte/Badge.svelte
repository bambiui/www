<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { badge } from "../components/badge";
  import "../styles/badge.css";

  interface Props {
  variant?: "default" | "secondary" | "outline" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  children?: import("svelte").Snippet;
  [key: string]: unknown;
}

  let {
    variant = "default",
      size = "sm",
    children,
    ...rest
  }: Props = $props();

  let element: HTMLElement;
  let instance: ReturnType<typeof badge.mount> | undefined;

  $effect(() => {
    instance?.update({
    variant,
    size,
    });
  });

  onMount(() => {
    instance = badge.mount(element, {
    variant,
    size,
    });
  });

  onDestroy(() => {
    instance?.destroy();
  });
</script>

<span
  {...rest}
  bind:this={element}
  data-bambi-badge=""
  data-variant={variant}
  data-size={size}
>
  {@render children?.()}
</span>
