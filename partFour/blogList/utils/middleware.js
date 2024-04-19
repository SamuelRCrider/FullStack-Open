const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const extractToken = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    req.token = authorization.replace("Bearer ", "");
  } else {
    return res
      .status(400)
      .json({ error: "no token found, middleware.extractToken" });
  }
  next();
};

const extractUser = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken) {
      return res
        .status(400)
        .json({ error: "invalid token, middleware.extractUser" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res
        .status(401)
        .json({ error: "invalid token, middleware.extractUser" });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError") {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};
module.exports = { errorHandler, extractToken, extractUser };
