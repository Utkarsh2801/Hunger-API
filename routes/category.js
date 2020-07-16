const express = require("express");
const jwt = require("express-jwt");
const {
  addCategory,
  editCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/category");

const { loadUser, isAdmin } = require("../helpers/authHelpers");

const router = express.Router();

// Add Category
router.post(
  "/add",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  addCategory
);

// Update Category
router.put(
  "/update/:id",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  editCategory
);

// Get all categories
router.get("/getall", getAllCategories);

// Delete Categories
router.delete(
  "/delete/:id",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  deleteCategory
);

module.exports = router;
