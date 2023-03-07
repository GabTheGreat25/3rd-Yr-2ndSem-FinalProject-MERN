require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const path = require("path");

mongoose.set("strictQuery", false);
const connectDB = require("./config/db");
const PORT = process.env.PORT || 4000;

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", require("./routes/root"));
app.use("/", express.static(path.join(__dirname, "/public")));

app.all("*", (req, res) => {
  const filePath = req.accepts("html")
    ? path.join(__dirname, "views", "404.html")
    : req.accepts("json")
    ? { message: "404 Not Found" }
    : "404 Not Found";

  res.status(404).sendFile(filePath);
});

app.use(errorHandler);
connectDB();

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`)
);

mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
