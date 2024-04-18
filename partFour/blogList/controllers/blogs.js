const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken) {
      return response.status(400).json({ error: "invalid token" });
    }

    const currentUser = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: currentUser.id,
    });

    const savedBlog = await blog.save();
    currentUser.blogs = currentUser.blogs.concat(savedBlog.id);
    await currentUser.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
    response.status(400).end();
  }
});

blogRouter.delete("/:id", async (request, response, next) => {
  // we need to decode the current token and get the current user id
  // and we need to get the user id of the blog to be deleted
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const blogToDelete = await Blog.findById(request.params.id);

    if (!decodedToken.id)
      return response.status(401).json({ error: "no token found" });
    if (decodedToken.id !== blogToDelete.user.toString()) {
      return response
        .status(401)
        .json({ error: "only blog creator can delete blog" });
    }

    const authorOfBlog = await User.findById(blogToDelete.user.toString());
    authorOfBlog.blogs = authorOfBlog.blogs.pop(blogToDelete.id);
    await authorOfBlog.save();
    await Blog.findByIdAndDelete(request.params.id);

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
      context: "query",
    });
    response.json(updatedBlog).status(200);
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
