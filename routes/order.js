const express = require("express");
const jwt = require("express-jwt");

const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/order");

const { loadUser, isAdmin } = require("../helpers/authHelpers");

const router = express.Router();

// place order
router.post(
  "/place",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  createOrder
);

// Get Order By Id
router.get("/get/:orderId", getOrderById);

// Update Order status By Id
router.put(
  "/update/status/:orderId",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  updateOrderStatus
);

// Get all orders
router.get(
  "/getall",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  isAdmin,
  getAllOrders
);

module.exports = router;
