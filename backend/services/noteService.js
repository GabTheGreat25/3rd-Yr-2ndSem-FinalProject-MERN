const Note = require('../models/Note')
const ErrorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')

exports.getAllNotesData = async (page, limit) => {
  const skip = (page - 1) * limit

  const notes = await Note.find()
    .populate({ path: 'user', select: 'name' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()

  return notes
}

exports.getSingleNoteData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid note ID: ${id}`)

  const note = await Note.findById(id)
    .populate({ path: 'user', select: 'name' })
    .lean()
    .exec()

  if (!note) throw new ErrorHandler(`Note not found with ID: ${id}`)

  return note
}

exports.CreateNoteData = async (req, res) => {
  const duplicateNote = await Note.findOne({ title: req.body.title })
    .collation({ locale: 'en' })
    .lean()
    .exec()

  if (duplicateNote) throw new ErrorHandler('Duplicate title')

  const note = await Note.create(req.body)

  return note
}

exports.updateNoteData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid note ID: ${id}`)

  const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec()

  if (!updatedNote) throw new ErrorHandler(`Note not found with ID: ${id}`)

  const duplicate = await Note.findOne({
    title: req.body.title,
    _id: { $ne: id },
  })
    .collation({ locale: 'en' })
    .lean()
    .exec()

  if (duplicate) throw new ErrorHandler('Duplicate title')

  return updatedNote
}

exports.deleteNoteData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid note ID: ${id}`)

  if (!id) throw new ErrorHandler(`Note not found with ID: ${id}`)

  const note = await Note.findOneAndDelete({ _id: id }).lean().exec()

  return note
}
