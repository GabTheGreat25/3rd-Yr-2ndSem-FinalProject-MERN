const Comment = require('../models/Comment')
const SuccessHandler = require('../utils/successHandler')
const ErrorHandler = require('../utils/errorHandler')
const commentsService = require('../services/commentService')
const asyncHandler = require('express-async-handler')
const checkRequiredFields = require('../helpers/checkRequiredFields')

exports.getAllComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const commentsQuery = commentsService.getAllCommentsData(page, limit)
  const comments = await commentsQuery

  if (!comments.length) {
    return next(new ErrorHandler('No comment found'))
  }

  const commentTexts = comments.map((u) => u.text).join(', ')
  const commentIds = comments.map((u) => u._id).join(', ')

  return SuccessHandler(
    res,
    `Comment with texts ${commentTexts} and IDs ${commentIds} retrieved`,
    comments,
  )
})

exports.getSingleComment = asyncHandler(async (req, res, next) => {
  const comment = await commentsService.getSingleCommentData(req.params.id)

  return !comment
    ? next(new ErrorHandler('No comment found'))
    : SuccessHandler(
        res,
        `Comment ${comment.text} with ID ${comment._id} retrieved`,
        comment,
      )
})

exports.createNewComment = [
  checkRequiredFields(['transservice', 'ratings', 'text']),
  asyncHandler(async (req, res, next) => {
    const comment = await commentsService.CreateCommentData(req)

    return SuccessHandler(
      res,
      `New comment ${comment.text} created with an ID ${comment._id}`,
      comment,
    )
  }),
]

exports.updateComment = [
  checkRequiredFields(['transservice', 'ratings', 'text']),
  asyncHandler(async (req, res, next) => {
    const comment = await commentsService.updateCommentData(
      req,
      res,
      req.params.id,
    )

    return SuccessHandler(
      res,
      `Comment ${comment.text} with ID ${comment._id} is updated`,
      comment,
    )
  }),
]

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await commentsService.deleteCommentData(req.params.id)

  return !comment
    ? next(new ErrorHandler('No comment found'))
    : SuccessHandler(
        res,
        `Comment ${comment.text} with ID ${comment._id} is deleted`,
        comment,
      )
})
