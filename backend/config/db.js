const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const connectDB = asyncHandler(async () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

module.exports = connectDB;
