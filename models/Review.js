const mongoose = require("mongoose");
const validate = require("mongoose-validator");

var lengthValidator = [
  validate({
    validator: "isLength",
    arguments: [1, 50],
    message: "Comment should not be more than 50 worlds",
  }),
];

const ReviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      validate: lengthValidator,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Please add rating between 1 to 10"],
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, dish: 1 }, { unique: true });

ReviewSchema.statics.updateAverageRating = async function (dishId) {
  let data = await this.aggregate([
    {
      $match: { dish: dishId },
    },
    {
      $group: { _id: "$dish", averageRating: { $avg: "$rating" } },
    },
  ]);

  let averageRating = data[0].averageRating;

  try {
    await this.model("Food").findByIdAndUpdate(dishId, { averageRating });
  } catch (err) {
    console.log(err);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.updateAverageRating(this.dish);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.updateAverageRating(this.dish);
});

module.exports = mongoose.model("Review", ReviewSchema);
