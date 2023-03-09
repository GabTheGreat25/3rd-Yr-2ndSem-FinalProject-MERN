class ErrorHandler extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
      },
    };
  }
}

module.exports = ErrorHandler;
