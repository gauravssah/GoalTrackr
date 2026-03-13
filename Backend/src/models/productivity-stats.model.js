const mongoose = require("mongoose");

const productivityStatsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completedTasksToday: { type: Number, default: 0 },
    pendingTasks: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 },
    distractionsToday: { type: Number, default: 0 },
    weeklyProgress: { type: Number, default: 0 },
    yearlyAchievementScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductivityStats", productivityStatsSchema);
