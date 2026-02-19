import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils"


/**
 * 탭 스타일 변형
 * primary: 밑줄형 (Line Style)
 * secondary: 박스형 (Solid/Segmented Style)
 * tertiary: 캡슐형 (Capsule Style)
 */
type TabsVariant = "primary" | "secondary";
type TabsSize = "auto" | "full";

interface TabsContextValue {
  variant: TabsVariant;
  size: TabsSize;
}
const TabsVariantContext = React.createContext<TabsContextValue>({
  variant: "primary",
  size: "auto",
});

const TabStyles = {
  variant: {
    primary: {
      list: "justify-start w-full border-b border-gray-200",
      trigger: "px-5 py-2.5 -mb-[1px] text-sm font-medium border-b-2 border-transparent hover:text-foreground/80 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600",
    },
    secondary: {
      list: "justify-between h-12 px-1.5 py-1 rounded-md bg-muted text-muted-foreground",
      trigger: "rounded-md px-4 py-2.5 text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
    },
  },
  size: {
    auto: {
      list: "inline-flex w-max",
      trigger: "w-auto"
    },
    full: {
      list: "w-full",
      trigger: "flex-1"
    }
  }
} as const;


// radix tabs components
const Tabs = TabsPrimitive.Root;
const TabsContent = TabsPrimitive.Content;

// TabsList
interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
  size?: TabsSize;
}
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "primary", size = "auto", ...props }, ref) => {
    return (
      <TabsVariantContext.Provider value={{ variant, size }}>
        <TabsPrimitive.List
          ref={ref}
          className={cn(
            "flex items-center",
            TabStyles.variant[variant].list,
            TabStyles.size[size].list,
            className
          )}
          {...props}
        />
      </TabsVariantContext.Provider>
    );
  }
);
TabsList.displayName = TabsPrimitive.List.displayName;


// TabsTrigger
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>, 
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {

    const { variant, size } = React.useContext(TabsVariantContext);

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          TabStyles.variant[variant].trigger,
          TabStyles.size[size].trigger,
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;


export { Tabs, TabsList, TabsTrigger, TabsContent };