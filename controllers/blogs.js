const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });
    response.status(200).json(blogs);
  } catch (error) {
    logger.error("Error fetching blogs", error);
    next(error);
  }
});

blogsRouter.post(
  "/",
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    const { title, author, url, likes, userId } = request.body;
    if (!title || !url)
      return response.status(400).json({ error: "Bad Request" });

    try {
      const user = await User.findById(userId);
      if (!user) return response.status(404).json({ error: "User not found" });

      const newBlog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id,
      });
      const savedBlog = await newBlog.save();

      user.blogs = user.blogs.concat(newBlog._id);
      await user.save();

      response.status(201).json(savedBlog);
    } catch (error) {
      logger.error("Error adding blog", error);
      next(error);
    }
  }
);

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    response.status(200).json(blog);
  } catch (error) {
    logger.error("Error fecthing blog", error);
    next(error);
  }
});

blogsRouter.delete(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    const blogId = request.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) return response.status(404).json({ error: "Blog not found" });

    if ((await blog.user.toString()) !== request.user._id.toString())
      return response
        .status(403)
        .json({ error: "You dont have permission to delete this blog" });

    try {
      await Blog.findByIdAndDelete(blogId);
      response.status(204).end();
    } catch (error) {
      logger.error("Error deleting blog", error);
      next(error);
    }
  }
);

blogsRouter.put(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    const blogId = request.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) return response.status(404).json({ error: "Blog not found" });

    if ((await blog.user.toString()) !== request.user._id.toString())
      return response
        .status(403)
        .json({ error: "You dont have permission to update this blog" });

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        request.body,
        { new: true }
      );
      response.status(200).json(updatedBlog);
    } catch (error) {
      logger.error("Error updating blog");
      next(error);
    }
  }
);

module.exports = blogsRouter;
