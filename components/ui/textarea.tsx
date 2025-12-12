import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-40 w-full rounded-md bg-background px-3 py-2 text-sm",
                    "border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none",
                    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

Textarea.displayName = "Textarea"

export { Textarea }
