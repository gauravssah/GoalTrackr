const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: String,
    period: { type: String, enum: ["Daily", "Weekly", "Monthly", "Yearly"], required: true },
    status: {
      type: String,
      enum: ["Completed", "Partially Completed", "Not Completed", "Pending"],
      default: "Pending"
    },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    satisfactionScore: { type: Number, min: 1, max: 10 },
    dueDate: Date,
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
