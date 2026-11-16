<script setup lang="ts">
import { TabsContent, type TabsContentProps } from 'reka-ui';


interface Props extends TabsContentProps {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <TabsContent 
    v-bind="props" 
    :class="props.class"
  >
    <slot />
  </TabsContent>
</template>