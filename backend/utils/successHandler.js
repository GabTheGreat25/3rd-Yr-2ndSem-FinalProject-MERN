const SuccessHandler = (res, message, details) => {
  res.status(200).json({
    success: true,
    message: message,
    details: details,
  });
};

module.exports = SuccessHandler;
