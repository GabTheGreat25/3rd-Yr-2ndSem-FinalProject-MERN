const { verifyAccessToken } = require("../utils/token");
const ErrorHandler = require("../utils/errorHandler");

exports.verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.match(/^Bearer\s+(.*)$/))
    throw new ErrorHandler("Please Log In First");

  const token = authHeader.match(/^Bearer\s+(.*)$/)[1];

  const decoded = verifyAccessToken(token);
  req.user = decoded.UserInfo.email;
  req.roles = decoded.UserInfo.roles;

  next();
};

exports.authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) =>
    (req.roles || []).some((role) => allowedRoles.includes(role))
      ? next()
      : next(
          new ErrorHandler(
            `Roles ${req.roles.join(
              ","
            )} are not allowed to access this resource`
          )
        );