const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const User = require("../models/user");
const Note = require("../models/note");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  res.json(notes);
});

notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const currentUser = await User.findById(decodedToken.id);
    if (!body.content) {
      return res.status(400).json({ error: "content missing" });
    }

    const note = new Note({
      content: body.content,
      important: Boolean(body.important) || false,
      user: currentUser.id,
    });

    const savedNote = await note.save();
    currentUser.notes = currentUser.notes.concat(savedNote.id);
    await currentUser.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

module.exports = notesRouter;
