const mongoose = require("mongoose");
const slugify = require("slugify");
validate = require("mongoose-validator");

var lengthValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 50],
    message: "Description length should not be more than 50",
  }),
];

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter a Dish Name"],
  },
  description: {
    type: String,
    validate: lengthValidator,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
});

CategorySchema.pre("save", async function (next) {
  this.slug = slugify(this.name.toLowerCase());
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
