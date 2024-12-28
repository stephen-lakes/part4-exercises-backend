const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");

const logger = require("../utils/logger");
const User = require("../models/user");

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("notes", {content: 1, important: 1});
    response.status(200).json(users);
  } catch (error) {
    logger.error("Error fetching users", error);
    next(error);
  }
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  try {
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    logger.info("Error adding new user", error);
    next(error);
  }
});

module.exports = usersRouter;
