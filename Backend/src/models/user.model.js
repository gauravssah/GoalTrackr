const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    profileImage: String,
    bio: String,
    joinedDate: { type: Date, default: Date.now },
    productivityScore: { type: Number, default: 0 },
    totalTasksCompleted: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetOtp = function createPasswordResetOtp() {
  const otp = String(crypto.randomInt(100000, 1000000));

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return otp;
};

module.exports = mongoose.model("User", userSchema);
