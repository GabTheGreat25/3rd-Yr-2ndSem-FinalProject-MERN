const ErrorHandler = require("../utils/errorHandler");

const errorJson = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ErrorHandler) return next(err);

  const error = new ErrorHandler(err.message);

  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
    },
  });
};

module.exports = { errorJson, errorHandler };
