const Transaction = require("../models/transaction");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");

exports.getAllTransactionsData = async () => {
  const transactions = await Transaction.find()
    .populate([
      {
        path: "user",
        select: "name",
      },
      {
        path: "camera",
        select: "name",
      },
    ])

    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return transactions;
};

exports.getSingleTransactionData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid transaction ID: ${id}`);

  const transaction = await Transaction.findById(id)
    .populate([
      {
        path: "user",
        select: "name",
      },
      {
        path: "camera",
        select: "name",
      },
    ])
    .lean()
    .exec();

  if (!transaction)
    throw new ErrorHandler(`Transaction not found with ID: ${id}`);

  return transaction;
};

exports.CreateTransactionData = async (req, red) => {
  const transaction = await Transaction.create(req.body);

  return transaction;
};

exports.updateTransactionData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid transaction ID: ${id}`);

  const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  if (!updatedTransaction)
    throw new ErrorHandler(`Transaction not found with ID: ${id}`);

  return updatedTransaction;
};

exports.deletedTransactionData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid transaction ID: ${id}`);

  if (!id) throw new ErrorHandler(`Transaction not found with ID: ${id}`);

  const transaction = await Transaction.findOneAndDelete({ _id: id })
    .lean()
    .exec();

  return transaction;
};
