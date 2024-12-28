const { beforeEach, after, describe, test } = require("node:test");
const assert = require("assert");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("Creation suceeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

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

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  test("fails with status 400 if username is too short with suitable error message", async () => {
    const newUser = {
      username: "us",
      name: "Short Username",
      password: "validpassword",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      response.body.error,
      "Username must be at least 3 characters long"
    );
  });

  test("fails with status 400 if password is too short", async () => {
    const newUser = {
      username: "validuser",
      name: "Valid User",
      password: "12",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      response.body.error.includes("Password must be atleast 3 characters")
    );
  });

  after(() => {
    mongoose.connection.close();
  });
});
