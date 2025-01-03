const Note = require("../models/note");
const User = require("../models/user");

const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "Browser can execute only JavaScript",
    important: true,
  },
];

const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlN0ZXBoZW5PbHV5b21pIiwiaWQiOiI2NzZmYjZmYzRlNjI2ZjVmZTUzMTRhNTAiLCJpYXQiOjE3MzU3MzQyNDgsImV4cCI6MTczNTgyMDY0OH0.McsEqW3icblcYaQ5vVcrddNgd9p2Flec0fomYDAc78I`;

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  token,
};
