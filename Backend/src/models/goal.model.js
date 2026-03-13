const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: String,
    period: { type: String, enum: ["Daily", "Weekly", "Monthly", "Yearly"], required: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    dueDate: Date,
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
