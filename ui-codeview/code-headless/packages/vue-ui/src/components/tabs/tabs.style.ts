// packages/pds-vue/src/components/Tabs/Tabs.style.ts
import { cva, type VariantProps } from 'class-variance-authority';
import type { InjectionKey, ComputedRef } from 'vue';

// TabsList 스타일
export const tabsListVariants = cva(
  // 공통 클래스
  'flex items-center',
  {
    variants: {
      variant: {
        primary: 'justify-start gap-2 w-full border-b border-gray-200',
        secondary: 'justify-between h-12 px-2 py-1 rounded-md bg-gray-100 text-gray-500',
      },
      size: {
        auto: 'inline-flex w-max',
        full: 'w-full',
      },
    },
    defaultVariants: { // 기본값
      variant: 'primary',
      size: 'auto',
    },
  },
);

// TabsTrigger 스타일
export const tabsTriggerVariants = cva(
  // 공통 클래스
  'inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'h-10 px-3 -mb-[1px] text-sm text-gray-500 font-semibold border-b-[3px] border-transparent data-[state=active]:border-gray-900 data-[state=active]:text-gray-900',
        secondary: 'px-5 py-2 text-xs text-gray-500 font-semibold rounded-full data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm',
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

// 타입 추출 (CVA가 자동으로 타입 생성)
export type TabsVariants = VariantProps<typeof tabsListVariants>;

// Context 정의
export interface TabsContextValue {
  variant: ComputedRef<NonNullable<TabsVariants['variant']>>;
  size: ComputedRef<NonNullable<TabsVariants['size']>>;
}

export const TabsVariantContext = Symbol('TabsVariantContext') as InjectionKey<TabsContextValue>;