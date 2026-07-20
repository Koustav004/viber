import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
<<<<<<< HEAD
      className={cn("animate-pulse rounded-md bg-accent", className)}
=======
      className={cn("bg-accent animate-pulse rounded-md", className)}
>>>>>>> 7384eda (Final for production v.1.0.1)
      {...props}
    />
  )
}

export { Skeleton }
