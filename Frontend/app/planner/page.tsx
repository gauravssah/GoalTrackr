"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CalendarRange, CalendarSync, Milestone, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { percentage } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { Goal } from "@/types";

const periods = [
  { key: "Daily", label: "Daily Planner", icon: CalendarDays, helper: "Track today's targets, habits, and must-finish outcomes." },
  { key: "Weekly", label: "Weekly Planner", icon: CalendarRange, helper: "Plan your week in sequence with measurable checkpoints and tracking." },
  { key: "Monthly", label: "Monthly Planner", icon: CalendarSync, helper: "Monitor monthly themes, milestones, and bigger deliverables." },
  { key: "Yearly", label: "Yearly Planner", icon: Milestone, helper: "Track long-term goals, yearly objectives, and big wins." }
] as const;

const emptyGoal = {
  title: "",
  description: "",
  period: "Daily",
  targetValue: 1,
  currentValue: 0,
  dueDate: "",
  completed: false
};

type PeriodType = (typeof periods)[number]["key"];

function GoalSection({
  title,
  helper,
  goals,
  onEdit,
  onProgress,
  onDelete
}: {
  title: string;
  helper: string;
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onProgress: (goal: Goal) => void;
  onDelete: (id: string) => void;
}) {
  const sortedGoals = [...goals].sort((a, b) => {
    const completedDiff = Number(a.completed) - Number(b.completed);
    if (completedDiff !== 0) return completedDiff;
    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    return aDue - bDue;
  });

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-foreground/60">{helper}</p>
      </div>
      {sortedGoals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-foreground/60">
          No plans added yet for this section.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedGoals.map((goal, index) => {
            const progress = goal.targetValue ? (goal.currentValue / goal.targetValue) * 100 : 0;
            return (
              <div key={goal._id} className="rounded-2xl border border-border p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Step {index + 1}</p>
                    <h3 className="mt-2 text-xl font-semibold">{goal.title}</h3>
                    <p className="mt-1 text-sm text-foreground/65">{goal.description}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{percentage(progress)}</span>
                </div>
                <Progress value={progress} />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-foreground/60">
                  <span>{goal.currentValue} / {goal.targetValue} complete</span>
                  <span>Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : "No due date"}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>Edit</Button>
                  <Button size="sm" onClick={() => onProgress(goal)}>Track progress</Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(goal._id)}>Delete</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default function PlannerPage() {
  const goals = useAppStore((state) => state.goals);
  const createGoal = useAppStore((state) => state.createGoal);
  const updateGoal = useAppStore((state) => state.updateGoal);
  const deleteGoal = useAppStore((state) => state.deleteGoal);
  const [form, setForm] = useState(emptyGoal);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodType>("Daily");

  const groupedGoals = useMemo(
    () => ({
      Daily: goals.filter((goal) => goal.period === "Daily"),
      Weekly: goals.filter((goal) => goal.period === "Weekly"),
      Monthly: goals.filter((goal) => goal.period === "Monthly"),
      Yearly: goals.filter((goal) => goal.period === "Yearly")
    }),
    [goals]
  );

  const summary = useMemo(
    () =>
      periods.map((period) => {
        const periodGoals = groupedGoals[period.key];
        const completed = periodGoals.filter((goal) => goal.completed).length;
        const total = periodGoals.length;
        const progress = total
          ? periodGoals.reduce((sum, goal) => sum + (goal.targetValue ? (goal.currentValue / goal.targetValue) * 100 : 0), 0) / total
          : 0;

        return {
          ...period,
          total,
          completed,
          progress
        };
      }),
    [groupedGoals]
  );

  async function handleSubmit() {
    const payload = {
      ...form,
      period: activePeriod,
      targetValue: Number(form.targetValue),
      currentValue: Number(form.currentValue),
      completed: Number(form.currentValue) >= Number(form.targetValue)
    };

    if (editingId) {
      await updateGoal(editingId, payload);
      setEditingId(null);
    } else {
      await createGoal(payload);
    }

    setForm({ ...emptyGoal, period: activePeriod });
  }

  function startEdit(goal: Goal) {
    setEditingId(goal._id);
    setActivePeriod(goal.period);
    setForm({
      title: goal.title,
      description: goal.description,
      period: goal.period,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      dueDate: goal.dueDate ? goal.dueDate.slice(0, 10) : "",
      completed: goal.completed
    });
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Multi-level planner</h1>
              <p className="mt-1 text-sm text-foreground/60">Daily sequence se leke weekly tracking, monthly planning aur yearly goals tak sab clear sections me hai.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {periods.map((period) => {
                const Icon = period.icon;
                return (
                  <button
                    key={period.key}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${activePeriod === period.key ? "border-primary bg-primary/10" : "border-border bg-card"}`}
                    onClick={() => {
                      setActivePeriod(period.key);
                      setForm((current) => ({ ...current, period: period.key }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{period.key}</span>
                    </div>
                    <p className="mt-1 text-xs text-foreground/60">{period.helper}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4 rounded-3xl border border-border p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">{activePeriod}</p>
                <h2 className="mt-2 text-2xl font-semibold">{editingId ? `Edit ${activePeriod.toLowerCase()} plan` : `Create ${activePeriod.toLowerCase()} plan`}</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  {activePeriod === "Daily" && "Aaj ke tasks ko order aur outcome ke saath define karo."}
                  {activePeriod === "Weekly" && "Week ke checkpoints banao aur progress regularly update karo."}
                  {activePeriod === "Monthly" && "Month ke milestones aur projects ko measurable banao."}
                  {activePeriod === "Yearly" && "Long-term goals ko clear annual targets me track karo."}
                </p>
              </div>
              <FieldGroup label="Plan title">
                <Input placeholder={`${activePeriod} goal title`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Plan description">
                <Textarea placeholder={`${activePeriod} goal description and what success looks like`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </FieldGroup>
              <div className="grid gap-3 md:grid-cols-2">
                <FieldGroup label="Due date">
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </FieldGroup>
                <FieldGroup label="Target value">
                  <Input type="number" min={1} placeholder="Target value" value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: Number(e.target.value) })} />
                </FieldGroup>
                <FieldGroup label="Current progress">
                  <Input type="number" min={0} placeholder="Current progress" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: Number(e.target.value) })} />
                </FieldGroup>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSubmit}>{editingId ? "Update plan" : `Save ${activePeriod.toLowerCase()} plan`}</Button>
                {editingId ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ ...emptyGoal, period: activePeriod });
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {summary.map((period) => (
                <div key={period.key} className="rounded-3xl border border-border p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">{period.key}</p>
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-3xl font-semibold">{period.total}</p>
                  <p className="mt-1 text-sm text-foreground/60">{period.completed} completed • {percentage(period.progress)} average progress</p>
                  <Progress className="mt-4" value={period.progress} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Planning ladder</h2>
            </div>
            <p className="text-sm text-foreground/60">Daily se yearly tak planning order me rakhi gayi hai taaki short-term aur long-term dono connected feel ho.</p>
            <div className="space-y-3">
              {periods.map((period, index) => {
                const periodGoals = groupedGoals[period.key];
                const nextGoal = [...periodGoals].sort((a, b) => {
                  const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
                  const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
                  return aDue - bDue;
                })[0];

                return (
                  <div key={period.key} className="rounded-2xl border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Level {index + 1}</p>
                        <h3 className="mt-1 text-lg font-semibold">{period.label}</h3>
                        <p className="mt-1 text-sm text-foreground/60">{period.helper}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {periodGoals.length} active
                      </span>
                    </div>
                    <div className="mt-3 rounded-2xl bg-muted/40 p-3 text-sm text-foreground/65">
                      {nextGoal ? (
                        <p>
                          Next focus: {nextGoal.title}
                          {nextGoal.dueDate ? ` • due ${new Date(nextGoal.dueDate).toLocaleDateString()}` : ""}
                        </p>
                      ) : (
                        <p>No goal added yet for this layer.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-5 2xl:grid-cols-2">
            {periods.map((period) => (
              <GoalSection
                key={period.key}
                title={period.label}
                helper={period.helper}
                goals={groupedGoals[period.key]}
                onEdit={startEdit}
                onProgress={(goal) =>
                  updateGoal(goal._id, {
                    currentValue: Math.min(goal.currentValue + 1, goal.targetValue),
                    completed: goal.currentValue + 1 >= goal.targetValue
                  })
                }
                onDelete={deleteGoal}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
