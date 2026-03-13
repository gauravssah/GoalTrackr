const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    companyName: { type: String, required: true },
    jobRole: { type: String, required: true },
    jobLink: String,
    applicationDate: { type: Date, required: true },
    status: { type: String, enum: ["Applied", "Interview", "Rejected", "Offer"], default: "Applied" },
    followUpReminder: Date,
    notes: String,
    timelineProgress: { type: Number, min: 0, max: 100, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
