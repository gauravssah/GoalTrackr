"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckSquare2,
  Clock3,
  PencilLine,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildDailySlots,
  formatClock,
  getTaskCompletionColor,
  getTaskSlotCoverage,
  groupContinuousIndices,
  slotMinutesToIso,
} from "@/lib/scheduler";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { useToastStore } from "@/store/use-toast-store";
import type { CompletionStatus, Priority, Task } from "@/types";

const COMPLETION_OPTIONS: CompletionStatus[] = [
  "Completed",
  "Partially Completed",
  "Not Completed",
  "Pending",
];
const PRIORITY_OPTIONS: Priority[] = ["High", "Medium", "Low"];
const TODAY = new Date().toISOString().slice(0, 10);
const SLOTS = buildDailySlots(30);

export function SmartScheduler() {
  const tasks = useAppStore((state) => state.tasks);
  const createTask = useAppStore((state) => state.createTask);
  const updateTask = useAppStore((state) => state.updateTask);
  const deleteTask = useAppStore((state) => state.deleteTask);
  const pushToast = useToastStore((state) => state.pushToast);

  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    priority: "Medium" as Priority,
    completionStatus: "Pending" as CompletionStatus,
    satisfactionLevel: 0,
    notes: "",
  });
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dayTasks = useMemo(
    () =>
      tasks
        .filter((task) => isSameDay(task.scheduledDate, selectedDate))
        .sort(
          (left, right) =>
            (left.slotStartMinutes ?? 0) - (right.slotStartMinutes ?? 0),
        ),
    [selectedDate, tasks],
  );

  const slotTaskMap = useMemo(() => {
    const map = new Map<number, Task>();

    for (const task of dayTasks) {
      const coveredSlots = getTaskSlotCoverage(task, SLOTS);
      for (const slotIndex of coveredSlots) {
        map.set(slotIndex, task);
      }
    }

    return map;
  }, [dayTasks]);

  const selectedBlocks = useMemo(
    () => groupContinuousIndices(selectedSlots),
    [selectedSlots],
  );
  const activeTask = useMemo(
    () => dayTasks.find((task) => task._id === activeTaskId) ?? null,
    [activeTaskId, dayTasks],
  );
  const editingTask = useMemo(
    () => dayTasks.find((task) => task._id === editingTaskId) ?? null,
    [editingTaskId, dayTasks],
  );

  const totalFocusedHours = useMemo(() => {
    return dayTasks.reduce((sum, task) => {
      if (
        typeof task.slotStartMinutes !== "number" ||
        typeof task.slotEndMinutes !== "number"
      )
        return sum;
      return (
        sum + Math.max(0, task.slotEndMinutes - task.slotStartMinutes) / 60
      );
    }, 0);
  }, [dayTasks]);

  const averageSatisfaction = useMemo(() => {
    const scored = dayTasks.filter(
      (task) => typeof task.satisfactionLevel === "number",
    );
    if (!scored.length) return 0;

    return Number(
      (
        scored.reduce((sum, task) => sum + (task.satisfactionLevel || 0), 0) /
        scored.length
      ).toFixed(1),
    );
  }, [dayTasks]);

  const freeSlots = SLOTS.length - slotTaskMap.size;

  useEffect(() => {
    setActiveTaskId(null);
    setEditingTaskId(null);
    setSelectedSlots([]);
  }, [selectedDate]);

  function toggleSlot(index: number) {
    if (slotTaskMap.has(index)) return;
    setSelectedSlots((current) =>
      current.includes(index)
        ? current.filter((value) => value !== index)
        : [...current, index].sort((left, right) => left - right),
    );
  }

  function startEditing(task: Task) {
    setEditingTaskId(task._id);
    setActiveTaskId(task._id);
    setForm({
      title: task.title,
      priority: task.priority,
      completionStatus: task.completionStatus || "Pending",
      satisfactionLevel: task.satisfactionLevel ?? 0,
      notes: task.notes || "",
    });
    setSelectedSlots(getTaskSlotCoverage(task, SLOTS));
  }

  async function saveSelection() {
    const blocks = selectedBlocks.length ? selectedBlocks : [];
    if (!form.title.trim() || !blocks.length) return;

    if (
      form.completionStatus !== "Pending" &&
      (Number.isNaN(form.satisfactionLevel) || form.satisfactionLevel <= 0)
    ) {
      pushToast({
        title: "Satisfaction score required",
        description: "Please add a score from 1 to 10 before saving.",
        tone: "error",
      });
      return;
    }

    if (editingTaskId && editingTask) {
      const firstSlot = SLOTS[selectedSlots[0]];
      const lastSlot = SLOTS[selectedSlots[selectedSlots.length - 1]];
      if (!firstSlot || !lastSlot) return;

      await updateTask(editingTaskId, {
        title: form.title.trim(),
        priority: form.priority,
        completionStatus: form.completionStatus,
        satisfactionLevel: form.satisfactionLevel,
        notes: form.notes.trim(),
        status: form.completionStatus === "Completed" ? "Completed" : "Pending",
        scheduledDate: new Date(selectedDate).toISOString(),
        startTime: slotMinutesToIso(selectedDate, firstSlot.startMinutes),
        endTime: slotMinutesToIso(selectedDate, lastSlot.endMinutes),
        slotStartMinutes: firstSlot.startMinutes,
        slotEndMinutes: lastSlot.endMinutes,
        deadline: slotMinutesToIso(selectedDate, lastSlot.endMinutes),
      });
      clearComposer();
      return;
    }

    await Promise.all(
      blocks.map(async (block) => {
        const firstSlot = SLOTS[block.start];
        const lastSlot = SLOTS[block.end];
        if (!firstSlot || !lastSlot) return;

        await createTask({
          title: form.title.trim(),
          description: form.notes.trim() || "",
          priority: form.priority,
          status:
            form.completionStatus === "Completed" ? "Completed" : "Pending",
          completionStatus: form.completionStatus,
          satisfactionLevel: form.satisfactionLevel,
          scheduledDate: new Date(selectedDate).toISOString(),
          startTime: slotMinutesToIso(selectedDate, firstSlot.startMinutes),
          endTime: slotMinutesToIso(selectedDate, lastSlot.endMinutes),
          slotStartMinutes: firstSlot.startMinutes,
          slotEndMinutes: lastSlot.endMinutes,
          deadline: slotMinutesToIso(selectedDate, lastSlot.endMinutes),
          estimatedTime: Math.max(
            30,
            lastSlot.endMinutes - firstSlot.startMinutes,
          ),
          tags: ["scheduled"],
          timeEntries: [],
          distractionCount: 0,
          notes: form.notes.trim(),
        });
      }),
    );

    clearComposer();
  }

  async function updateCompletion(task: Task) {
    if (
      form.completionStatus !== "Pending" &&
      (Number.isNaN(form.satisfactionLevel) || form.satisfactionLevel <= 0)
    ) {
      pushToast({
        title: "Satisfaction score required",
        description: "Please add a score from 1 to 10 before updating.",
        tone: "error",
      });
      return;
    }

    await updateTask(task._id, {
      completionStatus: form.completionStatus,
      satisfactionLevel: form.satisfactionLevel,
      status: form.completionStatus === "Completed" ? "Completed" : task.status,
      notes: form.notes.trim() || task.notes || "",
    });
    setActiveTaskId(task._id);
  }

  function clearComposer() {
    setSelectedSlots([]);
    setEditingTaskId(null);
    setForm({
      title: "",
      priority: "Medium",
      completionStatus: "Pending",
      satisfactionLevel: 0,
      notes: "",
    });
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <Card className="z-20 border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card backdrop-blur md:sticky md:top-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
              Smart scheduler
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
              A single timeline for every day.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-foreground/65">
              Select time slots and assign tasks quickly.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[420px]">
            <div className="rounded-2xl border border-border/70 bg-card/75 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                Today
              </p>
              <p className="mt-1 text-sm font-medium">
                {formatFriendlyDate(selectedDate)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/75 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                Clock
              </p>
              <p className="mt-1 text-sm font-medium">
                {clock.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/75 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                Focused hours
              </p>
              <p className="mt-1 text-sm font-medium">
                {totalFocusedHours.toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="w-full sm:max-w-xs">
            <FieldGroup label="Date">
              <Input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </FieldGroup>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Daily slot grid</h2>
              <p className="text-sm text-foreground/60">
                48 slots from 12:00 AM to 11:59 PM.
              </p>
            </div>
            <Badge className="w-fit bg-muted text-foreground">
              {freeSlots} free / {SLOTS.length} total
            </Badge>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/70 sm:rounded-3xl">
            <div className="hidden grid-cols-[minmax(0,1fr)_92px_minmax(120px,1.4fr)] border-b border-border/70 bg-muted/30 px-4 py-3 text-xs uppercase tracking-[0.2em] text-foreground/45 md:grid">
              <span>Time</span>
              <span>Select</span>
              <span>Status</span>
            </div>

            <div className="max-h-[68vh] overflow-auto md:hidden">
              {SLOTS.map((slot) => {
                const bookedTask = slotTaskMap.get(slot.index) || null;
                const selected = selectedSlots.includes(slot.index);
                const booked = Boolean(bookedTask);

                return (
                  <button
                    key={slot.index}
                    type="button"
                    onClick={() => {
                      if (bookedTask) {
                        setActiveTaskId(bookedTask._id);
                        return;
                      }
                      toggleSlot(slot.index);
                    }}
                    className={cn(
                      "w-full border-b border-border/50 px-4 py-3 text-left transition-colors",
                      selected && "bg-primary/10",
                      booked ? "cursor-pointer" : "cursor-cell",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight">
                          {slot.label}
                        </p>
                        <p className="mt-1 text-xs text-foreground/55">
                          {formatClock(slot.startMinutes)} slot
                        </p>
                        {bookedTask ? (
                          <p className="mt-2 truncate text-sm text-foreground/80">
                            {bookedTask.title}
                          </p>
                        ) : null}
                      </div>
                      <div className="shrink-0">
                        {booked ? (
                          <Badge className="border border-border/70 bg-background text-foreground">
                            Booked
                          </Badge>
                        ) : (
                          <input
                            aria-label={`Select slot ${slot.label}`}
                            type="checkbox"
                            checked={selected}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggleSlot(slot.index)}
                            className="h-5 w-5 rounded border-border"
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="hidden max-h-[68vh] overflow-auto md:block">
              {SLOTS.map((slot) => {
                const bookedTask = slotTaskMap.get(slot.index) || null;
                const selected = selectedSlots.includes(slot.index);
                const booked = Boolean(bookedTask);

                return (
                  <div
                    key={slot.index}
                    onClick={() => {
                      if (bookedTask) {
                        setActiveTaskId(bookedTask._id);
                        return;
                      }
                      toggleSlot(slot.index);
                    }}
                    className={cn(
                      "grid grid-cols-[minmax(0,1fr)_92px_minmax(120px,1.4fr)] items-center gap-3 border-b border-border/50 px-4 py-3 text-left transition-all duration-150 hover:scale-[0.998] hover:bg-muted/40",
                      selected && "bg-primary/10",
                      booked ? "cursor-pointer" : "cursor-cell",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">{slot.label}</p>
                      <p className="text-xs text-foreground/50">
                        {formatClock(slot.startMinutes)} slot
                      </p>
                    </div>
                    <div className="flex items-center justify-start">
                      {booked ? null : (
                        <input
                          aria-label={`Select slot ${slot.label}`}
                          type="checkbox"
                          checked={selected}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleSlot(slot.index)}
                          className="h-4 w-4 rounded border-border"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {bookedTask ? (
                        <>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {bookedTask.title}
                            </p>
                          </div>
                        </>
                      ) : (
                        <Badge className="border border-border/70 bg-background text-foreground">
                          Free
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Task composer</h2>
            </div>
            <p className="text-sm text-foreground/60">
              {selectedSlots.length
                ? `${selectedSlots.length} slots selected. We will merge continuous slots.`
                : "Select slots to open the task composer."}
            </p>

            <FieldGroup label="Task name">
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Task name"
              />
            </FieldGroup>

            <FieldGroup label="Priority">
              <select
                className="h-11 w-full rounded-xl border bg-card px-4"
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value as Priority })
                }
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </FieldGroup>

            <FieldGroup label="Completion status">
              <select
                className="h-11 w-full rounded-xl border bg-card px-4"
                value={form.completionStatus}
                onChange={(event) =>
                  setForm({
                    ...form,
                    completionStatus: event.target.value as CompletionStatus,
                  })
                }
              >
                {COMPLETION_OPTIONS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </FieldGroup>

            <FieldGroup
              label="Satisfaction score"
              hint="Rate the task from 1 to 10."
            >
              <Input
                type="number"
                min={0}
                max={10}
                value={form.satisfactionLevel}
                onChange={(event) =>
                  setForm({
                    ...form,
                    satisfactionLevel: Number(event.target.value),
                  })
                }
              />
            </FieldGroup>

            <FieldGroup label="Notes">
              <Textarea
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
                placeholder="Optional notes or context"
              />
            </FieldGroup>

            <div className="flex flex-wrap gap-2">
              <Button
                className="flex-1 sm:flex-none"
                onClick={saveSelection}
                disabled={!selectedSlots.length || !form.title.trim()}
              >
                {editingTaskId ? "Update task" : "Apply task to selected slots"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={clearComposer}
              >
                Clear
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Booked slot actions</h2>
            </div>

            {activeTask ? (
              <div className="space-y-3 rounded-3xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                      Selected block
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">
                      {activeTask.title}
                    </h3>
                  </div>
                  <Badge
                    className={getTaskCompletionColor(activeTask.priority)}
                  >
                    {activeTask.priority}
                  </Badge>
                </div>
                <p className="text-sm text-foreground/60">
                  {selectedDate} •{" "}
                  {formatClock(activeTask.slotStartMinutes ?? 0)} -{" "}
                  {formatClock(activeTask.slotEndMinutes ?? 0)}
                </p>
                <p className="text-sm text-foreground/65">
                  {activeTask.notes ||
                    activeTask.description ||
                    "No notes added."}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => startEditing(activeTask)}
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    Edit Task
                  </Button>
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    onClick={async () => {
                      await deleteTask(activeTask._id);
                      setActiveTaskId(null);
                      clearComposer();
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </Button>
                </div>
                <div className="grid gap-3">
                  <FieldGroup label="Update status">
                    <select
                      className="h-11 w-full rounded-xl border bg-card px-4"
                      value={form.completionStatus}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          completionStatus: event.target
                            .value as CompletionStatus,
                        })
                      }
                    >
                      {COMPLETION_OPTIONS.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </FieldGroup>
                  <FieldGroup label="Satisfaction score">
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={form.satisfactionLevel}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          satisfactionLevel: Number(event.target.value),
                        })
                      }
                    />
                  </FieldGroup>
                  <Button onClick={() => updateCompletion(activeTask)}>
                    <CheckSquare2 className="mr-2 h-4 w-4" />
                    Update Status
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-4 text-sm text-foreground/60">
                Select a booked slot to edit, delete, or update it.
              </div>
            )}
          </Card>

          <Card className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/75 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                Booked slots
              </p>
              <p className="mt-1 text-2xl font-semibold">{slotTaskMap.size}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/75 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                Avg satisfaction
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {averageSatisfaction || "-"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/75 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                Free slots
              </p>
              <p className="mt-1 text-2xl font-semibold">{freeSlots}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
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

function formatFriendlyDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
