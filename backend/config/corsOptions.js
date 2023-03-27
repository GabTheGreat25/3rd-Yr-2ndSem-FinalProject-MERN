const allowedOrigins = require("./allowedOrigins");
const { STATUSCODE } = require("../constants/index");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: STATUSCODE.SUCCESS,
};

module.exports = corsOptions;
