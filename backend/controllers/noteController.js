const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const notesService = require("../services/noteService");
const asyncHandler = require("express-async-handler");
const checkRequiredFields = require("../helpers/checkRequiredFields");

exports.getAllNotes = asyncHandler(async (req, res, next) => {
  const notes = await notesService.getAllNotesData();

  return !notes?.length
    ? next(new ErrorHandler("No notes found"))
    : SuccessHandler(
        res,
        `Notes with titles ${notes
          .map((u) => u.title)
          .join(", ")} and IDs ${notes.map((u) => u._id).join(", ")} retrieved`,
        notes
      );
});

exports.getSingleNote = asyncHandler(async (req, res, next) => {
  const note = await notesService.getSingleNoteData(req.params.id);

  return !note
    ? next(new ErrorHandler("No note found"))
    : SuccessHandler(
        res,
        `Note ${note.title} with ID ${note._id} retrieved`,
        note
      );
});

exports.createNewNote = [
  checkRequiredFields(["user", "title", "text"]),
  asyncHandler(async (req, res, next) => {
    const note = await notesService.CreateNoteData(req);

    return SuccessHandler(
      res,
      `New note ${note.title} created with an ID ${note._id}`,
      note
    );
  }),
];

exports.updateNote = [
  checkRequiredFields(["user", "title", "text"]),
  asyncHandler(async (req, res, next) => {
    const note = await notesService.updateNoteData(req, res, req.params.id);

    return SuccessHandler(
      res,
      `Note ${note.title} with ID ${note._id} is updated`,
      note
    );
  }),
];

exports.deleteNote = asyncHandler(async (req, res, next) => {
  const note = await notesService.deleteNoteData(req.params.id);

  return !note
    ? next(new ErrorHandler("No note found"))
    : SuccessHandler(
        res,
        `Note ${note.title} with ID ${note._id} is deleted`,
        note
      );
});
