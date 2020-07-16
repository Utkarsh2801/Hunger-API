const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const slugify = require("slugify");
const Category = require("./Category");
const Review = require("./Review");

var lengthValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 50],
    message: "Description length should not be more than 50",
  }),
];

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a Dish Name"],
    },
    description: {
      type: String,
      validate: lengthValidator,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    averageRating: {
      type: Number,
      max: 10,
      min: 1,
    },
    foodType: {
      type: String,
      enum: ["Veg", "NonVeg"],
      required: true,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please Enter The Price"],
    },
    image: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false }
);

FoodSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "dish",
  justOne: false,
});

FoodSchema.pre("save", async function (next) {
  this.slug = slugify(this.name.toLowerCase());
  next();
});

FoodSchema.post("remove", async function () {
  try {
    await this.model("Review").deleteMany({ dish: this._id });
  } catch (err) {
    console.log(err);
  }
});
module.exports = mongoose.model("Food", FoodSchema);
