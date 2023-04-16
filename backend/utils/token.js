const jwt = require("jsonwebtoken");

exports.generateRefreshToken = (email) => {
  const refreshToken = jwt.sign(
    { email: email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return refreshToken;
};

exports.generateAccessToken = (email, roles) => {
  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: email,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return accessToken;
};

exports.verifyAccessToken = (accessToken) => {
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  return decoded;
};

exports.verifyRefreshToken = (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  return decoded;
};

exports.setRefreshTokenCookie = (refreshTokenMaxAge) => {
  return (res, refreshToken) => {
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: refreshTokenMaxAge,
    });
  };
};
