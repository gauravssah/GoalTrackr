import { DailySurvey, Goal, ProductivityStats, Task } from "@/types";

type DashboardBundle = ProductivityStats & {
  streakDays: number;
  yearProgress: number;
  dailyHours: number;
  weeklyHours: number;
  monthlyHours: number;
  yearlyHours: number;
  recentSessions: Array<{
    taskId: string;
    taskTitle: string;
    startTime: string;
    endTime: string;
    durationSeconds: number;
  }>;
  topTasksByTime: Array<{
    taskId: string;
    taskTitle: string;
    totalSeconds: number;
  }>;
  heatmapDetails: Array<{
    date: string;
    completedTasks: Array<{
      taskId: string;
      taskTitle: string;
      completedAt: string;
    }>;
  }>;
};

const today = new Date();

function sameDay(a?: string, bDate = today) {
  if (!a) return false;
  return new Date(a).toDateString() === bDate.toDateString();
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

function isSameWeek(dateString: string) {
  const date = new Date(dateString);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek;
}

export function buildDashboardStats(tasks: Task[], goals: Goal[], surveys: DailySurvey[]): DashboardBundle {
  const completedTasks = tasks.filter((task) => task.status === "Completed");
  const completedToday = completedTasks.filter((task) => sameDay(task.completedAt || task.createdAt)).length;
  const pendingTasks = tasks.filter((task) => task.status !== "Completed").length;
  const focusScore = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;
  const distractionsToday = tasks.filter((task) => sameDay(task.createdAt)).reduce((sum, task) => sum + (task.distractionCount || 0), 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const weekTasks = tasks.filter((task) => new Date(task.createdAt) >= startOfWeek);
  const weekCompleted = weekTasks.filter((task) => task.status === "Completed").length;
  const weeklyProgress = weekTasks.length ? (weekCompleted / weekTasks.length) * 100 : 0;

  const dailyProductivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - index));
    const dateKey = date.toDateString();
    const dayTasks = tasks.filter((task) => new Date(task.createdAt).toDateString() === dateKey);
    const dayCompleted = dayTasks.filter((task) => task.status === "Completed").length;

    return {
      date: formatDayLabel(date),
      completed: dayCompleted,
      planned: dayTasks.length
    };
  });

  const weeklyProgressChart = Array.from({ length: 4 }, (_, index) => {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() - (3 - index) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const count = completedTasks.filter((task) => {
      const completedAt = new Date(task.completedAt || task.createdAt);
      return completedAt >= weekStart && completedAt <= weekEnd;
    }).length;

    return { week: `W${index + 1}`, completed: count };
  });

  const priorityDistribution = ["High", "Medium", "Low"].map((priority) => ({
    name: priority,
    value: tasks.filter((task) => task.priority === priority).length
  }));

  const currentYear = today.getFullYear();
  const yearlyTrend = Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(currentYear, index, 1);
    const monthTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getFullYear() === currentYear && taskDate.getMonth() === index;
    });
    const monthCompleted = monthTasks.filter((task) => task.status === "Completed").length;
    const productivity = monthTasks.length ? (monthCompleted / monthTasks.length) * 100 : 0;

    return {
      month: formatMonthLabel(monthDate),
      productivity: Math.round(productivity)
    };
  });

  const satisfactionAnalysis = surveys.slice(0, 7).reverse().map((survey) => ({
    label: new Date(survey.date).toLocaleDateString("en-US", { weekday: "short" }),
    value: survey.satisfactionRating
  }));

  const distractionSourceMap = new Map<string, number>();
  surveys.forEach((survey) => {
    const key = survey.biggestDistraction || "Other";
    distractionSourceMap.set(key, (distractionSourceMap.get(key) || 0) + 1);
  });

  const distractionAnalysis = Array.from(distractionSourceMap.entries()).map(([name, value]) => ({ name, value }));

  const heatmap = Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (27 - index));
    const dateKey = date.toDateString();
    const count =
      tasks.filter((task) => new Date(task.createdAt).toDateString() === dateKey).length +
      completedTasks.filter((task) => new Date(task.completedAt || task.createdAt).toDateString() === dateKey).length;

    return {
      date: date.toISOString().slice(0, 10),
      count
    };
  });

  const heatmapDetails = heatmap.map((item) => ({
    date: item.date,
    completedTasks: completedTasks
      .filter((task) => new Date(task.completedAt || task.createdAt).toISOString().slice(0, 10) === item.date)
      .map((task) => ({
        taskId: task._id,
        taskTitle: task.title,
        completedAt: task.completedAt || task.createdAt
      }))
  }));

  let streakDays = 0;
  for (let index = 0; index < 30; index += 1) {
    const date = new Date();
    date.setDate(today.getDate() - index);
    const hasActivity = heatmap.some((item) => item.date === date.toISOString().slice(0, 10) && item.count > 0);
    if (!hasActivity) break;
    streakDays += 1;
  }

  const yearlyGoals = goals.filter((goal) => goal.period === "Yearly");
  const yearProgress = yearlyGoals.length ? (yearlyGoals.filter((goal) => goal.completed).length / yearlyGoals.length) * 100 : 0;

  const sessions = tasks.flatMap((task) =>
    (task.timeEntries || []).map((entry) => ({
      taskId: task._id,
      taskTitle: task.title,
      ...entry
    }))
  );

  const dailyHours = sessions.filter((entry) => sameDay(entry.startTime)).reduce((sum, entry) => sum + entry.durationSeconds, 0) / 3600;
  const weeklyHours = sessions.filter((entry) => isSameWeek(entry.startTime)).reduce((sum, entry) => sum + entry.durationSeconds, 0) / 3600;
  const monthlyHours =
    sessions
      .filter((entry) => {
        const date = new Date(entry.startTime);
        return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
      })
      .reduce((sum, entry) => sum + entry.durationSeconds, 0) / 3600;
  const yearlyHours =
    sessions
      .filter((entry) => new Date(entry.startTime).getFullYear() === today.getFullYear())
      .reduce((sum, entry) => sum + entry.durationSeconds, 0) / 3600;

  const topTasksByTime = tasks
    .map((task) => ({
      taskId: task._id,
      taskTitle: task.title,
      totalSeconds: task.actualTimeSpentSeconds || 0
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
    .slice(0, 5);

  const recentSessions = sessions
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 8);

  return {
    completedToday,
    pendingTasks,
    focusScore,
    distractionsToday,
    weeklyProgress,
    dailyProductivity,
    weeklyProgressChart,
    priorityDistribution,
    yearlyTrend,
    satisfactionAnalysis,
    distractionAnalysis,
    heatmap,
    streakDays,
    yearProgress,
    dailyHours,
    weeklyHours,
    monthlyHours,
    yearlyHours,
    recentSessions,
    topTasksByTime,
    heatmapDetails
  };
}
