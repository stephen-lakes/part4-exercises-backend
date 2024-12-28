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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((note) => note.toJSON());
};

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

test("blog posts have id property instead of _id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blog = response.body[0];

  assert(blog.id, !undefined);
  assert.strictEqual(blog._id, undefined);
});

test("a valid blog can be added", async () => {
  const blogsAtStart = await blogsInDb();
  const newBlog = {
    title: "How to Backup Your Hashnode Articles to GitHub",
    author: "Md. Fahim Bin Amin",
    url: "https://www.freecodecamp.org/news/how-to-backup-hashnode-articles-to-github/",
    likes: 1500,
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await blogsInDb();

  assert.strictEqual(response.body.title, newBlog.title);
  assert.strictEqual(response.body.author, newBlog.author);
  assert.strictEqual(response.body.url, newBlog.url);
  assert.strictEqual(response.body.likes, newBlog.likes);

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
});

test("missing likes property defaults to 0", async () => {
  const newBlog = {
    title: "How to Backup Your Hashnode Articles to GitHub",
    author: "Md. Fahim Bin Amin",
    url: "https://www.freecodecamp.org/news/how-to-backup-hashnode-articles-to-github/",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "Md. Fahim Bin Amin",
    url: "https://www.freecodecamp.org/news/how-to-backup-hashnode-articles-to-github/",
    likes: 1000,
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(400);
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "How to Backup Your Hashnode Articles to GitHub",
    author: "Md. Fahim Bin Amin",
    likes: 1000,
  };
  const response = await api.post("/api/blogs").send(newBlog).expect(400);
});

test("an existing blog can be deleted", async () => {
  const blogsAtStart = await blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await blogsInDb();
  const deletedBlog = blogsAtEnd.find((blog) => blog.id === blogToDelete.id);
  assert.strictEqual(blogsAtEnd, blogsAtStart - 1);
  assert.strictEqual(deletedBlog, undefined);
});

test("an existing blog can be updated", async () => {
  const blogsAtStart = await blogsInDb();
  const blogToUpdate = blogsAtStart[0];
  const updatedData = {
    ...blogToUpdate,
    title: blogToUpdate.title + "UPDATED",
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.title, updatedData.title);
  assert.strictEqual(response.body.author, updatedData.author);
  assert.strictEqual(response.body.url, updatedData.url);
  assert.strictEqual(response.body.likes, updatedData.likes);

  const blogsAtEnd = await blogsInDb();
  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

  assert.strictEqual(updatedBlog.title, updatedData.title);
  assert.strictEqual(updatedBlog.author, updatedData.author);
  assert.strictEqual(updatedBlog.url, updatedData.url);
  assert.strictEqual(updatedBlog.likes, updatedData.likes);
});

after(async () => {
  await mongoose.connection.close();
});
