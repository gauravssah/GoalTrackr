"use client";

import { Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useAppStore } from "@/store/use-app-store";

export function Topbar() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm text-foreground/60">Friday, 13 March 2026</p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] ?? "Scheduler"}.
        </h2>
      </div>
      <div className="flex items-center gap-3">
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
