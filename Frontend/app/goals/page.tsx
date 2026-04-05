"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";
import type { Goal, GoalStatus } from "@/types";

type GoalPeriod = Exclude<Goal["period"], "Daily">;

const CATEGORIES: GoalPeriod[] = ["Weekly", "Monthly", "Yearly"];
const STATUS_OPTIONS: GoalStatus[] = [
  "Completed",
  "Partially Completed",
  "Not Completed",
  "Pending",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  period: "Weekly" as Goal["period"],
  dueDate: "",
  status: "Pending" as GoalStatus,
  satisfactionScore: 7,
};

export default function GoalsPage() {
  const goals = useAppStore((state) => state.goals);
  const createGoal = useAppStore((state) => state.createGoal);
  const updateGoal = useAppStore((state) => state.updateGoal);
  const deleteGoal = useAppStore((state) => state.deleteGoal);

  const [filter, setFilter] = useState<GoalStatus | "All">("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const grouped = useMemo<Record<GoalPeriod, Goal[]>>(
    () => ({
      Weekly: goals.filter((goal) => goal.period === "Weekly"),
      Monthly: goals.filter((goal) => goal.period === "Monthly"),
      Yearly: goals.filter((goal) => goal.period === "Yearly"),
    }),
    [goals],
  );

  async function saveGoal() {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      period: form.period,
      dueDate: form.dueDate,
      targetValue: 1,
      currentValue:
        form.status === "Completed"
          ? 1
          : form.status === "Partially Completed"
            ? 0.5
            : 0,
      status: form.status,
      satisfactionScore: Number(form.satisfactionScore),
      completed: form.status === "Completed",
    };

    if (editingId) {
      await updateGoal(editingId, payload);
    } else {
      await createGoal(payload);
    }

    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function editGoal(goal: Goal) {
    setEditingId(goal._id);
    setForm({
      title: goal.title,
      description: goal.description,
      period: goal.period,
      dueDate: goal.dueDate ? goal.dueDate.slice(0, 10) : "",
      status: goal.status || (goal.completed ? "Completed" : "Pending"),
      satisfactionScore: goal.satisfactionScore || 7,
    });
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">
              Goal management
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Weekly, monthly, and yearly goals in one place.
            </h1>
            <p className="max-w-3xl text-sm text-foreground/65">
              Track progress, status, and satisfaction for long-term planning
              without mixing it into the scheduler.
            </p>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit goal" : "Create goal"}
              </h2>
              <p className="text-sm text-foreground/60">
                Keep the form compact and update progress as you go.
              </p>
            </div>

            <FieldGroup label="Title">
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Goal title"
              />
            </FieldGroup>
            <FieldGroup label="Description">
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="What does success look like?"
              />
            </FieldGroup>

            <div className="grid gap-3 sm:grid-cols-2">
              <FieldGroup label="Category">
                <select
                  className="h-11 w-full rounded-xl border bg-card px-4"
                  value={form.period}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      period: event.target.value as Goal["period"],
                    })
                  }
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup label="Deadline">
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm({ ...form, dueDate: event.target.value })
                  }
                />
              </FieldGroup>
              <FieldGroup label="Status">
                <select
                  className="h-11 w-full rounded-xl border bg-card px-4"
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as GoalStatus,
                    })
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup label="Satisfaction score">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={form.satisfactionScore}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      satisfactionScore: Number(event.target.value),
                    })
                  }
                />
              </FieldGroup>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={saveGoal}>
                {editingId ? "Update goal" : "Save goal"}
              </Button>
              {editingId ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Goal tracker panels</h2>
                <p className="text-sm text-foreground/60">
                  Filter by status and review progress by category.
                </p>
              </div>
              <select
                className="h-10 rounded-xl border bg-card px-3 text-sm"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as GoalStatus | "All")
                }
              >
                <option value="All">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {CATEGORIES.map((category) => {
                const categoryGoals = grouped[category].filter(
                  (goal) =>
                    filter === "All" || (goal.status || "Pending") === filter,
                );
                return (
                  <section
                    key={category}
                    className="rounded-3xl border border-border/70 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold">
                          {category} goals
                        </h3>
                        <p className="text-xs text-foreground/55">
                          Focused planning for the {category.toLowerCase()}{" "}
                          view.
                        </p>
                      </div>
                      <Badge>{categoryGoals.length}</Badge>
                    </div>

                    {categoryGoals.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-foreground/60">
                        No goals in this section.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categoryGoals.map((goal) => {
                          const progress = goal.targetValue
                            ? Math.min(
                                (goal.currentValue / goal.targetValue) * 100,
                                100,
                              )
                            : 0;
                          return (
                            <article
                              key={goal._id}
                              className="rounded-2xl border border-border/60 bg-card/75 p-4"
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <h4 className="font-semibold">
                                    {goal.title}
                                  </h4>
                                  <p className="text-sm text-foreground/65">
                                    {goal.description ||
                                      "No description added."}
                                  </p>
                                </div>
                                <Badge>{goal.status || "Pending"}</Badge>
                              </div>
                              <div className="mt-3">
                                <Progress value={progress} />
                              </div>
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-foreground/60">
                                <span>
                                  {goal.currentValue} / {goal.targetValue}{" "}
                                  complete
                                </span>
                                <span>
                                  Due{" "}
                                  {goal.dueDate
                                    ? new Date(
                                        goal.dueDate,
                                      ).toLocaleDateString()
                                    : "No deadline"}
                                </span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editGoal(goal)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateGoal(goal._id, {
                                      currentValue: Math.min(
                                        goal.currentValue + 1,
                                        goal.targetValue,
                                      ),
                                      completed:
                                        goal.currentValue + 1 >=
                                        goal.targetValue,
                                      status:
                                        goal.currentValue + 1 >=
                                        goal.targetValue
                                          ? "Completed"
                                          : "Partially Completed",
                                    })
                                  }
                                >
                                  +1 progress
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteGoal(goal._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
