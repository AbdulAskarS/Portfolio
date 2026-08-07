import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  id?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1.5 w-full", className)} {...props}>
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
          >
            {label}
          </label>
        )}
        <div>{children}</div>
        {error && (
          <p className="text-xs font-medium text-destructive transition-all duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";
