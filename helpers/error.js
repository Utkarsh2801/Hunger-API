const mongoose = require("mongoose");
const { UnauthorizedError } = require("express-jwt");

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorResponse = (res, err) => {
  if (err.code == "11000") {
    return res.status(400).json({
      success: false,
      message: "Duplicate Key Error",
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    let errors = [];

    for (error in err.errors) {
      errors.push(err.errors[error].properties.message);
    }
    return res.json({
      success: false,
      message: errors,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.json({
      success: false,
      message: "Resource id is not valid",
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.log(err);

  if (!err.statusCode) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = {
  ErrorHandler,
  errorResponse,
};
