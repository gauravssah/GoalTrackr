import { ReactNode } from "react";

export function FieldGroup({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint ? <p className="text-xs text-foreground/55">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}
