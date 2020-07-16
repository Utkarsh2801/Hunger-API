const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const { ErrorHandler } = require("./error");
const nodemailer = require("nodemailer");
// Load user in request

exports.loadUser = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.user) {
    let user = await User.findById(req.user.user).select("email role");
    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }

    req.user = user;
  } else {
    throw new ErrorHandler("Not Authorized", 400);
  }

  next();
});

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    throw new ErrorHandler("You are not authorized for this action", 400);
  }
};

exports.sendEmail = async (email, url) => {
  let transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.SENDERMAIL,
      pass: process.env.SENDERPASSWORD,
    },
  });

  const mailOptions = {
    from: `"Login app" <${process.env.SENDERMAIL}>`,
    to: email,
    subject: "Reset password link | Hunger",
    text: "",
    html: `<p>Here is your link to reset your password, Please click <b><a href="${url}">Here</a></b></p>`,
  };

  let info = await transporter.sendMail(mailOptions);

  return info;
};
