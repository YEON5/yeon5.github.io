<script setup lang="ts">
import { computed, inject } from 'vue';
import { TabsTrigger, type TabsTriggerProps } from 'reka-ui';
import { cn } from '../../lib/utils';
import { tabsTriggerVariants, TabsVariantContext } from './tabs.style';

interface Props extends TabsTriggerProps {
    class?: string;
}

const { class: className, ...rest } = defineProps<Props>();

const context = inject(TabsVariantContext, {
    variant: computed(() => 'primary' as const),
    size: computed(() => 'auto' as const),
});

const computedClass = computed(() =>
    cn(
        tabsTriggerVariants({
            variant: context.variant.value,
            size: context.size.value,
        }),
        className,
    ),
);
</script>

<template>
    <TabsTrigger v-bind="rest" :class="computedClass">
        <slot />
    </TabsTrigger>
</template>
