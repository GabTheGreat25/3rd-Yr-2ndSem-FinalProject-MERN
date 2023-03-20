const jwt = require("jsonwebtoken");
const { verifyAccessToken } = require("../utils/token");
const ErrorHandler = require("../utils/errorHandler");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.match(/^Bearer\s+(.*)$/))
    throw new ErrorHandler("Please Log In First");

  const token = authHeader.match(/^Bearer\s+(.*)$/)[1];

  const decoded = verifyAccessToken(token);
  req.user = decoded.UserInfo.email;
  req.roles = decoded.UserInfo.roles;
  next();
};

module.exports = verifyJWT;
