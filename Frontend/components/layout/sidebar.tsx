"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass hidden w-72 flex-col rounded-[28px] p-6 lg:flex">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">GoalTrackr</p>
        <h1 className="mt-2 text-2xl font-semibold">Plan with clarity.</h1>
      </div>
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/tasks" && pathname.startsWith("/tasks") && pathname !== "/tasks/create" && pathname !== "/tasks/today");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive ? "bg-primary text-white" : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-secondary/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <BarChart3 className="h-4 w-4 text-secondary" />
          Weekly review
        </div>
        <p className="text-sm text-foreground/70">Friday is a good day to close loops and update your yearly trajectory.</p>
      </div>
    </aside>
  );
}
