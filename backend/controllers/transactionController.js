const Transactions = require("../models/transaction");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await Transactions.find()
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "camera",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return !transactions?.length
    ? next(new ErrorHandler("No transactions found"))
    : SuccessHandler(
        res,
        `Transactions with status ${transactions
          .map((u) => u.status)
          .join(", ")} and IDs ${transactions
          .map((u) => u._id)
          .join(", ")} retrieved`,
        transactions
      );
});
exports.getSingleTransactions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Transactions not found with ID: ${id}`));

  const transactions = await Transactions.findById(id)
    .populate("camera", "status") // populate the "camera" field with the "status" field of the referenced Camera document
    .lean()
    .exec();

  return !transactions
    ? next(new ErrorHandler("No transactions found"))
    : SuccessHandler(
        res,
        `Transactions ${transactions.status} with ID ${id} retrieved`,
        transactions
      );
});

exports.createNewTransactions = asyncHandler(async (req, res, next) => {
  const requiredFields = ["user", "camera", "status", "date"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length)
    return next(
      new ErrorHandler(
        JSON.stringify(
          missingFields.map((field) => ({ [field]: `${field} is required` }))
        ).replace(/[{}\[\]\\"]/g, "")
      )
    );

  const { user, camera, status, date } = req.body;

  const duplicate = await Transactions.findOne({ status })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate status"))
    : await Transactions.create({
        user,
        camera,
        status,
        date,
      }).then((transactions) =>
        SuccessHandler(
          res,
          `New transactions ${status} created with an ID ${transactions._id}`,
          transactions
        )
      );
});

exports.updateTransactions = asyncHandler(async (req, res, next) => {
  const requiredFields = ["user", "camera", "status", "date"];
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
      new ErrorHandler(`Transactions not found with ID: ${req.params.id}`)
    );

  const transactions = await Transactions.findById(req.params.id).exec();

  if (!transactions) return next(new ErrorHandler("No transactions found"));

  const duplicate = await Transactions.findOne({
    status: req.body.status,
    _id: { $ne: transactions._id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate status"))
    : Transactions.findByIdAndUpdate(transactions._id, req.body, {
        new: true,
        runValidators: true,
      })
        .lean()
        .exec()
        .then((updatedTransactions) =>
          !updatedTransactions
            ? next(new ErrorHandler("No transactions found"))
            : SuccessHandler(
                res,
                `Transactions ${updatedTransactions.status} with ID ${updatedTransactions._id} is updated`,
                updatedTransactions
              )
        );
});

exports.deleteTransactions = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Transactions not found with ID: ${id}`));

  if (!id) return next(new ErrorHandler("Transactions ID required"));

  const transactions = await Transactions.findOneAndDelete({ _id: id })
    .lean()
    .exec();

  return !transactions
    ? next(new ErrorHandler("No transactions found"))
    : SuccessHandler(
        res,
        `Transactions ${transactions.name} with ID ${id} is deleted`,
        transactions
      );
});
