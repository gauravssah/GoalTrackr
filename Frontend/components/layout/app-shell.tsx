"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { useAppStore } from "@/store/use-app-store";

const SIDEBAR_STORAGE_KEY = "goaltrackr_desktop_sidebar_open";

export function AppShell({ children }: { children: ReactNode }) {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const bootstrapped = useAppStore((state) => state.bootstrapped);
  const loading = useAppStore((state) => state.loading);
  const router = useRouter();
  const pathname = usePathname();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "0") {
      setIsDesktopSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(SIDEBAR_STORAGE_KEY, isDesktopSidebarOpen ? "1" : "0");
  }, [isDesktopSidebarOpen]);

  useEffect(() => {
    if (!bootstrapped) {
      initializeApp();
    }
  }, [bootstrapped, initializeApp]);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("goaltrackr_token")
        : null;
    if (bootstrapped && !token && pathname !== "/") {
      router.push("/login");
    }
  }, [bootstrapped, pathname, router]);

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass rounded-2xl px-6 py-4 text-sm text-foreground/70">
          Loading your workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 p-3 sm:p-4 lg:gap-6 lg:p-6">
      <Sidebar
        isOpen={isDesktopSidebarOpen}
        onToggle={() => setIsDesktopSidebarOpen((prev) => !prev)}
      />
      <main className="w-full">
        <Topbar />
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
