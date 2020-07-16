const fs = require("fs");
const Food = require("./models/Food");
const Category = require("./models/Category");
const Review = require("./models/Review");
const User = require("./models/User");
require("colors");
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb://localhost:27017/hunger",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Database connected".green);
  } catch (err) {
    console.log(err);
  }
};

dbConnect();

const addData = async () => {
  await Food.create(JSON.parse(fs.readFileSync("./data/food.json")));
  await Category.create(JSON.parse(fs.readFileSync("./data/category.json")));
  await Review.create(JSON.parse(fs.readFileSync("./data/review.json")));
  await User.create(JSON.parse(fs.readFileSync("./data/user.json")));

  console.log("Data Added".green.inverse);
};

const deleteData = async () => {
  await Food.deleteMany({});
  await Category.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({});

  console.log("Data Deleted".red.inverse);
};

if (process.argv[2] === "i") addData();
else if (process.argv[2] === "d") deleteData();
