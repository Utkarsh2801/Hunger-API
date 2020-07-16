const express = require("express");
const jwt = require("express-jwt");
const { loadUser } = require("../helpers/authHelpers");
const {
  saveCart,
  removeFromCart,
  clearItemsFromCart,
  getCart,
} = require("../controllers/cart");

const router = express.Router();

// Save cart
router.post(
  "/save",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  saveCart
);

// Remove item from cart
router.put(
  "/remove/:item",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  removeFromCart
);

// Clear all items from cart
router.put(
  "/clear",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  clearItemsFromCart
);

// Get all items of cart
router.get("/get", jwt({ secret: process.env.JWT_SECRET }), loadUser, getCart);

module.exports = router;
