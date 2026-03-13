const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    sequence: { type: Number, default: 0 },
    deadline: Date,
    estimatedTime: Number,
    tags: [String],
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    satisfactionLevel: { type: Number, min: 1, max: 10 },
    distractionCount: { type: Number, default: 0 },
    notes: String,
    completedAt: Date,
    actualTimeSpentSeconds: { type: Number, default: 0 },
    timerStatus: { type: String, enum: ["Idle", "Running", "Paused"], default: "Idle" },
    activeSessionStartedAt: Date,
    timeEntries: [
      {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        durationSeconds: { type: Number, required: true, min: 0 }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
