import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, variant = "default", ...props }, ref) => {
  const [progress, setProgress] = React.useState(0)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(value || 0), 100)
    return () => clearTimeout(timer)
  }, [value])
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-700 ease-in-out",
          variant === "default" && "bg-gradient-to-r from-primary to-primary/80",
          variant === "success" && "bg-gradient-to-r from-emerald-500 to-emerald-400",
          variant === "warning" && "bg-gradient-to-r from-amber-500 to-amber-400",
          variant === "info" && "bg-gradient-to-r from-sky-500 to-sky-400"
        )}
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }