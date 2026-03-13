const mongoose = require("mongoose");

const dailySurveySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productiveRating: { type: Number, min: 1, max: 10, required: true },
    satisfactionRating: { type: Number, min: 1, max: 10, required: true },
    biggestDistraction: { type: String, required: true },
    learnedToday: { type: String, required: true },
    improveTomorrow: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailySurvey", dailySurveySchema);
