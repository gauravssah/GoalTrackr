const mongoose = require("mongoose");

const reflectionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        date: { type: Date, required: true, index: true },
        answers: {
            type: [String],
            validate: {
                validator(value) {
                    return Array.isArray(value) && value.length === 5;
                },
                message: "Reflection answers must contain exactly 5 items"
            },
            required: true
        }
    },
    { timestamps: true }
);

reflectionSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Reflection", reflectionSchema);