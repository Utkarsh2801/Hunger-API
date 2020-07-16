const asyncHandler = require("../helpers/asyncHandler");
const { ErrorHandler } = require("../helpers/error");
const User = require("../models/User");

// Update User
exports.editUser = asyncHandler(async (req, res, next) => {
  let userId = req.params.id;

  if (userId.toString() !== req.user._id.toString()) {
    next(new ErrorHandler("You are not authorized  for this action", 400));
  }

  let user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
    runValidators: true,
    new: true,
  });

  return res.json({
    success: true,
    data: user,
  });
});

// Get User By Id
exports.getUserById = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    next(new ErrorHandler("User Not found", 400));
  }

  res.json({
    success: true,
    data: user,
  });
});

// Delete User By Id
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (
    !(req.user.role === "admin" || id.toString() === req.user._id.toString())
  ) {
    next(new ErrorHandler("You are not authorized for this action", 400));
  }

  const user = await User.findById(id);

  if (!user) {
    next(new ErrorHandler("User doesn't exist", 404));
  }

  await user.remove();

  return res.json({
    success: true,
    token: "",
  });
});

// Update User Password
exports.editPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    next(new ErrorHandler("Please Enter a Valid Password", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { password },
    {
      new: true,
      runValidators: true,
    }
  ).select("+password");

  await user.save();

  return res.json({
    success: true,
    data: "Password Updated",
  });
});
