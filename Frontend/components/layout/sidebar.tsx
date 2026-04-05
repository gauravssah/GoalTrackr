"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Github, Heart, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass hidden w-72 flex-col rounded-[28px] p-6 lg:flex">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">
          GoalTrackr
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Plan with clarity.</h1>
      </div>
      <nav className="flex-1 space-y-2">
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
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive ? "bg-primary text-white" : "hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 pt-4">
        <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-secondary" />
            <span className="text-secondary">Weekly review</span>
          </div>
          <p className="text-sm text-foreground/70">
            Friday is a good day to close loops and update your yearly
            trajectory.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="https://github.com/gauravssah"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-card/70 px-3 py-2 text-sm font-medium text-primary transition hover:bg-card hover:text-primary"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/gauravssah"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-card/70 px-3 py-2 text-sm font-medium text-secondary transition hover:bg-card hover:text-secondary"
          >
            <Linkedin className="h-[18px] w-[18px]" />
            LinkedIn
          </Link>
        </div>
        <div className="mt-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-center text-sm text-foreground/70">
          <p className="flex items-center justify-center gap-2">
            <span>Developed with </span>
            <Heart className="h-4 w-4 fill-current text-rose-500" />
          </p>
          <p className="mt-1">by</p>
          <p className="mt-1 font-semibold text-accent">Gaurav Sah</p>
        </div>
      </div>
    </aside>
  );
}
