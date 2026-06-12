<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { badge } from "../components/badge";
import "../styles/badge.css";

interface Props {
  variant?: "default" | "secondary" | "outline" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(),
  {
    variant: "default",
    size: "sm",
  });
const element = ref<HTMLElement | null>(null);
let instance: ReturnType<typeof badge.mount> | undefined;

function sync() {
  instance?.update({
    variant: props.variant,
    size: props.size,
  });
}

onMounted(() => {
  if (!element.value) return;
  instance = badge.mount(element.value, {
    variant: props.variant,
    size: props.size,
  });
});

watch(
  () => [props.variant, props.size],
  sync,
);

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <span
    ref="element"
    data-bambi-badge=""
    :data-variant="props.variant"
    :data-size="props.size"
  >
    <slot />
  </span>
</template>
