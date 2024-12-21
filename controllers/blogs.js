const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blog) => {
    response.json(blog);
  });
});

blogsRouter.post("/post", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => response.status(201).json(result));
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
