const asyncHandler = require("../helpers/asyncHandler");
const User = require("../models/User");
const { ErrorHandler } = require("../helpers/error");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { sendEmail } = require("../helpers/authHelpers");

// Register User
exports.register = asyncHandler(async (req, res, next) => {
  let user = new User(req.body);
  user = await user.save();

  sendToken(user._id, res);
});

// Login User
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ErrorHandler("Please Enter Valid Credentials", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    next(new ErrorHandler("User doesn't exist, Please Register", 400));
  }

  if (!(await user.checkPassword(password))) {
    next(new ErrorHandler("Password doesn't match", 400));
  }

  sendToken(user._id, res);
});

// Logout User
exports.logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    token: "",
  });
});

// Send Email for password reset

exports.forgotPasswordSendMail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    next(new ErrorHandler("User not found with this email", 404));
  }

  // Reset password token
  const resetToken = await user.getResetPasswordToken();

  let userId = user._id;

  user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${userId}/${resetToken}`;

  // send email
  try {
    await sendEmail(email, resetUrl);
    res.json({
      success: true,
      data: "Email sent",
    });
  } catch (err) {
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;
    user.save({ validateBeforeSave: false });
    next(err);
  }
});

// Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { userId, resetToken } = req.params;
  const { password } = req.body;

  const token = crypto.createHash("sha256").update(resetToken).digest("hex");

  let user = await User.findOne({
    _id: userId,
    resetPasswordToken: token,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid Token", 400));
  }

  // Change Password
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpire = null;

  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    data: "Password updated sucessfully",
  });
});

// Send Token Response
let sendToken = (id, res) => {
  console.log(id);
  let token = jwt.sign({ user: id }, process.env.JWT_SECRET);
  res.json({
    success: true,
    token,
  });
};
