const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");

const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");

describe("when there is one user in database", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("iamroot", 10);
    const user = new User({ username: "root", passwordHash: passwordHash });

    await user.save();
  });

  describe("invalid users are not created", () => {
    test("non-unique username user is not created", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        password: "testpassword",
        name: "brock",
      };

      const result = await api.post("/api/users").send(newUser).expect(400);
      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));
      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test("invalid username user is not created", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "hi",
        password: "testpassword",
        name: "croc",
      };

      const result = await api.post("/api/users").send(newUser).expect(400);
      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes(
          "Path `username`",
          "is shorter than the minimum allowed length (3)"
        )
      );
      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test("invalid password user is not created", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "rootroot",
        password: "hi",
        name: "sock",
      };

      const result = await api.post("/api/users").send(newUser).expect(400);
      console.log("HYPE", result.body.error);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes("password must be at least 3 characters")
      );
      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
