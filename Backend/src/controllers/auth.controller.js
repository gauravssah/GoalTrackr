const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

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
