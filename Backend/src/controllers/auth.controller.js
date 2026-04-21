const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const { sendPasswordResetOtpEmail } = require("../utils/email");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        ...user.toObject(),
        password: undefined
      }
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);
  user.password = undefined;

  res.json({
    success: true,
    token,
    data: { user }
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");

  if (user) {
    const otp = user.createPasswordResetOtp();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetOtpEmail({
        to: user.email,
        name: user.name,
        otp
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw error;
    }
  }

  res.json({
    success: true,
    message: "If an account with that email exists, an OTP has been sent."
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    passwordResetToken: hashedOtp,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+password +passwordResetToken +passwordResetExpires");

  if (!user) {
    return next(new AppError("OTP is invalid or has expired", 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id);
  user.password = undefined;

  res.json({
    success: true,
    token,
    data: { user },
    message: "Password reset successful"
  });
});

exports.profile = catchAsync(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      bio: req.body.bio,
      profileImage: req.body.profileImage
    },
    { new: true, runValidators: true }
  ).select("-password");

  res.json({
    success: true,
    data: { user }
  });
});
