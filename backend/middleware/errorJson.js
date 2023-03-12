const ErrorHandler = require("../utils/errorHandler");

const errorJson = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ErrorHandler) return next(err);

  const error = new ErrorHandler(err.message);

  console.error(error.stack);

  next(error);
};

const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
    },
  });
};

module.exports = { errorJson, errorHandler };
