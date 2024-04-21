const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");

const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");

describe("when there is one user in DB", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("iamroot", 10);
    const user = new User({ username: "root", passwordHash: passwordHash });

    await user.save();
  });

  test("able to create users with unique usernames", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "bean sammy",
      name: "guy no. 1",
      password: "beantacofresh",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
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

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
