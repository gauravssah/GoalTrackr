"use client";

import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { MobileNav } from "./mobile-nav";
import { useAppStore } from "@/store/use-app-store";
import { formatTimeIndia, formatWeekdayDateIndia } from "@/lib/utils";

export function Topbar() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(formatTimeIndia());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <div className="mb-2 lg:hidden">
          <MobileNav />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-sm text-foreground/60">
            {formatWeekdayDateIndia()}
          </p>
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary">
            {clock || "--:--:--"}
          </span>
        </div>
        <h2 className="pt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] ?? "Scheduler"}.
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-foreground/40" />
          <Input
            className="w-72 pl-10"
            placeholder="Search tasks, journals, jobs..."
          />
        </div>
        <ModeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </Button>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
