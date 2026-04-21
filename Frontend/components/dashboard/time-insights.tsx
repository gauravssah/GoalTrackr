"use client";

import { Card } from "@/components/ui/card";
import { buildDashboardStats } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

function hoursLabel(value: number) {
  return `${value.toFixed(1)}h`;
}

export function TimeInsights() {
  const tasks = useAppStore((state) => state.tasks);
  const goals = useAppStore((state) => state.goals);
  const surveys = useAppStore((state) => state.surveys);
  const stats = buildDashboardStats(tasks, goals, surveys);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Focus time overview</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm text-foreground/60">Today</p>
            <p className="mt-2 text-2xl font-semibold">
              {hoursLabel(stats.dailyHours)}
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm text-foreground/60">This week</p>
            <p className="mt-2 text-2xl font-semibold">
              {hoursLabel(stats.weeklyHours)}
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm text-foreground/60">This month</p>
            <p className="mt-2 text-2xl font-semibold">
              {hoursLabel(stats.monthlyHours)}
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm text-foreground/60">This year</p>
            <p className="mt-2 text-2xl font-semibold">
              {hoursLabel(stats.yearlyHours)}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <h4 className="mb-3 font-semibold">Top tasks by tracked time</h4>
          <div className="space-y-3">
            {stats.topTasksByTime.map((task) => (
              <div
                key={task.taskId}
                className="flex items-center justify-between rounded-2xl border border-border p-3 text-sm"
              >
                <span>{task.taskTitle}</span>
                <span>{hoursLabel(task.totalSeconds / 3600)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Recent work sessions</h3>
        <div className="space-y-3">
          {stats.recentSessions.length === 0 ? (
            <p className="text-sm text-foreground/60">
              Start a task timer to build your work log.
            </p>
          ) : (
            stats.recentSessions.map((session) => (
              <div
                key={`${session.taskId}-${session.startTime}`}
                className="rounded-2xl border border-border p-4 text-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold">{session.taskTitle}</h4>
                  <span>{hoursLabel(session.durationSeconds / 3600)}</span>
                </div>
                <p className="mt-2 text-foreground/65">
                  Started: {formatDateTime(session.startTime)}
                </p>
                <p className="text-foreground/65">
                  Ended: {formatDateTime(session.endTime)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
