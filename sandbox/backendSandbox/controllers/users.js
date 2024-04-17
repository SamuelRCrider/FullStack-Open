const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.find({}).populate("notes", {
      content: 1,
      important: 1,
    });
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username: username,
      name: name,
      passwordHash: passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
