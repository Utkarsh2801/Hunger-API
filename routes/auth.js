const express = require("express");
const {
  register,
  login,
  logout,
  forgotPasswordSendMail,
  resetPassword,
} = require("../controllers/auth");

const router = express.Router();

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Logout User
router.post("/logout", logout);

// Forgot Password
router.post("/forgotpassword", forgotPasswordSendMail);

router.put("/resetpassword/:userId/:resetToken", resetPassword);

module.exports = router;
