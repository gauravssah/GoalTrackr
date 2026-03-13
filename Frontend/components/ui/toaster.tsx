"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore } from "@/store/use-toast-store";

const toneStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/10"
  },
  error: {
    icon: XCircle,
    className: "border-rose-500/30 bg-rose-500/10"
  },
  info: {
    icon: Info,
    className: "border-sky-500/30 bg-sky-500/10"
  }
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const tone = toneStyles[toast.tone];
        const Icon = tone.icon;

        return (
          <div key={toast.id} className={`pointer-events-auto glass rounded-2xl border p-4 shadow-soft ${tone.className}`}>
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm text-foreground/70">{toast.description}</p> : null}
              </div>
              <button className="rounded-full p-1 text-foreground/60 transition hover:bg-white/10" onClick={() => removeToast(toast.id)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
