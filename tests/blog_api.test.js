const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Introduction to ExpressJS API",
    author: "Stephen Oluyomi",
    url: "https://www.stephen-dev.com/blogs/express-api",
    likes: 10000,
    id: "676d9cb624adfda4dbbe696f",
  },
  {
    title: "How to Build a Blog with the Ghost API and Next.js",
    author: "Rajdeep Singh",
    url: "https://www.freecodecamp.org/news/build-a-blog-website-with-ghost-api-and-nextjs/",
    likes: 8500,
    id: "676d9d1f24adfda4dbbe6972",
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    blogObject.save();
  }
});

test("the correct amount of blog posts as JSON format", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
