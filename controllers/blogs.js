const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.status(200).json(blogs);
  } catch (error) {
    logger.error("Error fetching blogs", error);
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const newBlog = new Blog(request.body);
    const savedBlog = await newBlog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    logger.error("Error adding blog", error);
    next(error);
  }
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
