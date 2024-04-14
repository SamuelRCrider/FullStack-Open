const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Note = require("../models/note");
const helper = require("./test_helper");

beforeEach(async () => {
  await Note.deleteMany({});
  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  // promise all executes the promises in parallel, not one by one
  await Promise.all(promiseArray);
});

test("notes are returned as JSON", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two notes", async () => {
  const response = await api.get("/api/notes");
  assert.strictEqual(response.body.length, helper.initialNotes.length);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);

  assert(contents.includes("HTML is easy"));
});

test("a valid  note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // calling for the notes directly from the database because we need to verify/test that the DB received the post
  const notesAtEnd = await helper.notesInDb();

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((note) => note.content);
  assert(contents.includes("async/await simplifies making async calls"));
});

test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api.post("/api/notes").send(newNote).expect(400);

  // calling for the notes directly from the database because we need to verify/test that the DB received the post
  const notesAtEnd = await helper.notesInDb();

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
});

test("a specific note can be viewed", async () => {
  // initialization phase, fetch a note from the database
  const notesAtStart = await helper.notesInDb();
  const noteToBeViewed = notesAtStart[0];

  // call the actual operation being tested
  const resultNote = await api
    .get(`/api/notes/${noteToBeViewed.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // verify that the outcome of the operation is as expected
  assert.deepStrictEqual(resultNote.body, noteToBeViewed);
});

test("a note can be deleted", async () => {
  // initialization phase, fetch a note from the database
  const notesAtStart = await helper.notesInDb();
  const notetoDelete = notesAtStart[0];

  // call the actual operation being tested
  await api.delete(`/api/notes/${notetoDelete.id}`).expect(204);

  // verify that the outcome of the operation is as expected
  const notesAtEnd = await helper.notesInDb();
  const contents = notesAtEnd.map((note) => note.content);
  assert(!contents.includes(notetoDelete.content));

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
});

after(async () => {
  await mongoose.connection.close();
});
