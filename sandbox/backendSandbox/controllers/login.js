const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const currentUser = await User.findOne({ username });
    const passwordCorrect =
      currentUser === null
        ? false
        : bcrypt.compare(password, currentUser.passwordHash);

    if (!(currentUser && passwordCorrect)) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }

    const userForToken = { username: currentUser.username, id: currentUser.id };
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    res
      .status(200)
      .send({ token, username: currentUser.username, name: currentUser.name });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
