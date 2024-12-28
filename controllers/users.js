const usersRouter = require("express").Router();

const logger = require("../utils/logger");
const User = require("../models/user");

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({});
    response.status(200).json(users);
  } catch (error) {
    logger.error("Error fetching users", error);
    next(error);
  }
});

module.exports = usersRouter;
