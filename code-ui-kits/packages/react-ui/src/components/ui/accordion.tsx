import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * 아코디언 스타일 변형
 * primary: 밑줄형 (Line Style)
 * secondary: 박스형 (Solid/Segmented Style)
 */
export type AccordionVariant = "primary" | "secondary"; 
export type AccordionSize = "md" | "lg"; 

interface AccordionContextValue {
  variant: AccordionVariant;
  size: AccordionSize;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)
// AccordionItem 만 사용했을때 에러 표시
function useAccordionContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error(
      "Accordion components (Item, Trigger, Content) must be used within <Accordion />"
    )
  }
  return context
}

const AccordionStyles = {
  variant: {
    primary: {
      item: "border-b",
      trigger: "data-[state=open]:font-semibold data-[state=open]:text-orange-600 hover:font-bold hover:text-orange-600",
      content: "bg-white",
    },
    secondary: {
      item: "bg-slate-100",
      trigger: "data-[state=open]:font-semibold data-[state=open]:text-orange-600 hover:font-bold hover:text-orange-600",
      content: "bg-white",
    },
  },
  size: {
    md: {
      trigger: "py-5 px-2 text-sm",
      content: "pt-3 pb-5 px-2 text-sm",
      icon: "h-4 w-4"
    },
    lg: {
      trigger: "py-6 px-2 text-base",
      content: "pb-8 pt-5 px-2 text-base",
      icon: "h-5 w-5"
    }
  }
} as const;


// Radix Props
type RootBaseProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
// 추가 Props
interface BaseAccordionProps {
  variant?: AccordionVariant
  size?: AccordionSize
}
// 최종 Props
type AccordionProps = RootBaseProps & BaseAccordionProps


// AccordionRoot (Context Provider)
const Accordion = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Root>,AccordionProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
  <AccordionContext.Provider value={{ variant, size }}>
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(
        "w-full",
        className
      )}
      {...props}
    />
  </AccordionContext.Provider>
))
Accordion.displayName = "Accordion"


// AccordionItem
const AccordionItem = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { variant } = useAccordionContext();
  
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        AccordionStyles.variant[variant].item,
        className
      )}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"


// AccordionTrigger
interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  icon?: React.ReactNode; // 👈 밖에서 아이콘을 넘겨받을 수 있게 구멍을 뚫어줍니다.
}

const AccordionTrigger = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Trigger>,
AccordionTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  const { variant, size } = useAccordionContext();

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between font-medium transition-all text-left [&[data-state=open]>svg]:rotate-180",
          AccordionStyles.variant[variant].trigger,
          AccordionStyles.size[size].trigger,
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </div>

        <ChevronDown 
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            AccordionStyles.size[size].icon
          )} 
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"


// AccordionContent
const AccordionContent = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { variant, size } = useAccordionContext();

  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn(
          AccordionStyles.variant[variant].content,
          AccordionStyles.size[size].content,
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = "AccordionContent"


// --- Wrappers ---
export type SingleAccordionProps = Omit<Extract<RootBaseProps, { type: "single" }>,
  "type" | "collapsible"> & BaseAccordionProps

export function SingleAccordion({ className, variant, size, children, ...props
}: SingleAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      variant={variant}
      size={size}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </Accordion>
  )
}

export type MultipleAccordionProps = Omit<Extract<RootBaseProps, { type: "multiple" }>,
  "type"> & BaseAccordionProps

export function MultipleAccordion({ className, variant, size, children, ...props
}: MultipleAccordionProps) {
  return (
    <Accordion
      type="multiple"
      variant={variant}
      size={size}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </Accordion>
  )
}


export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }