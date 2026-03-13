"use client";

import { Focus, ListChecks, TimerReset, TriangleAlert, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buildDashboardStats } from "@/lib/dashboard";
import { percentage } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const icons = [ListChecks, TimerReset, Focus, TriangleAlert, TrendingUp];

export function StatsGrid() {
  const tasks = useAppStore((state) => state.tasks);
  const goals = useAppStore((state) => state.goals);
  const surveys = useAppStore((state) => state.surveys);
  const stats = buildDashboardStats(tasks, goals, surveys);

  const items = [
    { label: "Tasks Completed Today", value: stats.completedToday },
    { label: "Pending Tasks", value: stats.pendingTasks },
    { label: "Focus Score", value: percentage(stats.focusScore) },
    { label: "Distractions Today", value: stats.distractionsToday },
    { label: "Weekly Progress", value: percentage(stats.weeklyProgress) }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item, index) => {
        const Icon = icons[index];
        return (
          <Card key={item.label} className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
            <Icon className="mb-4 h-5 w-5 text-primary" />
            <p className="text-sm text-foreground/65">{item.label}</p>
            <h3 className="mt-2 text-3xl font-semibold">{item.value}</h3>
          </Card>
        );
      })}
    </div>
  );
}
