const asyncHandler = require("../helpers/asyncHandler");
const Cart = require("../models/Cart");
const Food = require("../models/Food");
const { ErrorHandler } = require("../helpers/error");

// Save Cart
exports.saveCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { items } = req.body;

  if (items.length == 0) {
    next(new ErrorHandler("Please add some Itmes", 400));
  }

  let userCart = await Cart.findOne({ user: userId });

  // If doesn't have cart then create
  if (!userCart) {
    await Cart.create({
      user: userId,
      products: items,
    });
  } else {
    // If user does have cart then push all new items into it
    await Cart.findOneAndUpdate(
      { user: userId },
      {
        $addToSet: {
          products: {
            $each: items,
          },
        },
      }
    );
  }

  res.json({
    success: true,
    data: "Your cart has been saved",
  });
});

// Remove item from cart
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { item } = req.params;

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        products: item,
      },
    },
    { new: true }
  );

  if (!cart) {
    next(new ErrorHandler("Cart not found", 400));
  }

  res.json({
    success: true,
    data: cart,
  });
});

// Clear all items from the cart
exports.clearItemsFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  let cart = await Cart.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        products: [],
      },
    },
    { new: true }
  );

  if (!cart) {
    next(new ErrorHandler("Cart not found", 400));
  }

  res.json({
    success: true,
    data: cart,
  });
});

// Get Cart
exports.getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    next(new ErrorHandler("Cart not found", 400));
  }

  res.json({
    success: true,
    data: cart,
  });
});
