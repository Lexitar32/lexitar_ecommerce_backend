const { verify } = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  try {
    if (!authorization) throw new Error();
    const token = authorization.split(" ")[1];

    if (!token) throw new Error();

    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.id = payload.id;

    next();
  } catch (err) {
    res.status(403).send({
      message: err.message || "Not Authorized",
    });
  }
};

module.exports = verifyToken;
