const asyncHandler = require("../helpers/asyncHandler");
const Food = require("../models/Food");
const { ErrorHandler } = require("../helpers/error");
const slugify = require("slugify");
const Category = require("../models/Category");

// Add new Food

exports.addFood = asyncHandler(async (req, res, next) => {
  if (req.body.name) {
    let slug = slugify(req.body.name.toLowerCase());
    let food = await Food.findOne({ slug });

    if (food) {
      return res.json({
        success: false,
        data: "Food Already Exist",
      });
    }

    food = new Food(req.body);
    await food.save();

    return res.json({
      success: true,
      data: food,
    });
  } else {
    next(new ErrorHandler("Name of food is required", 400));
  }
});

// Update food

exports.editFood = asyncHandler(async (req, res, next) => {
  let food = await Food.findById(req.params.id);

  if (!food) {
    next(new ErrorHandler("No Food available for this Id", 404));
  }

  food = await Food.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  });

  await food.save();

  return res.json({
    success: true,
    data: food,
  });
});

// Get All Food

exports.getAll = asyncHandler(async (req, res) => {
  let food = await Food.find({}).populate("reviews");

  return res.json({
    success: true,
    data: food,
  });
});

// Delete Food

exports.deleteFood = asyncHandler(async (req, res) => {
  let food = await Food.findById(req.params.id);

  if (!food) {
    next(new ErrorHandler("No Food available for this Id", 404));
  }

  await food.remove();

  return res.json({
    success: true,
    data: "Successfuly deleted",
  });
});

// Get Food By Category

exports.getFoodByCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    next(new ErrorHandler("No Category Found", 404));
  }

  let food = await Food.find({ category: req.params.id }).populate("category");

  return res.json({
    success: true,
    data: food,
  });
});
