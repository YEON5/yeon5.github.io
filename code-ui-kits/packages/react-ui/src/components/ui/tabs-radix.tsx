import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils"

// 타입 정의
type TabsVariant = "line" | "box"
const TabsVariantContext = React.createContext<TabsVariant>("box")

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;


// tabsList
interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
  className?: string;
}
export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "box", ...props }, ref) => {
    
    // List 스타일 정의
    // const variantStyles = {
    //   box: "justify-between h-10 rounded-md bg-muted p-1 text-muted-foreground",
    //   line: "justify-start border-b border-gray-200 p-0"
    // };

    // return (
    //   <TabsVariantContext.Provider value={variant}>
    //     <TabsPrimitive.List
    //       ref={ref}
    //       className={cn("flex items-center w-full", variantStyles[variant], className)}
    //       {...props}
    //     />
    //   </TabsVariantContext.Provider>
    // );

    return (
      <TabsVariantContext.Provider value={variant}>
        <TabsPrimitive.List
          ref={ref}
          // cn 내부에서 모든 스타일 로직을 처리합니다.
          className={cn(
            // 공통 스타일
            "flex items-center w-full",

            // 변형 스타일 (Variant)
            variant === "box" 
              ? "justify-between h-10 rounded-md bg-muted p-1 text-muted-foreground"
              : "justify-start border-b border-gray-200 p-0",
            className
          )}
          {...props}
        />
      </TabsVariantContext.Provider>
    );
  }
);
TabsList.displayName = TabsPrimitive.List.displayName


// TabsTrigger
interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: TabsVariant
  className?: string
}
export const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, ...props }, ref) => {
    
    // [수정] 부모(List)가 내려준 값을 Context에서 꺼내옵니다.
    const contextVariant = React.useContext(TabsVariantContext)
    // 기본값 = box
    const finalVariant = variant || contextVariant || "box"

    // // Trigger 공통 스타일
    // const baseStyles = "inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
    
    // // Trigger 스타일 정의
    // const styles = {
    //   box: "flex-1 rounded-md px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
    //   line: "flex-1 px-5 py-2.5 text-sm font-medium border-b-2 border-transparent hover:text-foreground/80 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600"
    // }

    // // 선택된 variant에 맞는 스타일 가져오기
    // const variantStyles = styles[finalVariant];

    // return (
    //   <TabsPrimitive.Trigger
    //     ref={ref}
    //     className={`${baseStyles} ${variantStyles} ${className || ""}`}
    //     {...props}
    //   />
    // );
    
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          // 공통 스타일 (Base)
          "inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          
          // 변형 스타일 (Variant)
          finalVariant === "box" 
            ? "flex-1 rounded-md px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            : "flex-1 px-5 py-2.5 text-sm font-medium border-b-2 border-transparent hover:text-foreground/80 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600",
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;