const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("iamroot", 10);
  const user = new User({ username: "root", passwordHash: passwordHash });
  await user.save();

  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("when blogs are in database", () => {
  test("a user can login", async () => {
    await api
      .post("/api/login")
      .send({ username: "root", password: "iamroot" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs are in database and are json", async () => {
    const res = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(res._body.length, helper.initialBlogs.length);
  });

  test("unique identifer is .id, not ._id", async () => {
    const res = await api.get("/api/blogs");
    assert(Object.keys(res.body[0]).includes("id"));
  });

  describe("manipulating database", () => {
    test("blogs can be updated with newer information", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedInfo = {
        title: "fdghdghgdbfgsnhdggsh gf",
        author: "dfghj",
        url: "dfgnhgmj,tkumryueny",
        likes: 4567,
      };
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedInfo)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert(blogsAtEnd[0].title.includes("fdghdghgdbfgsnhdggsh gf"));
    });

    test("blogs can be deleted from db", async () => {
      // this test is broken, the delete method res statuscode is 401
      const res = await api
        .post("/api/login")
        .send({ username: "root", password: "iamroot" })
        .expect(200);
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .auth(res._body.token, { type: "bearer" })
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const contents = blogsAtEnd.map((blog) => blog.title);
      assert(!contents.includes(blogToDelete.title));
    });

    test("blogs cannot be added without proper token", async () => {
      const newBlog = {
        title: "these patterns are boring",
        author: "ya boi",
        url: "https://meowmy.gov/",
        likes: 774,
      };
      await api
        .post("/api/blogs")
        .auth("fake23456token45", { type: "bearer" })
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);
    });

    test("blogs can be added to db", async () => {
      const res = await api
        .post("/api/login")
        .send({ username: "root", password: "iamroot" })
        .expect(200);

      const newBlog = {
        title: "these patterns are boring",
        author: "ya boi",
        url: "https://meowmy.gov/",
        likes: 774,
      };

      await api
        .post("/api/blogs")
        .auth(res._body.token, { type: "bearer" })
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const afterPostBlogs = await helper.blogsInDb();
      const contents = afterPostBlogs.map((blog) => blog.title);
      assert(contents.includes("these patterns are boring"));
      assert.strictEqual(helper.initialBlogs.length + 1, afterPostBlogs.length);
    });

    test("if no likes key, it will be added and set to zero", async () => {
      const login = await api
        .post("/api/login")
        .send({ username: "root", password: "iamroot" })
        .expect(200);
      const newBlog = {
        title: "oh no! i have no likes!",
        author: "ya boi",
        url: "https://meowmy.gov/",
      };

      const res = await api
        .post("/api/blogs")
        .auth(login._body.token, { type: "bearer" })
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert(Object.keys(res.body).includes("likes"));
    });
  });

  describe("when keys don't have values", () => {
    test("if title is missing, the backend responds with status code 400", async () => {
      const newBlog = {
        author: "ya boi",
        url: "https://meowmy.gov/",
        likes: 774,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });

    test("if url is missing, the backend responds with status code 400", async () => {
      const newBlog = {
        title: "stuff is happening! ahhh",
        author: "ya boi",
        likes: 774,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });
  });

  after(async () => await mongoose.connection.close());
});
