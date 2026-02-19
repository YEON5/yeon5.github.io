import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * 아코디언 스타일 변형
 * primary: 밑줄형 (Line Style)
 * secondary: 박스형 (Solid/Segmented Style)
 */
type AccordionVariant = "primary" | "secondary"; 
type AccordionSize = "md" | "lg"; 

interface AccordionContextValue {
  variant: AccordionVariant;
  size: AccordionSize;
}
const AccordionContext = React.createContext<AccordionContextValue>({
  variant: "primary",
  size: "md",
});

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


// radix Accordion components
interface AccordionProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> {
  variant?: AccordionVariant;
  size?: AccordionSize;
}

// AccordionRoot (Context Provider)
const Accordion = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Root>,AccordionProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
  <AccordionContext.Provider value={{ variant, size }}>
    <AccordionPrimitive.Root
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  </AccordionContext.Provider>
))
Accordion.displayName = AccordionPrimitive.Root.displayName


// AccordionItem
const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>,React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  ({ className, ...props }, ref) => {
  const { variant } = React.useContext(AccordionContext);
  
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
AccordionItem.displayName = AccordionPrimitive.Item.displayName


// AccordionTrigger
const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>,React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => {
  const { variant, size } = React.useContext(AccordionContext);

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
        {children}
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
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName


// 4. AccordionContent
const AccordionContent = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>,React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  ({ className, children, ...props }, ref) => {
  const { variant, size } = React.useContext(AccordionContext);

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
AccordionContent.displayName = AccordionPrimitive.Content.displayName


// --- Wrappers ---
type WrapperProps = Omit<AccordionProps, "type" | "collapsible">;
export function SingleAccordion({ className, variant, size, children, ...props }: WrapperProps) {
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
    );
}
export function MultipleAccordion({ className, variant, size, children, ...props }: WrapperProps) {
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
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }