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
  const { title, author, url, likes } = request.body;
  if (!title || !url)
    return response.status(400).json({ error: "Bad Request" });

  try {
    const newBlog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
    });
    const savedBlog = await newBlog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    logger.error("Error adding blog", error);
    next(error);
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    response.status(200).json(blog);
  } catch (error) {
    logger.error("Error fecthing blog", error);
    next(error);
  }
});

module.exports = blogsRouter;
