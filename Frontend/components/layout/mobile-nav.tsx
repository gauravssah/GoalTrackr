"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">
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
            className={cn(
              "flex min-w-fit items-center gap-2 rounded-2xl border border-border/70 bg-card/80 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition",
              isActive
                ? "border-primary bg-primary text-white"
                : "hover:bg-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
