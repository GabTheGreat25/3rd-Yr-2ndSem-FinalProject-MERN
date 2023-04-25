const { verifyAccessToken } = require("../utils/token");
const ErrorHandler = require("../utils/errorHandler");
const { isUserLoggedIn } = require("../services/userService");

exports.verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.match(/^Bearer\s+(.*)$/))
      throw new ErrorHandler("Please Log In First");

    const token = authHeader?.match(/^Bearer\s+(.*)$/)[1];

    const decoded = verifyAccessToken(token);
    req.user = decoded?.UserInfo?.email;
    req.roles = decoded?.UserInfo?.roles;

    // const isLoggedIn = isUserLoggedIn(req.cookies);
    // if (!isLoggedIn) {
    //   throw new ErrorHandler("You are not logged in.");
    // }

    next();
  } catch (error) {
    next(error);
  }
};

exports.authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) =>
    allowedRoles.length === 0 || !req.roles
      ? next()
      : req.roles.some((role) => allowedRoles.includes(role))
      ? next()
      : next(
          new ErrorHandler(
            `Roles ${req.roles.join(
              ","
            )} are not allowed to access this resource`
          )
        );
