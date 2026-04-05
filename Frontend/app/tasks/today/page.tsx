"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Pause, Play, Square } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";
import { useToastStore } from "@/store/use-toast-store";
import { formatDuration, getLiveElapsed } from "@/lib/task-helpers";
import type { CompletionStatus, Task } from "@/types";

const COMPLETION_OPTIONS: CompletionStatus[] = [
  "Completed",
  "Partially Completed",
  "Not Completed",
  "Pending",
];

type TaskCardProps = {
  task: Task;
  tick: number;
  getCompletion: (task: Task) => CompletionStatus;
  getSatisfaction: (task: Task) => number;
  onCompletionChange: (value: CompletionStatus) => void;
  onSatisfactionChange: (value: number) => void;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onComplete: () => void;
};

export default function TodayTasksPage() {
  const tasks = useAppStore((state) => state.tasks);
  const updateTask = useAppStore((state) => state.updateTask);
  const pushToast = useToastStore((state) => state.pushToast);
  const [tick, setTick] = useState(Date.now());
  const [satisfactionMap, setSatisfactionMap] = useState<
    Record<string, number>
  >({});
  const [completionMap, setCompletionMap] = useState<
    Record<string, CompletionStatus>
  >({});

  const todayTasks = tasks
    .filter((task) =>
      isSameDay(task.scheduledDate, new Date().toISOString().slice(0, 10)),
    )
    .sort(
      (left, right) =>
        (left.slotStartMinutes ?? 0) - (right.slotStartMinutes ?? 0),
    );

  const remainingTasks = todayTasks.filter(
    (task) => (task.completionStatus || "Pending") !== "Completed",
  );
  const completedTasks = todayTasks.filter(
    (task) => (task.completionStatus || "Pending") === "Completed",
  );

  const hasRunningTimer = useMemo(
    () => todayTasks.some((task) => task.timerStatus === "Running"),
    [todayTasks],
  );

  useEffect(() => {
    if (!hasRunningTimer) return;
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [hasRunningTimer]);

  function getSatisfaction(task: Task) {
    if (typeof satisfactionMap[task._id] === "number") {
      return satisfactionMap[task._id];
    }
    return task.satisfactionLevel ?? 0;
  }

  function getCompletion(task: Task) {
    return completionMap[task._id] || task.completionStatus || "Pending";
  }

  async function startTimer(task: Task) {
    if (task.timerStatus === "Running") return;

    await updateTask(task._id, {
      timerStatus: "Running",
      activeSessionStartedAt: new Date().toISOString(),
      status: task.status === "Pending" ? "In Progress" : task.status,
    });
  }

  async function pauseTimer(task: Task, stop = false) {
    if (!task.activeSessionStartedAt || task.timerStatus !== "Running") {
      if (stop && task.timerStatus === "Paused") {
        await updateTask(task._id, { timerStatus: "Idle" });
      }
      return;
    }

    const startTime = new Date(task.activeSessionStartedAt);
    const endTime = new Date();
    const durationSeconds = Math.max(
      0,
      Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
    );

    await updateTask(task._id, {
      timerStatus: stop ? "Idle" : "Paused",
      activeSessionStartedAt: null,
      actualTimeSpentSeconds:
        (task.actualTimeSpentSeconds || 0) + durationSeconds,
      timeEntries: [
        ...(task.timeEntries || []),
        {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationSeconds,
        },
      ],
    });
  }

  async function completeTask(task: Task) {
    const satisfactionLevel = Number(getSatisfaction(task));
    const completionStatus = getCompletion(task);

    if (completionStatus === "Pending") {
      pushToast({
        title: "Completion status required",
        description:
          "Mark Completion se pehle status ko Pending se change karna zaroori hai.",
        tone: "error",
      });
      return;
    }

    if (satisfactionLevel <= 0) {
      pushToast({
        title: "Satisfaction rating required",
        description:
          "Completion submit karne ke liye 1 se 10 tak rating dena zaroori hai.",
        tone: "error",
      });
      return;
    }

    let payload: Partial<Task> = {
      completionStatus,
      satisfactionLevel,
      completedAt:
        completionStatus === "Completed" ? new Date().toISOString() : undefined,
      status: completionStatus === "Completed" ? "Completed" : "In Progress",
      timerStatus: "Idle",
      activeSessionStartedAt: null,
    };

    if (task.timerStatus === "Running" && task.activeSessionStartedAt) {
      const startTime = new Date(task.activeSessionStartedAt);
      const endTime = new Date();
      const durationSeconds = Math.max(
        0,
        Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
      );

      payload = {
        ...payload,
        actualTimeSpentSeconds:
          (task.actualTimeSpentSeconds || 0) + durationSeconds,
        timeEntries: [
          ...(task.timeEntries || []),
          {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            durationSeconds,
          },
        ],
      };
    }

    await updateTask(task._id, payload);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">
                Today task
              </p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                All tasks created in today&apos;s scheduler.
              </h1>
              <p className="mt-2 text-sm text-foreground/65">
                Yaha par sirf aaj ke scheduled slot-tasks visible hain.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/tasks">Back to Create Task</Link>
            </Button>
          </div>
        </Card>

        {todayTasks.length === 0 ? (
          <Card className="text-sm text-foreground/60">
            Aaj ke liye abhi koi scheduled task nahi hai.
          </Card>
        ) : (
          <div className="space-y-5">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Remaining Tasks</h2>
                <Badge className="bg-muted text-foreground">
                  {remainingTasks.length}
                </Badge>
              </div>
              {remainingTasks.length === 0 ? (
                <Card className="text-sm text-foreground/60">
                  Aaj ke saare tasks complete ho gaye.
                </Card>
              ) : (
                <div className="grid gap-4">
                  {remainingTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      tick={tick}
                      getCompletion={getCompletion}
                      getSatisfaction={getSatisfaction}
                      onCompletionChange={(value) =>
                        setCompletionMap((current) => ({
                          ...current,
                          [task._id]: value,
                        }))
                      }
                      onSatisfactionChange={(value) =>
                        setSatisfactionMap((current) => ({
                          ...current,
                          [task._id]: value,
                        }))
                      }
                      onStart={() => startTimer(task)}
                      onPause={() => pauseTimer(task)}
                      onStop={() => pauseTimer(task, true)}
                      onComplete={() => completeTask(task)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Task Completed</h2>
                <Badge className="bg-emerald-600 text-white">
                  {completedTasks.length}
                </Badge>
              </div>
              {completedTasks.length === 0 ? (
                <Card className="text-sm text-foreground/60">
                  Aaj abhi koi completed task nahi hai.
                </Card>
              ) : (
                <div className="grid gap-4">
                  {completedTasks.map((task) => (
                    <CompletedTaskCard
                      key={task._id}
                      task={task}
                      tick={tick}
                      getSatisfaction={getSatisfaction}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TaskCard({
  task,
  tick,
  getCompletion,
  getSatisfaction,
  onCompletionChange,
  onSatisfactionChange,
  onStart,
  onPause,
  onStop,
  onComplete,
}: TaskCardProps) {
  return (
    <Card className="space-y-4 border-border/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p className="text-sm text-foreground/65">
            {formatSlot(task.slotStartMinutes)} -{" "}
            {formatSlot(task.slotEndMinutes)}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge>{task.priority}</Badge>
          <Badge>{task.completionStatus || task.status || "Pending"}</Badge>
        </div>
      </div>
      <p className="text-sm text-foreground/70">
        {task.notes || task.description || "No notes added."}
      </p>

      <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/25 p-3 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
            Timer
          </p>
          <p className="mt-1 text-sm font-medium">
            {task.timerStatus || "Idle"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
            Tracked
          </p>
          <p className="mt-1 text-sm font-medium">
            {formatDuration(getLiveElapsed(task, tick))}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
            Sessions
          </p>
          <p className="mt-1 text-sm font-medium">
            {(task.timeEntries || []).length}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
            Est. vs actual
          </p>
          <p className="mt-1 text-sm font-medium">
            {task.estimatedTime || 0}m /{" "}
            {Math.round(getLiveElapsed(task, tick) / 60)}m
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          Satisfaction: {getSatisfaction(task)}
        </span>
        <span className="inline-flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Status: {getCompletion(task)}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FieldGroup label="Completion status">
          <select
            className="h-10 w-full rounded-xl border bg-card px-3 text-sm"
            value={getCompletion(task)}
            onChange={(event) =>
              onCompletionChange(event.target.value as CompletionStatus)
            }
          >
            {COMPLETION_OPTIONS.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </FieldGroup>
        <FieldGroup label="Satisfaction rating (1-10)">
          <Input
            type="number"
            min={0}
            max={10}
            value={getSatisfaction(task)}
            onChange={(event) =>
              onSatisfactionChange(Number(event.target.value))
            }
          />
        </FieldGroup>
      </div>

      <div className="flex flex-wrap gap-2">
        {task.timerStatus === "Running" ? (
          <Button
            size="sm"
            className="bg-secondary text-white"
            onClick={onPause}
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button size="sm" className="bg-primary text-white" onClick={onStart}>
            <Play className="mr-2 h-4 w-4" />
            {task.timerStatus === "Paused" ? "Resume" : "Start"}
          </Button>
        )}

        <Button size="sm" variant="outline" onClick={onStop}>
          <Square className="mr-2 h-4 w-4" />
          Stop
        </Button>

        <Button size="sm" className="bg-accent text-white" onClick={onComplete}>
          Mark Completion
        </Button>
      </div>
    </Card>
  );
}

function CompletedTaskCard({
  task,
  tick,
  getSatisfaction,
}: {
  task: Task;
  tick: number;
  getSatisfaction: (task: Task) => number;
}) {
  return (
    <Card className="space-y-3 border-border/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{task.title}</h3>
          <p className="text-sm text-foreground/60">
            {formatDate(task.scheduledDate || task.deadline || task.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge>{task.priority}</Badge>
          <Badge>{task.completionStatus || "Completed"}</Badge>
        </div>
      </div>

      <p className="text-sm text-foreground/65">
        {formatSlot(task.slotStartMinutes)} - {formatSlot(task.slotEndMinutes)}
      </p>

      <div className="grid gap-2 text-sm text-foreground/70 sm:grid-cols-3">
        <p>Tracked: {Math.round(getLiveElapsed(task, tick) / 60)} min</p>
        <p>Sessions: {(task.timeEntries || []).length}</p>
        <p>Satisfaction: {getSatisfaction(task)}</p>
      </div>
    </Card>
  );
}

function isSameDay(dateValue: string | undefined, selectedDate: string) {
  if (!dateValue) return false;
  const left = new Date(dateValue);
  const right = new Date(selectedDate);
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatSlot(minutes: number | undefined) {
  if (typeof minutes !== "number") return "--:--";
  const clamped = Math.max(0, Math.min(minutes, 1439));
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${meridiem}`;
}

function formatDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
