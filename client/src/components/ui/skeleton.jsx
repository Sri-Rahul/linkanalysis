import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gradient-to-r from-muted/60 via-muted to-muted/60 bg-[length:400%_100%] relative overflow-hidden", className)}
      {...props}
    >
      <div className="absolute inset-0 bg-muted/5 w-full h-full" />
    </div>
  )
}

export { Skeleton }