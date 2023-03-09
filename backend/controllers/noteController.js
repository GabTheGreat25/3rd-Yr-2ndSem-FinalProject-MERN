const Note = require("../models/Note");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.getAllNotes = asyncHandler(async (req, res, next) => {
  const notes = await Note.find()
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return !notes?.length
    ? next(new ErrorHandler("No notes found"))
    : SuccessHandler(
        res,
        `Notes with titles ${notes
          .map((u) => u.name)
          .join(", ")} and IDs ${notes.map((u) => u._id).join(", ")} retrieved`,
        notes
      );
});

exports.getSingleNote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Note not found with ID: ${id}`));

  const note = await Note.findById(id).populate("user", "name").lean().exec();

  return !note
    ? next(new ErrorHandler("No note found"))
    : SuccessHandler(res, `Note ${note.title} with ID ${id} retrieved`, note);
});

exports.createNewNote = asyncHandler(async (req, res, next) => {
  const requiredFields = ["user", "title", "text"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length)
    return next(
      new ErrorHandler(
        JSON.stringify(
          missingFields.map((field) => ({ [field]: `${field} is required` }))
        ).replace(/[{}\[\]\\"]/g, "")
      )
    );

  const { user, title, text } = req.body;

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate title"))
    : await Note.create({
        user,
        title,
        text,
      }).then((note) =>
        SuccessHandler(
          res,
          `New note ${title} created with an ID ${note._id}`,
          note
        )
      );
});

exports.updateNote = asyncHandler(async (req, res, next) => {
  const requiredFields = ["user", "title", "text"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length)
    return next(
      new ErrorHandler(
        JSON.stringify(
          missingFields.map((field) => ({ [field]: `${field} is required` }))
        ).replace(/[{}\[\]\\"]/g, "")
      )
    );

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new ErrorHandler(`Note not found with ID: ${req.params.id}`));

  const note = await Note.findById(req.params.id).exec();

  if (!note) return next(new ErrorHandler("No note found"));

  const duplicate = await Note.findOne({
    title: req.body.title,
    _id: { $ne: note._id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate title"))
    : Note.findByIdAndUpdate(note._id, req.body, {
        new: true,
        runValidators: true,
      })
        .lean()
        .exec()
        .then((updatedNote) =>
          !updatedNote
            ? next(new ErrorHandler("No note found"))
            : SuccessHandler(
                res,
                `Note ${updatedNote.title} with ID ${updatedNote._id} is updated`,
                updatedNote
              )
        );
});

exports.deleteNote = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Note not found with ID: ${id}`));

  if (!id) return next(new ErrorHandler("Note ID required"));

  const note = await Note.findOneAndDelete({ _id: id }).lean().exec();

  return !note
    ? next(new ErrorHandler("No note found"))
    : SuccessHandler(res, `Note ${note.title} with ID ${id} is deleted`, note);
});
