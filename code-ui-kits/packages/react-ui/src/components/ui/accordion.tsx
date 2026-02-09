import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"


const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName



interface AccordionRootProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> {
    className?: string;
}

// Root Wrapper: Single 모드 (하나만 열림)
// children을 받아서 내부 내용을 자유롭게
export function SingleAccordion({ className, children, ...props }: AccordionRootProps) {
    return (
        <AccordionPrimitive.Root
            type="single"
            collapsible
            className={cn('w-full space-y-2', className)}
            {...props}
        >
            {children}
        </AccordionPrimitive.Root>
    );
}

// Root Wrapper: Multiple 모드 (여러 개 열림)
export function MultipleAccordion({ className, children, ...props }: AccordionRootProps) {
    return (
        <AccordionPrimitive.Root
            type="multiple"
            className={cn('w-full space-y-2', className)}
            {...props}
        >
            {children}
        </AccordionPrimitive.Root>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
