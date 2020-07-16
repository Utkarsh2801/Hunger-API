const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Review = require("./Review");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      max: [10, "First name should be of max 10 charecters"],
    },
    lastName: {
      type: String,
      max: [10, "First name should be of max 10 charecters"],
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please add a valid email",
      ],
      required: [true, "Please add a email"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: [true, "Please add a passowrd"],
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true }, id: false }
);

// Cart Virtual
UserSchema.virtual("cart", {
  ref: "Cart",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

// Order Virtual
UserSchema.virtual("order", {
  ref: "Order",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await this.securePassword(this.password);
  next();
});

UserSchema.pre("remove", async function (next) {
  // Delete all the reviews associated to the user to be removed
  reviews = await this.model("Review").find({ user: this._id });
  reviews.forEach(async (review) => {
    await review.remove();
  });

  next();
});

// Password related methods
UserSchema.methods = {
  securePassword: async function (plainPassword) {
    if (!plainPassword) return "";
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
  },

  checkPassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  },

  getResetPasswordToken: async function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  },
};

module.exports = mongoose.model("User", UserSchema);
