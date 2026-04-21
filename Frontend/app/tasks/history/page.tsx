"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/use-app-store";
import type { CompletionStatus, Task } from "@/types";

export default function TaskHistoryPage() {
  const tasks = useAppStore((state) => state.tasks);
  const todayStart = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

  const categorized = useMemo(() => {
    const completed: Task[] = [];
    const partiallyCompleted: Task[] = [];
    const notCompleted: Task[] = [];

    for (const task of tasks) {
      const derivedStatus = deriveCompletionStatus(task, todayStart);
      if (derivedStatus === "Completed") {
        completed.push(task);
      } else if (derivedStatus === "Partially Completed") {
        partiallyCompleted.push(task);
      } else if (derivedStatus === "Not Completed") {
        notCompleted.push(task);
      }
    }

    const sortByDate = (list: Task[]) =>
      [...list].sort((left, right) => {
        const leftTime = new Date(
          left.scheduledDate || left.deadline || left.createdAt,
        ).getTime();
        const rightTime = new Date(
          right.scheduledDate || right.deadline || right.createdAt,
        ).getTime();
        return rightTime - leftTime;
      });

    return {
      completed: sortByDate(completed),
      partiallyCompleted: sortByDate(partiallyCompleted),
      notCompleted: sortByDate(notCompleted),
    };
  }, [tasks, todayStart]);

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">
                Task history
              </p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Completed, partial, and not completed task logs.
              </h1>
              <p className="mt-2 text-sm text-foreground/65">
                Old pending tasks are marked as Not Completed.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/tasks/today">Open Today Task</Link>
            </Button>
          </div>
        </Card>

        <HistorySection
          title="Completed"
          tone="completed"
          tasks={categorized.completed}
        />
        <HistorySection
          title="Partially Completed"
          tone="partial"
          tasks={categorized.partiallyCompleted}
        />
        <HistorySection
          title="Not Completed"
          tone="not-completed"
          tasks={categorized.notCompleted}
        />
      </div>
    </AppShell>
  );
}

type HistorySectionProps = {
  title: string;
  tone: "completed" | "partial" | "not-completed";
  tasks: Task[];
};

function HistorySection({ title, tone, tasks }: HistorySectionProps) {
  const badgeClassName =
    tone === "completed"
      ? "bg-emerald-600 text-white"
      : tone === "partial"
        ? "bg-amber-500 text-white"
        : "bg-rose-600 text-white";

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge className={badgeClassName}>{tasks.length}</Badge>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-foreground/60">
          No tasks in this section.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <article
              key={task._id}
              className="rounded-2xl border border-border/70 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{task.title}</h3>
                  <p className="text-sm text-foreground/60">
                    {formatDate(
                      task.scheduledDate || task.deadline || task.createdAt,
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge>{task.priority}</Badge>
                  <Badge>{task.completionStatus || "Pending"}</Badge>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-foreground/65 sm:grid-cols-3">
                <p>
                  Tracked: {Math.round((task.actualTimeSpentSeconds || 0) / 60)}{" "}
                  min
                </p>
                <p>Sessions: {(task.timeEntries || []).length}</p>
                <p>Satisfaction: {task.satisfactionLevel ?? 0}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}

function deriveCompletionStatus(task: Task, today: Date): CompletionStatus {
  const explicit = task.completionStatus || "Pending";
  if (explicit !== "Pending") return explicit;

  if (!task.scheduledDate) return "Pending";
  const taskDate = new Date(task.scheduledDate);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate.getTime() < today.getTime()) {
    return "Not Completed";
  }

  return "Pending";
}

function formatDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
