"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Pause, Play, Square, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { Task } from "@/types";
import { formatDuration, getLiveElapsed, isSameDay, isYesterday, sortTasks } from "@/lib/task-helpers";

export default function TasksPage() {
  const tasks = useAppStore((state) => state.tasks);
  const updateTask = useAppStore((state) => state.updateTask);
  const deleteTask = useAppStore((state) => state.deleteTask);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [completionRatings, setCompletionRatings] = useState<Record<string, number>>({});
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const expandedTask = tasks.find((task) => task._id === expandedTaskId);
    if (!expandedTask || expandedTask.timerStatus !== "Running") {
      return undefined;
    }

    const interval = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [expandedTaskId, tasks]);

  const sortedTasks = useMemo(() => sortTasks(tasks), [tasks]);
  const todayTasks = useMemo(() => sortedTasks.filter((task) => task.status !== "Completed" && isSameDay(task.deadline)), [sortedTasks]);
  const yesterdayCarryForward = useMemo(() => sortedTasks.filter((task) => task.status !== "Completed" && isYesterday(task.deadline)), [sortedTasks]);
  const remainingTasks = useMemo(
    () => sortedTasks.filter((task) => !todayTasks.some((entry) => entry._id === task._id) && !yesterdayCarryForward.some((entry) => entry._id === task._id)),
    [sortedTasks, todayTasks, yesterdayCarryForward]
  );

  async function startTimer(task: Task) {
    setExpandedTaskId(task._id);
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
    const satisfactionLevel = completionRatings[task._id] || task.satisfactionLevel || 7;
    let payload: Partial<Task> = {
      status: "Completed",
      completedAt: new Date().toISOString(),
      satisfactionLevel,
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

  function renderTaskCard(task: Task, index: number, label?: string) {
    const isExpanded = expandedTaskId === task._id;
    const totalTracked = isExpanded ? getLiveElapsed(task, tick) : task.actualTimeSpentSeconds || 0;
    const estimatedSeconds = Math.max(1, task.estimatedTime * 60);
    const timerProgress = Math.min((totalTracked / estimatedSeconds) * 100, 100);

    return (
      <Card key={task._id} className="overflow-hidden border-border/80">
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border border-border/70 bg-transparent">#{index + 1}</Badge>
                {label ? <Badge className="bg-primary/15 text-primary">{label}</Badge> : null}
                <h2 className="text-lg font-semibold sm:text-xl">{task.title}</h2>
                <Badge>{task.priority}</Badge>
                <Badge>{task.status}</Badge>
                <Badge className="bg-muted text-foreground">{task.timerStatus || "Idle"}</Badge>
              </div>
              <p className="text-sm text-foreground/70">{task.description || "No task details added yet."}</p>
              <div className="grid gap-2 text-sm text-foreground/60 sm:grid-cols-2 xl:grid-cols-4">
                <p>Deadline: {formatDate(task.deadline)}</p>
                <p>Estimated: {task.estimatedTime} min</p>
                <p>Tags: {task.tags.join(", ") || "None"}</p>
                <p>Distractions: {task.distractionCount}</p>
              </div>
            </div>

            <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-[360px]">
              <Button asChild variant="outline" size="sm" className="border-border/70">
                <Link href={`/tasks/create?edit=${task._id}`}>Edit task</Link>
              </Button>
              {task.timerStatus !== "Running" ? (
                <Button size="sm" className="bg-primary text-white shadow-sm" onClick={() => startTimer(task)}>
                  <Play className="mr-2 h-4 w-4" />
                  {task.timerStatus === "Paused" ? "Resume timer" : "Start timer"}
                </Button>
              ) : (
                <Button size="sm" className="bg-secondary text-white shadow-sm" onClick={() => pauseTimer(task)}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause timer
                </Button>
              )}
              <Button variant="outline" size="sm" className="border-border/70" onClick={() => pauseTimer(task, true)}>
                <Square className="mr-2 h-4 w-4" />
                Stop session
              </Button>
              <Button size="sm" className="bg-accent text-white shadow-sm hover:opacity-95" onClick={() => completeTask(task)}>
                Complete task
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-between rounded-2xl border border-border/60 px-4 sm:col-span-2"
                onClick={() => setExpandedTaskId((current) => (current === task._id ? null : task._id))}
              >
                {isExpanded ? "Hide details" : "Show details"}
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground/65 sm:col-span-2" onClick={() => deleteTask(task._id)}>
                Delete task
              </Button>
            </div>
          </div>

          {isExpanded ? (
            <div className="grid gap-4 border-t border-border/70 pt-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Task timer</p>
                    <p className="text-xs text-foreground/55">Tracked vs estimated focus time</p>
                  </div>
                  <TimerReset className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-card/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Tracked</p>
                    <p className="mt-1 text-xl font-semibold">{formatDuration(totalTracked)}</p>
                  </div>
                  <div className="rounded-2xl bg-card/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Estimated</p>
                    <p className="mt-1 text-xl font-semibold">{formatDuration(estimatedSeconds)}</p>
                  </div>
                  <div className="rounded-2xl bg-card/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Focus progress</p>
                    <p className="mt-1 text-xl font-semibold">{Math.round(timerProgress)}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={timerProgress} />
                </div>
                <div className="mt-4 grid gap-2 text-sm text-foreground/65">
                  {task.activeSessionStartedAt ? <p>Session started: {new Date(task.activeSessionStartedAt).toLocaleString()}</p> : <p>The timer is idle. Start it to track a focused work session.</p>}
                  <p>Notes: {task.notes || "No additional notes yet."}</p>
                  {task.completedAt ? <p>Completed at: {new Date(task.completedAt).toLocaleString()}</p> : null}
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                  <p className="mb-2 text-sm font-medium">Completion score</p>
                  <p className="mb-3 text-xs text-foreground/55">Set a score from 1 to 10 before marking the task as complete.</p>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    placeholder="Rate from 1 to 10"
                    value={completionRatings[task._id] ?? task.satisfactionLevel ?? 7}
                    onChange={(e) => setCompletionRatings({ ...completionRatings, [task._id]: Number(e.target.value) })}
                  />
                </div>

                <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                  <p className="mb-2 text-sm font-medium">Time log</p>
                  <div className="space-y-2 text-sm text-foreground/65">
                    {(task.timeEntries || []).length === 0 ? (
                      <p>No tracked session yet.</p>
                    ) : (
                      task.timeEntries.slice().reverse().map((entry, logIndex) => (
                        <div key={`${task._id}-${logIndex}`} className="rounded-2xl bg-card/80 p-3">
                          <p>Start: {new Date(entry.startTime).toLocaleString()}</p>
                          <p>End: {new Date(entry.endTime).toLocaleString()}</p>
                          <p>Duration: {formatDuration(entry.durationSeconds)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-foreground/45">Task workspace</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">View tasks in clear, focused sections.</h1>
              <p className="mt-2 max-w-2xl text-sm text-foreground/65 sm:text-base">
                Task creation and today&apos;s sequence now live on separate routes. This page keeps the overview, unfinished work from yesterday, and detailed task tracking easy to scan.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/tasks/create">
                    Create new task
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/tasks/today">Open today tasks</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-3xl border border-border/70 bg-card/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Today</p>
                <p className="mt-2 text-2xl font-semibold">{todayTasks.length}</p>
                <p className="text-sm text-foreground/60">Active tasks due today</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Carry forward</p>
                <p className="mt-2 text-2xl font-semibold">{yesterdayCarryForward.length}</p>
                <p className="text-sm text-foreground/60">Yesterday unfinished tasks</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">All tasks</p>
                <p className="mt-2 text-2xl font-semibold">{tasks.length}</p>
                <p className="text-sm text-foreground/60">Tracked inside your workspace</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Yesterday&apos;s unfinished tasks</h2>
                <p className="text-sm text-foreground/60">Tasks that were not completed yesterday are grouped here separately.</p>
              </div>
              <Badge className={cn(yesterdayCarryForward.length ? "bg-secondary/15 text-secondary" : "bg-muted text-foreground")}>
                {yesterdayCarryForward.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {yesterdayCarryForward.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-foreground/60">There are no unfinished tasks carried forward from yesterday.</div>
              ) : (
                yesterdayCarryForward.map((task, index) => renderTaskCard(task, index))
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Today quick preview</h2>
                <p className="text-sm text-foreground/60">A dedicated route is available for viewing today&apos;s tasks and progress.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link href="/tasks/today">Open full today page</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-foreground/60">There are no active tasks scheduled for today.</div>
              ) : (
                todayTasks.slice(0, 4).map((task, index) => (
                  <div key={task._id} className="rounded-3xl border border-border/80 bg-card/85 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Step {index + 1}</p>
                        <p className="mt-1 font-medium">{task.title}</p>
                        <p className="mt-1 text-sm text-foreground/60">{task.description || "No task details added yet."}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{task.priority}</Badge>
                        <Badge>{task.status}</Badge>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-foreground/60 sm:grid-cols-3">
                      <p>Due {formatDate(task.deadline)}</p>
                      <p>Estimate {task.estimatedTime} min</p>
                      <p>Tracked {formatDuration(task.actualTimeSpentSeconds || 0)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">All task details</h2>
            <p className="text-sm text-foreground/60">All tasks appear in expandable cards, with buttons arranged in a cleaner and more responsive layout.</p>
          </div>
          <div className="space-y-3">
            {remainingTasks.map((task, index) => renderTaskCard(task, index, isSameDay(task.deadline) ? `Today step ${task.sequence ?? index + 1}` : undefined))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
