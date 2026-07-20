"use client"

import * as React from "react"
<<<<<<< HEAD
import { Separator as SeparatorPrimitive } from "radix-ui"
=======
import * as SeparatorPrimitive from "@radix-ui/react-separator"
>>>>>>> 7384eda (Final for production v.1.0.1)

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
<<<<<<< HEAD
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
=======
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
>>>>>>> 7384eda (Final for production v.1.0.1)
        className
      )}
      {...props}
    />
  )
}

export { Separator }
