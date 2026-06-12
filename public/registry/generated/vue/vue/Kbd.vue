<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { kbd } from "../components/kbd";
import "../styles/kbd.css";

interface Props {
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(),
  {
    size: "sm",
  });
const element = ref<HTMLElement | null>(null);
let instance: ReturnType<typeof kbd.mount> | undefined;

function sync() {
  instance?.update({
    size: props.size,
  });
}

onMounted(() => {
  if (!element.value) return;
  instance = kbd.mount(element.value, {
    size: props.size,
  });
});

watch(
  () => [props.size],
  sync,
);

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <kbd
    ref="element"
    data-bambi-kbd=""
    :data-size="props.size"
  >
    <slot />
  </kbd>
</template>
