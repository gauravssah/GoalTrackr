"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { buildDashboardStats } from "@/lib/dashboard";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export function HeatmapCard() {
  const tasks = useAppStore((state) => state.tasks);
  const goals = useAppStore((state) => state.goals);
  const surveys = useAppStore((state) => state.surveys);
  const stats = buildDashboardStats(tasks, goals, surveys);
  const heatmap = stats.heatmap;
  const [selectedDate, setSelectedDate] = useState(heatmap[heatmap.length - 1]?.date ?? "");
  const selectedDetails = useMemo(
    () => stats.heatmapDetails.find((item) => item.date === selectedDate) ?? stats.heatmapDetails[stats.heatmapDetails.length - 1],
    [selectedDate, stats.heatmapDetails]
  );

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Productivity heatmap</h3>
          <p className="text-sm text-foreground/60">GitHub-style activity across recent days.</p>
        </div>
        <p className="text-sm font-medium text-accent">{stats.streakDays} day productivity streak</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid grid-cols-7 gap-2 md:grid-cols-14">
        {heatmap.map((item) => (
          <button
            key={item.date}
            type="button"
            onClick={() => setSelectedDate(item.date)}
            className="aspect-square rounded-md border border-transparent text-[10px] font-medium text-foreground/55 transition hover:scale-[1.02]"
            style={{
              backgroundColor:
                item.count === 0
                  ? "rgba(148, 163, 184, 0.15)"
                  : `rgba(15, 118, 110, ${0.2 + item.count * 0.12})`
            }}
            title={`${item.date}: ${item.count} activities`}
          >
            {Number(item.date.slice(-2))}
          </button>
        ))}
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/75 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Selected date</p>
          <h4 className="mt-2 text-lg font-semibold">{selectedDetails ? formatDate(selectedDetails.date) : "No date selected"}</h4>
          <p className="mt-1 text-sm text-foreground/60">
            {selectedDetails?.completedTasks.length ? `${selectedDetails.completedTasks.length} completed tasks` : "No completed task on this date"}
          </p>
          <div className="mt-4 space-y-2">
            {selectedDetails?.completedTasks.length ? (
              selectedDetails.completedTasks.map((task) => (
                <div key={task.taskId} className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                  <p className="font-medium">{task.taskTitle}</p>
                  <p className="text-sm text-foreground/60">Completed at {new Date(task.completedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-3 text-sm text-foreground/60">
                No completed tasks were recorded on this date.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
