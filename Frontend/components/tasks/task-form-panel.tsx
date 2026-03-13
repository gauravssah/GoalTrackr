"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";
import { Task } from "@/types";
import { isSameDay, sortTasks } from "@/lib/task-helpers";

type TaskForm = {
  title: string;
  description: string;
  priority: Task["priority"];
  sequence: number;
  deadline: string;
  estimatedTime: number;
  tags: string;
  status: Task["status"];
  distractionCount: number;
  notes: string;
  satisfactionLevel: number;
};

const emptyTask: TaskForm = {
  title: "",
  description: "",
  priority: "Medium",
  sequence: 1,
  deadline: "",
  estimatedTime: 30,
  tags: "",
  status: "Pending",
  distractionCount: 0,
  notes: "",
  satisfactionLevel: 7
};

export function TaskFormPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const tasks = useAppStore((state) => state.tasks);
  const createTask = useAppStore((state) => state.createTask);
  const updateTask = useAppStore((state) => state.updateTask);
  const [form, setForm] = useState<TaskForm>(emptyTask);

  const sortedTasks = useMemo(() => sortTasks(tasks), [tasks]);
  const dailySequence = useMemo(() => sortedTasks.filter((task) => task.status !== "Completed" && isSameDay(task.deadline)), [sortedTasks]);
  const editingTask = useMemo(() => tasks.find((task) => task._id === editId) ?? null, [editId, tasks]);

  useEffect(() => {
    if (!editingTask) {
      setForm(emptyTask);
      return;
    }

    setForm({
      title: editingTask.title,
      description: editingTask.description,
      priority: editingTask.priority,
      sequence: editingTask.sequence ?? 1,
      deadline: editingTask.deadline ? editingTask.deadline.slice(0, 10) : "",
      estimatedTime: editingTask.estimatedTime,
      tags: editingTask.tags.join(", "),
      status: editingTask.status,
      distractionCount: editingTask.distractionCount,
      notes: editingTask.notes || "",
      satisfactionLevel: editingTask.satisfactionLevel || 7
    });
  }, [editingTask]);

  async function handleSubmit() {
    const nextSequence =
      editId || !form.deadline || !isSameDay(form.deadline)
        ? form.sequence
        : dailySequence.length === 0
          ? 1
          : Math.max(...dailySequence.map((task) => task.sequence ?? 0)) + 1;

    const payload = {
      ...form,
      sequence: Number(nextSequence) || 1,
      estimatedTime: Number(form.estimatedTime),
      distractionCount: Number(form.distractionCount),
      satisfactionLevel: Number(form.satisfactionLevel),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      completedAt: form.status === "Completed" ? new Date().toISOString() : undefined,
      timeEntries: editId ? undefined : []
    };

    if (editId) {
      await updateTask(editId, payload);
    } else {
      await createTask(payload);
    }

    setForm(emptyTask);
    router.push("/tasks");
  }

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{editId ? "Edit task" : "Create a new task"}</h1>
          <p className="mt-1 text-sm text-foreground/60">Task creation now lives on a separate route so the workspace stays cleaner, especially on smaller screens.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/tasks")}>
          Back to tasks
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup label="Task title" hint="Use a short title that is easy to recognize in the list.">
          <Input placeholder="Example: Complete React dashboard" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </FieldGroup>

        <FieldGroup label="Priority" hint="Set the urgency level to High, Medium, or Low.">
          <select
            className="h-11 w-full rounded-xl border bg-card px-4"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </FieldGroup>

        <div className="md:col-span-2">
          <FieldGroup label="Task description" hint="Describe the exact outcome you want to complete.">
            <Textarea placeholder="What exactly do you want to finish?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FieldGroup>
        </div>

        <FieldGroup label="Status" hint="Choose the current stage of this task.">
          <select className="h-11 w-full rounded-xl border bg-card px-4" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Task["status"] })}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </FieldGroup>

        <FieldGroup label="Deadline" hint="Pick the date when this task should be completed.">
          <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </FieldGroup>

        <FieldGroup label="Today sequence number" hint="Set the order for today&apos;s list, such as 1 or 2.">
          <Input type="number" min={1} placeholder="1" value={form.sequence} onChange={(e) => setForm({ ...form, sequence: Number(e.target.value) })} />
        </FieldGroup>

        <FieldGroup label="Estimated time (minutes)" hint="Enter the expected time in minutes, such as 30 or 90.">
          <Input type="number" min={0} placeholder="30" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: Number(e.target.value) })} />
        </FieldGroup>

        <FieldGroup label="Distraction count" hint="Count how many times your focus was interrupted while working on this task.">
          <Input type="number" min={0} placeholder="0" value={form.distractionCount} onChange={(e) => setForm({ ...form, distractionCount: Number(e.target.value) })} />
        </FieldGroup>

        <FieldGroup label="Satisfaction score (1-10)" hint="Rate how satisfied you felt after completing the task.">
          <Input type="number" min={1} max={10} placeholder="7" value={form.satisfactionLevel} onChange={(e) => setForm({ ...form, satisfactionLevel: Number(e.target.value) })} />
        </FieldGroup>

        <div className="md:col-span-2">
          <FieldGroup label="Tags" hint="Separate categories with commas, for example: work, study, health.">
            <Input placeholder="work, study, health" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </FieldGroup>
        </div>

        <div className="md:col-span-2">
          <FieldGroup label="Task notes" hint="Add blockers, links, reminders, learnings, or the next step.">
            <Textarea placeholder="Blockers, links, reminders, learnings" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </FieldGroup>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSubmit}>{editId ? "Update task" : "Save task"}</Button>
        <Button
          variant="outline"
          onClick={() => {
            setForm(emptyTask);
            router.push("/tasks");
          }}
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
}
