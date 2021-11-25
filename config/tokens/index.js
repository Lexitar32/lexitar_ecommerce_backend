const { sign } = require("jsonwebtoken");

exports.createAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  return sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20m",
  });
};

exports.createEmailVerificationToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return sign(payload, process.env.EMAIL_VERIFICATION_TOKEN_SECRET, {
    expiresIn: "30m",
  });
};

exports.createRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
};

exports.sendAccessToken = (accessToken, res) => {
  res.status(200).send({
    accessToken,
  });
};

exports.sendRefreshToken = (refreshToken, res) => {
  res.cookie("refreshtoken", refreshToken, {
    path: "/api/auth/refreshtoken",
    httpOnly: true,
  });
};
