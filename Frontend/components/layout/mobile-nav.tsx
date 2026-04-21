"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative lg:hidden">
      {isOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/25"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card/85 px-3 text-sm font-semibold text-foreground/80 transition hover:bg-muted"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menu
      </button>

      <div
        className={cn(
          "absolute left-0 right-0 top-12 z-40 origin-top rounded-2xl border border-border/70 bg-card/95 p-2 shadow-soft backdrop-blur transition-all duration-300",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        )}
      >
        <nav className="grid max-h-[65vh] gap-1 overflow-y-auto p-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/tasks"
                ? pathname === "/tasks"
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-card/70 text-foreground/80 hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
