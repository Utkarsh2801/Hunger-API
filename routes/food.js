const express = require("express");
const {
  addFood,
  editFood,
  getAll,
  deleteFood,
  getFoodByCategory,
} = require("../controllers/food");

const jwt = require("express-jwt");

const { isAdmin } = require("../helpers/authHelpers");

const expressJwt = require("express-jwt");

const { loadUser } = require("../helpers/authHelpers");

const router = express.Router();

// Get all food
router.get("/getall", getAll);

// Get food by category
router.get("/category/:id", getFoodByCategory);

// Add Food
router.post(
  "/add",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  addFood
);

// Update Food
router.put(
  "/update/:id",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  editFood
);

// Delete Food
router.delete(
  "/delete/:id",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  deleteFood
);

module.exports = router;
