const asyncHandler = require("../helpers/asyncHandler");
const { ErrorHandler } = require("../helpers/error");
const slugify = require("slugify");
const Category = require("../models/Category");

// Add new category

exports.addCategory = asyncHandler(async (req, res, next) => {
  if (req.body.name) {
    let slug = slugify(req.body.name.toLowerCase());
    let category = await Category.findOne({ slug });

    if (category) {
      return res.json({
        success: false,
        data: "Category Already Exist",
      });
    }

    category = new Category(req.body);
    await category.save();

    return res.json({
      success: true,
      data: category,
    });
  } else {
    next(new ErrorHandler("Name of Category is required", 400));
  }
});

// Update category

exports.editCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    next(new ErrorHandler("No category available for this Id", 404));
  }

  category = await Category.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  await category.save();

  return res.json({
    success: true,
    data: category,
  });
});

// Get All Categories

exports.getAllCategories = asyncHandler(async (req, res) => {
  let categories = await Category.find({});

  return res.json({
    success: true,
    data: categories,
  });
});

// Delete Category by Id

exports.deleteCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    next(new ErrorHandler("No category available for this Id", 404));
  }

  category = await Category.findByIdAndDelete({ _id: req.params.id });

  return res.json({
    success: true,
    data: category,
  });
});
