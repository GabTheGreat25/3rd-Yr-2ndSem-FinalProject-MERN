const Comment = require("../models/Comment");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.getAllComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.find()
    .populate({ path: "transaction", select: "status" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return !comment?.length
    ? next(new ErrorHandler("No comment found"))
    : SuccessHandler(
        res,
        `Comment with texts ${comment
          .map((u) => u.text)
          .join(", ")} and IDs ${comment
          .map((u) => u._id)
          .join(", ")} retrieved`,
        comment
      );
});

exports.getSingleComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Comment not found with ID: ${id}`));

  const comment = await Comment.findById(id)
    .populate({ path: "transaction", select: "status" })
    .lean()
    .exec();

  return !comment
    ? next(new ErrorHandler("No comment found"))
    : SuccessHandler(
        res,
        `Comment ${comment.text} with ID ${id} retrieved`,
        comment
      );
});

exports.createNewComment = asyncHandler(async (req, res, next) => {
  const requiredFields = ["transaction", "ratings", "text"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length)
    return next(
      new ErrorHandler(
        JSON.stringify(
          missingFields.map((field) => ({ [field]: `${field} is required` }))
        ).replace(/[{}\[\]\\"]/g, "")
      )
    );

  const { transaction, ratings, text } = req.body;

  await Comment.create({
    transaction,
    ratings,
    text,
  }).then((comment) =>
    SuccessHandler(
      res,
      `New comment ${text} created with an ID ${comment._id}`,
      comment
    )
  );
});

exports.updateComment = asyncHandler(async (req, res, next) => {
  const requiredFields = ["transaction", "ratings", "text"];
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
    return next(
      new ErrorHandler(`Comment not found with ID: ${req.params.id}`)
    );

  const comment = await Comment.findById(req.params.id).exec();

  if (!comment) return next(new ErrorHandler("No comment found"));

  await Comment.findByIdAndUpdate(comment._id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec()
    .then((updatedComment) =>
      !updatedComment
        ? next(new ErrorHandler("No Comment found"))
        : SuccessHandler(
            res,
            `Comment ${updatedComment.text} with ID ${updatedComment._id} is updated`,
            updatedComment
          )
    );
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Comment not found with ID: ${id}`));

  if (!id) return next(new ErrorHandler("Comment ID required"));

  const comment = await Comment.findOneAndDelete({ _id: id }).lean().exec();

  return !comment
    ? next(new ErrorHandler("No comment found"))
    : SuccessHandler(
        res,
        `Comment ${comment.text} with ID ${id} is deleted`,
        comment
      );
});
