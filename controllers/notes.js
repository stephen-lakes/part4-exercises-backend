const notesRouter = require("express").Router();
const Note = require("../models/note");
const logger = require("../utils/logger");

notesRouter.get("/", async (request, response, next) => {
  try {
    const notes = await Note.find({});
    response.json(notes);
  } catch (error) {
    logger.error("Error fetching notes:", error.message);
    next(error);
  }
});

notesRouter.get("/:id", async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    logger.error("Error fetching notes:", error.message);
    next(error);
  }
});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  try {
    const savedNote = await note.save();
    response.status(201).json(savedNote);
  } catch (error) {
    logger.error("Error fetching notes:", error.message);
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    logger.error("Error deleting note:", error.message);
    next(error);
  }
});

notesRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };

  try {
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
      new: true,
    });
    response.json(updatedNote);
  } catch (error) {
    logger.error("Error updating note", error.message);
    next(error);
  }
});

module.exports = notesRouter;
