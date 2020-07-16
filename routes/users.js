const express = require("express");
const jwt = require("express-jwt");
const { loadUser } = require("../helpers/authHelpers");

const {
  editUser,
  getUserById,
  deleteUser,
  editPassword,
} = require("../controllers/users");

const router = express.Router();

// Update User
router.put(
  "/update/:id",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  editUser
);

// Update User Password
router.put(
  "/updatepassword",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  editPassword
);

// Get User By ID
router.get("/get/:id", getUserById);

// Delete User
router.delete(
  "/delete/:id",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  deleteUser
);

module.exports = router;
