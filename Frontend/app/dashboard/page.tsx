import { AppShell } from "@/components/layout/app-shell";
import { ChartsGrid } from "@/components/dashboard/charts-grid";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TimeInsights } from "@/components/dashboard/time-insights";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <StatsGrid />
        <TimeInsights />
        <ChartsGrid />
        <HeatmapCard />
      </div>
    </AppShell>
  );
}
