import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full border-0 border-b-2 border-blue-800 bg-transparent outline-none",
        "text-4xl font-instrument text-foreground placeholder:text-foreground/60",
        "placeholder:font-instrument placeholder:text-4xl leading-tight",
        "focus-visible:border-blue-900 focus-visible:ring-0",
        "py-3 align-middle transition-colors",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}    
      {...props}
    />
  );
}

export { Input };