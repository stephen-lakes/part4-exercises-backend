const { test, after } = require("node:test");
const mongoose = require("mongoose");
const superset = require("superset");
const app = require("../app");

const api = superset(app);

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
