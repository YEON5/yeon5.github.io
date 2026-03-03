<script setup lang="ts">
import { TabsRoot, type TabsRootProps, type TabsRootEmits, useForwardProps } from 'reka-ui';


interface Props extends TabsRootProps {
  class?: string;
}

const props = defineProps<Props>();
const emits = defineEmits<TabsRootEmits>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <TabsRoot
    v-bind="forwardedProps"
    @update:model-value="emits('update:modelValue', $event)"
    :class="props.class"
  >
    <slot />
  </TabsRoot>
</template>