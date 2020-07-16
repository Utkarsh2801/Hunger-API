const express = require("express");
const {
  addReview,
  editReview,
  getReviewForDish,
  deleteReview,
} = require("../controllers/review");

const jwt = require("express-jwt");
const { loadUser } = require("../helpers/authHelpers");

const router = express.Router();

router.post(
  "/add/:userId/:dishId",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  addReview
);

router.put(
  "/update/:userId/:reviewId",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  editReview
);

router.get("/getreviews/:dishId", getReviewForDish);

router.delete(
  "/remove/:reviewId",
  jwt({ secret: process.env.JWT_SECRET }),
  loadUser,
  deleteReview
);

module.exports = router;
