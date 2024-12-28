const { beforeEach, after, describe, test } = require("node:test");
const assert = require("assert");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app");
const User = require("../models/user");
const mongoose = require("mongoose");

const api = supertest(app);

const usersInDb = async () => {
  return await User.find({});
};

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("Creation suceeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users/")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  });

  after(() => {
    mongoose.connection.close();
  });
});
