"use client";

import Link from "next/link";
import { Pause, Play, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { Task } from "@/types";
import { formatDuration, getLiveElapsed, isSameDay, sortTasks } from "@/lib/task-helpers";

export default function TodayTasksPage() {
  const tasks = useAppStore((state) => state.tasks);
  const updateTask = useAppStore((state) => state.updateTask);
  const [tick, setTick] = useState(Date.now());

  const todayTasks = useMemo(() => sortTasks(tasks).filter((task) => task.status !== "Completed" && isSameDay(task.deadline)), [tasks]);
  const hasRunningTimer = todayTasks.some((task) => task.timerStatus === "Running");

  useEffect(() => {
    if (!hasRunningTimer) return undefined;

    const interval = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [hasRunningTimer]);

  async function startTimer(task: Task) {
    await updateTask(task._id, {
      timerStatus: "Running",
      activeSessionStartedAt: new Date().toISOString(),
      status: task.status === "Pending" ? "In Progress" : task.status
    });
  }

  async function pauseTimer(task: Task, stop = false) {
    if (!task.activeSessionStartedAt) {
      if (stop && task.timerStatus === "Paused") {
        await updateTask(task._id, { timerStatus: "Idle" });
      }
      return;
    }

    const startTime = new Date(task.activeSessionStartedAt);
    const endTime = new Date();
    const durationSeconds = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
    await updateTask(task._id, {
      timerStatus: stop ? "Idle" : "Paused",
      activeSessionStartedAt: null,
      actualTimeSpentSeconds: (task.actualTimeSpentSeconds || 0) + durationSeconds,
      timeEntries: [
        ...(task.timeEntries || []),
        {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationSeconds
        }
      ]
    });
  }

  async function completeTask(task: Task) {
    let payload: Partial<Task> = {
      status: "Completed",
      completedAt: new Date().toISOString(),
      timerStatus: "Idle",
      activeSessionStartedAt: null
    };

    if (task.timerStatus === "Running" && task.activeSessionStartedAt) {
      const startTime = new Date(task.activeSessionStartedAt);
      const endTime = new Date();
      const durationSeconds = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
      payload = {
        ...payload,
        actualTimeSpentSeconds: (task.actualTimeSpentSeconds || 0) + durationSeconds,
        timeEntries: [
          ...(task.timeEntries || []),
          {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            durationSeconds
          }
        ]
      };
    }

    await updateTask(task._id, payload);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-foreground/45">Today route</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">All of today&apos;s tasks and their progress.</h1>
              <p className="mt-2 max-w-2xl text-sm text-foreground/65">This page shows only today&apos;s tasks, so the sequence and progress are easier to follow without extra clutter.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/tasks">Back to tasks</Link>
              </Button>
              <Button asChild>
                <Link href="/tasks/create">Create task</Link>
              </Button>
            </div>
          </div>
        </Card>

        {todayTasks.length === 0 ? (
          <Card className="text-sm text-foreground/60">There are no tasks due today.</Card>
        ) : (
          <div className="grid gap-4">
            {todayTasks.map((task, index) => {
              const tracked = getLiveElapsed(task, tick);
              const estimatedSeconds = Math.max(1, task.estimatedTime * 60);
              const progress = Math.min((tracked / estimatedSeconds) * 100, 100);

              return (
                <Card key={task._id} className="overflow-hidden border-border/80">
                  <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr] lg:p-5">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/15 text-primary">Step {index + 1}</Badge>
                        <h2 className="text-lg font-semibold sm:text-xl">{task.title}</h2>
                        <Badge>{task.priority}</Badge>
                        <Badge>{task.status}</Badge>
                      </div>
                      <p className="text-sm text-foreground/70">{task.description || "No task details added yet."}</p>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-border/70 bg-card/75 p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Due</p>
                          <p className="mt-1 text-sm font-medium">{formatDate(task.deadline)}</p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-card/75 p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Estimated</p>
                          <p className="mt-1 text-sm font-medium">{task.estimatedTime} min</p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-card/75 p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Tracked</p>
                          <p className="mt-1 text-sm font-medium">{formatDuration(tracked)}</p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-card/75 p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Focus</p>
                          <p className="mt-1 text-sm font-medium">{Math.round(progress)}%</p>
                        </div>
                      </div>
                      <div>
                        <Progress value={progress} />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/70 bg-muted/20 p-4">
                      <div className="space-y-2 text-sm text-foreground/65">
                        <p>Timer: {task.timerStatus || "Idle"}</p>
                        <p>Tags: {task.tags.join(", ") || "None"}</p>
                        <p>Distractions: {task.distractionCount}</p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {task.timerStatus !== "Running" ? (
                          <Button size="sm" className="bg-primary text-white" onClick={() => startTimer(task)}>
                            <Play className="mr-2 h-4 w-4" />
                            {task.timerStatus === "Paused" ? "Resume" : "Start"}
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-secondary text-white" onClick={() => pauseTimer(task)}>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => pauseTimer(task, true)}>
                          <Square className="mr-2 h-4 w-4" />
                          Stop
                        </Button>
                        <Button size="sm" className="bg-accent text-white sm:col-span-2" onClick={() => completeTask(task)}>
                          Complete task
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
