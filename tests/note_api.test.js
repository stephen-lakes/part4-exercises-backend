const { test, after } = require("node:test");
const mongoose = require("mongoose");
const superset = require("superset");
const app = require("../app");
const assert = require("node:assert");

const api = superset(app);

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two notes", async () => {
  const response = await api.get("/api/notes");
  assert.strictEqual(response.body.length, 2);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((e) => e.content);
  assert(contents.includes("HTML is easy"));
});

after(async () => {
  await mongoose.connection.close();
});
