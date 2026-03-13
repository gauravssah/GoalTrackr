"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { buildDashboardStats } from "@/lib/dashboard";
import { useAppStore } from "@/store/use-app-store";

const colors = ["#0f766e", "#f97316", "#22c55e", "#3b82f6"];

export function ChartsGrid() {
  const tasks = useAppStore((state) => state.tasks);
  const goals = useAppStore((state) => state.goals);
  const surveys = useAppStore((state) => state.surveys);
  const stats = buildDashboardStats(tasks, goals, surveys);

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Daily productivity</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.dailyProductivity}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#0f766e" strokeWidth={3} />
              <Line type="monotone" dataKey="planned" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Weekly progress</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyProgressChart}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#0f766e" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Task priority distribution</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stats.priorityDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100}>
                {stats.priorityDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Yearly productivity trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.yearlyTrend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="productivity" fill="#14b8a6" stroke="#0f766e" fillOpacity={0.35} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Satisfaction level analysis</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.satisfactionAnalysis}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Distraction analysis</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stats.distractionAnalysis} dataKey="value" nameKey="name" outerRadius={100}>
                {stats.distractionAnalysis.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
