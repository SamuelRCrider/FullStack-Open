const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");

usersRouter.get("/", async (req, res, next) => {
  try {
    const currUsers = await User.find({}).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
    });
    res.status(200).json(currUsers);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const { username, password, name } = req.body;

    if (password.length < 3) {
      logger.error("password must be at least 3 characters");
      return res
        .status(400)
        .json({ error: "password must be at least 3 characters" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username: username,
      name: name,
      passwordHash: passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
