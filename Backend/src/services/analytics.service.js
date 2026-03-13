const Task = require("../models/task.model");
const Goal = require("../models/goal.model");
const DailySurvey = require("../models/daily-survey.model");

async function getDashboardAnalytics(userId) {
  const [tasks, goals, surveys] = await Promise.all([
    Task.find({ user: userId }).lean(),
    Goal.find({ user: userId }).lean(),
    DailySurvey.find({ user: userId }).sort({ date: -1 }).limit(30).lean()
  ]);

  const completedTasks = tasks.filter((task) => task.status === "Completed");
  const pendingTasks = tasks.filter((task) => task.status !== "Completed");

  const completedToday = completedTasks.filter((task) => {
    if (!task.completedAt) return false;
    return new Date(task.completedAt).toDateString() === new Date().toDateString();
  }).length;

  const focusScore = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const weeklyProgress = tasks.length ? completedTasks.length / tasks.length : 0;
  const yearlyAchievementScore = goals.length ? goals.filter((goal) => goal.completed).length / goals.length : 0;

  return {
    completedToday,
    pendingTasks: pendingTasks.length,
    focusScore,
    distractionsToday: tasks.reduce((sum, task) => sum + (task.distractionCount || 0), 0),
    weeklyProgress: Math.round(weeklyProgress * 100),
    yearlyAchievementScore: Math.round(yearlyAchievementScore * 100),
    satisfactionAverage: surveys.length
      ? Number((surveys.reduce((sum, survey) => sum + survey.satisfactionRating, 0) / surveys.length).toFixed(1))
      : 0
  };
}

module.exports = { getDashboardAnalytics };
