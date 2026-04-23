const mongoose = require("mongoose");

const jobPortalSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        portalName: { type: String, required: true, trim: true },
        portalUrl: { type: String, required: true, trim: true },
        portalUserId: { type: String, trim: true },
        portalPassword: { type: String, trim: true },
        description: { type: String, trim: true },
        tags: [{ type: String, trim: true }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("JobPortal", jobPortalSchema);
