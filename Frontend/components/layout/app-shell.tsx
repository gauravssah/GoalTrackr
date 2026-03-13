"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { useAppStore } from "@/store/use-app-store";

export function AppShell({ children }: { children: ReactNode }) {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const bootstrapped = useAppStore((state) => state.bootstrapped);
  const loading = useAppStore((state) => state.loading);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!bootstrapped) {
      initializeApp();
    }
  }, [bootstrapped, initializeApp]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("goaltrackr_token") : null;
    if (bootstrapped && !token && pathname !== "/") {
      router.push("/login");
    }
  }, [bootstrapped, pathname, router]);

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass rounded-2xl px-6 py-4 text-sm text-foreground/70">Loading your workspace...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
      <Sidebar />
      <main className="w-full">
        <Topbar />
        <MobileNav />
        {loading ? (
          <div className="mb-4 rounded-2xl border border-border/60 bg-card/70 px-4 py-3 text-sm text-foreground/65">
            Syncing your latest changes...
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
