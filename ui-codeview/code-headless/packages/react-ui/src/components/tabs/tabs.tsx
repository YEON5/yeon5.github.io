'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * 탭 스타일 변형
 * primary: 밑줄형 (Line Style)
 * secondary: 박스형 (Solid/Segmented Style)
 * tertiary: 캡슐형 (Capsule Style)
 */

// tabsListVariants
const tabsListVariants = cva(
    'flex items-center', // 공통 기본 스타일
    {
        variants: {
            variant: {
                primary: 'justify-start border-b border-gray-200',
                secondary: 'justify-between h-12 px-1.5 py-1 rounded-md bg-muted text-muted-foreground',
            },
            size: {
                auto: 'inline-flex w-max',
                full: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'auto',
        },
    },
);

// tabsTriggerVariants
const tabsTriggerVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background', // 공통 기본 스타일
    {
        variants: {
            variant: {
                primary: 'px-5 py-2.5 -mb-[1px] text-sm font-medium border-b-2 border-transparent hover:text-foreground/80 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600',
                secondary: 'rounded-md px-4 py-2.5 text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
            },
            size: {
                auto: 'w-auto',
                full: 'flex-1',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'auto',
        },
    },
);

// TabsContext (CVA가 자동으로 타입 생성)
type TabsVariants = VariantProps<typeof tabsListVariants>;

// Context 정의
interface TabsContextValue {
    variant: NonNullable<TabsVariants['variant']>;
    size: NonNullable<TabsVariants['size']>;
}

const TabsContext = React.createContext<TabsContextValue>({
    variant: 'primary',
    size: 'auto',
});

// tabs, TabsContent
const Tabs = TabsPrimitive.Root;
const TabsContent = TabsPrimitive.Content;

// TabsList
export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>, VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(({ className, variant = 'primary', size = 'auto', ...props }, ref) => {
    const safeVariant = variant ?? 'primary';
    const safeSize = size ?? 'auto';

    return (
        <TabsContext.Provider value={{ variant: safeVariant, size: safeSize }}>
            <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant: safeVariant, size: safeSize }), className)} {...props} />
        </TabsContext.Provider>
    );
});
TabsList.displayName = 'TabsList';

// TabsTrigger
const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => {
    const { variant, size } = React.useContext(TabsContext);

    return <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant, size }), className)} {...props} />;
});
TabsTrigger.displayName = 'TabsTrigger';

export { Tabs, TabsList, TabsTrigger, TabsContent };
