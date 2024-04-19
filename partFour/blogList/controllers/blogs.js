const middleware = require("../utils/middleware");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");

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

blogRouter.post(
  "/",
  middleware.extractToken,
  middleware.extractUser,
  async (request, response, next) => {
    try {
      const body = request.body;
      const currentUser = request.user;

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
  }
);

blogRouter.delete(
  "/:id",
  middleware.extractToken,
  middleware.extractUser,
  async (request, response, next) => {
    try {
      const blogToDelete = await Blog.findById(request.params.id);
      const currUser = request.user;
      const currUserBlogIds = currUser.blogs.map((id) => id.toString());
      const matchIds = currUserBlogIds.filter((id) => id === blogToDelete.id);

      if (!(matchIds.length === 1)) {
        return response
          .status(401)
          .json({ error: "only blog creator can delete blog" });
      }

      currUser.blogs = currUser.blogs.filter(
        (id) => id.toString() !== blogToDelete.id
      );
      await currUser.save();
      await Blog.findByIdAndDelete(request.params.id);

      response.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

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
