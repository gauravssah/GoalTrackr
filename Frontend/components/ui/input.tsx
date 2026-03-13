import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-xl border bg-card px-4 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
