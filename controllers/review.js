const asyncHandler = require("../helpers/asyncHandler");
const Review = require("../models/Review");
const Food = require("../models/Food");
const { ErrorHandler } = require("../helpers/error");

// Add Review
exports.addReview = asyncHandler(async (req, res, next) => {
  const { userId, dishId } = req.params;
  const { comment, rating } = req.body;

  if (req.user.role === "admin") {
    return next(new ErrorHandler("Admin can not review", 400));
  }

  if (req.user._id.toString() !== userId.toString()) {
    return next(
      new ErrorHandler("You are not authorized for this action", 400)
    );
  }

  let food = await Food.findById(dishId);

  if (!food) {
    return next(new ErrorHandler("Dish not found", 404));
  }

  let review = await new Review({
    comment: comment,
    user: userId,
    dish: dishId,
    rating: rating,
  });

  await review.save();

  res.json({
    success: true,
    data: review,
  });
});

// Update Review
exports.editReview = asyncHandler(async (req, res, next) => {
  const { reviewId, userId } = req.params;

  let review = await Review.findById({ _id: reviewId });

  if (!review) {
    return next(new ErrorHandler("No Review Found", 404));
  }

  if (review.user.toString() !== userId.toString()) {
    return next(
      new ErrorHandler("You are unauthorized to update the review", 400)
    );
  }

  review = await Review.findByIdAndUpdate({ _id: reviewId }, req.body, {
    runValidators: true,
    new: true,
  });

  await review.save();

  return res.json({
    success: true,
    data: review,
  });
});

// Get All Reviews for dish
exports.getReviewForDish = asyncHandler(async (req, res) => {
  const { dishId } = req.params;

  let reviews = await Review.find({ dish: dishId });

  return res.json({
    success: true,
    data: reviews,
  });
});

// Delete Review
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;

  let review = await Review.findById(reviewId);

  if (!review) {
    return next(new ErrorHandler("No review available for this Id", 404));
  }

  if (req.user._id.toString() !== review.user.toString()) {
    return next(
      new ErrorHandler("You are not authorized for this action", 400)
    );
  }

  await review.remove();

  return res.json({
    success: true,
    data: "Sucessfully deleted",
  });
});
