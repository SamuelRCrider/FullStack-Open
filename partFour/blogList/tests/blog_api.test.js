const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("tests", () => {
  test("blogs are in database and are json", async () => {
    const res = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(res.body.length, helper.initialBlogs.length);
  });

  test("unique identifer is .id", async () => {
    const res = await api.get("/api/blogs");
    assert(Object.keys(res.body[0]).includes("id"));
  });

  test("blogs can be added to db", async () => {
    const newBlog = {
      title: "these patterns are boring",
      author: "ya boi",
      url: "https://meowmy.gov/",
      likes: 774,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const afterPostBlogs = await helper.blogsInDb();
    const contents = afterPostBlogs.map((blog) => blog.title);
    assert(contents.includes("these patterns are boring"));
    assert.strictEqual(helper.initialBlogs.length + 1, afterPostBlogs.length);
  });

  test("if no likes key, it will be added and set to zero", async () => {
    const newBlog = {
      title: "oh no! i have no likes!",
      author: "ya boi",
      url: "https://meowmy.gov/",
    };

    const res = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert(Object.keys(res.body).includes("likes"));
  });

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

  after(async () => await mongoose.connection.close());
});
