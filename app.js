const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT | 5000;
const jwt = require("express-jwt");

require("colors");
require("./config/db")();

// Routes
const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/food");
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/review");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// Error Handler
const { errorResponse } = require("./helpers/error");

app.use(express.json());
app.use(express.urlencoded());

// Routers
app.use("/auth", authRoutes);
app.use("/food", foodRoutes);
app.use("/category", categoryRoutes);
app.use("/user", userRoutes);
app.use("/review", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// Error Handler middleware
app.use((err, req, res, next) => {
  errorResponse(res, err);
  next();
});

// Server
const server = app.listen(PORT, () => {
  console.log("Server Connected".green);
});

process.on("unhandledRejection", () => {
  server.close(() => process.exit(1));
});
