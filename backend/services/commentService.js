const Comment = require('../models/Comment')
const ErrorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')

exports.getAllCommentsData = (page, limit) => {
  const skip = (page - 1) * limit

  const comments = Comment.find()
    .populate({ path: 'transaction', select: 'status' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return comments
}

exports.getSingleCommentData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid comment ID: ${id}`)

  const comment = await Comment.findById(id)
    .populate({ path: 'transaction', select: 'status' })
    .lean()
    .exec()

  if (!comment) throw new ErrorHandler(`Comment not found with ID: ${id}`)

  return comment
}

exports.CreateCommentData = async (req, res) => {
  const comment = await Comment.create(req.body)

  return comment
}

exports.updateCommentData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid comment ID: ${id}`)

  const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec()

  if (!updatedComment)
    throw new ErrorHandler(`Comment not found with ID: ${id}`)

  return updatedComment
}

exports.deleteCommentData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid comment ID: ${id}`)

  if (!id) throw new ErrorHandler(`Comment not found with ID: ${id}`)

  const comment = await Comment.findOneAndDelete({ _id: id }).lean().exec()
}
