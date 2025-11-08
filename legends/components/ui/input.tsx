import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // ⚪ Base look — white input with black text and border
        "h-9 w-full min-w-0 rounded-md border border-black bg-white px-3 py-1 text-base text-black shadow-sm outline-none transition-all placeholder:text-black/50",
        // 🔴 Focus + selection effects
        "focus-visible:border-red-600 focus-visible:ring-2 focus-visible:ring-red-500 selection:bg-red-600 selection:text-white",
        // 🛑 Disabled and invalid states
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600 aria-invalid:ring-red-600",
        className
      )}
      {...props}
    />
  )
}

export { Input }

