const mongoose = require("mongoose");
const User = require("./User");

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
        },
        count: {
          type: Number,
        },
      },
    ],
    transaction_id: {},
    amount: {
      type: Number,
      required: true,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
    },
    updated: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function () {
  this.updated = Date.now();
});

const Orders = mongoose.model("Order", OrderSchema);

module.exports = Orders;
