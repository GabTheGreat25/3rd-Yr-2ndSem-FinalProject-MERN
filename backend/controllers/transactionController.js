const SuccessHandler = require('../utils/successHandler')
const ErrorHandler = require('../utils/errorHandler')
const transactionsService = require('../services/transactionService')
const asyncHandler = require('express-async-handler')
const checkRequiredFields = require('../helpers/checkRequiredFields')

exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const transactions = await transactionsService.getAllTransactionsData(
    page,
    limit,
  )

  return !transactions?.length
    ? next(new ErrorHandler('No transactions found'))
    : SuccessHandler(
        res,
        `Transactions with status ${transactions
          .map((u) => u.status)
          .join(', ')} and IDs ${transactions
          .map((u) => u._id)
          .join(', ')} retrieved`,
        transactions,
      )
})

exports.getSingleTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await transactionsService.getSingleTransactionData(
    req.params.id,
  )

  return !transaction
    ? next(new ErrorHandler('No transaction found'))
    : SuccessHandler(
        res,
        `Transaction with ID ${transaction.id} is ${transaction.status}`,
        transaction,
      )
})

exports.createNewTransaction = [
  checkRequiredFields(['user', 'camera', 'status', 'date']),
  asyncHandler(async (req, res, next) => {
    const transaction = await transactionsService.CreateTransactionData(req)

    return SuccessHandler(
      res,
      `New transaction on ${transaction.date} was created with an ID ${transaction._id}`,
      transaction,
    )
  }),
]

exports.updateTransaction = [
  checkRequiredFields(['user', 'camera', 'status', 'date']),
  asyncHandler(async (req, res, next) => {
    const transaction = await transactionsService.updateTransactionData(
      req,
      res,
      req.params.id,
    )

    return SuccessHandler(
      res,
      `Transaction on ${transaction.date} with ID ${transaction._id} is updated`,
      transaction,
    )
  }),
]

exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await transactionsService.deleteTransactionData(
    req.params.id,
  )

  return !transaction
    ? next(new ErrorHandler('No transaction found'))
    : SuccessHandler(
        res,
        `Transaction on ${transaction.date} with ID ${transaction._id} is deleted`,
        transaction,
      )
})
