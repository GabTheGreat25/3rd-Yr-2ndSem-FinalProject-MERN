const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const transactionsAction = require("../actions/transactionAction");
const asyncHandler = require("express-async-handler");
const checkRequiredFields = require("../helpers/checkRequiredFields");

exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await transactionsAction.getAllTransactionsData();

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
  const transaction = await transactionsAction.getSingleTransactionData(
    req.params.id
  );

  return !transaction
    ? next(new ErrorHandler("No transaction found"))
    : SuccessHandler(
        res,
        `Transaction with ID ${transaction.id} is ${transaction.status}`,
        transaction
      );
});

exports.createNewTransactions = [
  checkRequiredFields(["user", "camera", "status", "date"]),
  asyncHandler(async (req, res, next) => {
    const transaction = await transactionsAction.CreateTransactionData(req);

    return SuccessHandler(
      res,
      `New transaction on ${transaction.date} was created with an ID ${transaction._id}`,
      transaction
    );
  }),
];

exports.updateTransactions = [
  checkRequiredFields(["user", "camera", "status", "date"]),
  asyncHandler(async (req, res, next) => {
    const transaction = await transactionsAction.updateTransactionData(
      req,
      res,
      req.params.id
    );

    return SuccessHandler(
      res,
      `Transaction on ${transaction.date} with ID ${transaction._id} is updated`,
      transaction
    );
  }),
];

exports.deleteTransactions = asyncHandler(async (req, res, next) => {
  const transaction = await commentsAction.deleteCommentData(req.params.id);

  return !transaction
    ? next(new ErrorHandler("No transaction found"))
    : SuccessHandler(
        res,
        `Transaction on ${transaction.date} with ID ${id} is deleted`,
        transaction
      );
});
