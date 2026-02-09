import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

// 1. Root (공통)
const Tabs = TabsPrimitive.Root

// 2. Content (공통) - 애니메이션 및 레이아웃
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName


// Type A: Box Style (박스형 - Shadcn 기본 스타일)
const BoxTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full",
      className
    )}
    {...props}
  />
))
BoxTabsList.displayName = "BoxTabsList"

const BoxTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow flex-1",
      className
    )}
    {...props}
  />
))
BoxTabsTrigger.displayName = "BoxTabsTrigger"


// Type B: Line Style (라인형 - 하단 밑줄 스타일)
const LineTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    // 배경색 제거, 하단 보더 추가
    className={cn(
      "flex w-full border-b border-border bg-transparent p-0",
      className
    )}
    {...props}
  />
))
LineTabsList.displayName = "LineTabsList"

const LineTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    // 그림자/배경 제거, Active 상태일 때 하단 보더 생성
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-5 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "border-b-2 border-transparent hover:text-foreground/80 data-[state=active]:border-primary data-[state=active]:text-primary",
      className
    )}
    {...props}
  />
))
LineTabsTrigger.displayName = "LineTabsTrigger"


// 3. 내보내기 (필요한 부품을 골라 쓰세요)
export { 
    Tabs, 
    TabsContent, 
    BoxTabsList, BoxTabsTrigger, 
    LineTabsList, LineTabsTrigger 
}