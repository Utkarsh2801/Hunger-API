const asyncHandler = require("../helpers/asyncHandler");
const Orders = require("../models/Orders");
const Food = require("../models/Food");
const { ErrorHandler } = require("../helpers/error");

// Create Order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const user = req.user._id;
  const { products, city, street, pincode } = req.body;

  if (!products || !city || !street || !pincode) {
    next(new ErrorHandler("Please provide all required details"), 400);
  }

  let unavailable = [];
  let amount = 0;

  // Check if all the products are available
  for (let product of products) {
    let food = await Food.findOne({ _id: product.product, available: true });
    if (!food) {
      unavailable.push(
        `Product with id ${product.product} is currently unavailable`
      );
      continue;
    }

    amount += food.price * product.count;
  }

  if (unavailable.length > 0) {
    return res.status(400).json({
      success: false,
      data: unavailable,
    });
  }

  // TODO Add payment informaton
  await Orders.create({
    products,
    address: {
      city,
      street,
      pincode,
    },
    amount,
    user,
  });

  res.json({
    success: true,
    data: "Your Order has been placed successfully",
  });
});

// Get order by Id
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  let order = await Orders.findById(orderId);

  if (!order) {
    next(new ErrorHandler("Order not found", 400));
  }

  res.json({
    success: true,
    data: order,
  });
});

// Update order staus by Id
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  let order = await Orders.findById(orderId);

  if (!order) {
    next(new ErrorHandler("Order not found", 400));
  }

  order.status = status;

  await order.save({ validateBeforeSave: true });

  res.json({
    success: true,
    data: order,
  });
});

// Get all Orders
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  let orders = await Orders.find({}).populate(
    "user",
    "firstName lastName email _id"
  );

  res.json({
    success: true,
    data: orders,
  });
});
