<script setup lang="ts">
import { computed, provide } from 'vue';
import { TabsList, type TabsListProps } from 'reka-ui';
import { cn } from '../../lib/utils';
import { tabsListVariants, TabsVariantContext, type TabsVariants } from './tabs.style';

interface Props extends TabsListProps {
    class?: string;
    variant?: TabsVariants['variant'];
    size?: TabsVariants['size'];
}

const { variant = 'primary', size = 'auto', class: className, ...rest } = defineProps<Props>();

provide(TabsVariantContext, {
    variant: computed(() => variant),
    size: computed(() => size),
});

const computedClass = computed(() => cn(tabsListVariants({ variant, size }), className));
</script>

<template>
    <TabsList v-bind="rest" :class="computedClass">
        <slot />
    </TabsList>
</template>
