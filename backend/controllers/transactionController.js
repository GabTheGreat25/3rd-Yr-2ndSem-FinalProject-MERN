const SuccessHandler = require('../utils/successHandler')
const ErrorHandler = require('../utils/errorHandler')
const transactionsService = require('../services/transactionService')
const asyncHandler = require('express-async-handler')
const checkRequiredFields = require('../helpers/checkRequiredFields')

exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const search = req.query.search
  const sort = req.query.sort
  const filter = req.query.filter

  const transactionsQuery = transactionsService.getAllTransactionsData(
    page,
    limit,
    search,
    sort,
    filter,
  )
  const transactions = await transactionsQuery.lean()

  if (!transactions.length) {
    return next(new ErrorHandler('No transactions found'))
  }

  const transactionStatuses = transactions.map((u) => u.status).join(', ')
  const transactionIds = transactions.map((u) => u._id).join(', ')

  return SuccessHandler(
    res,
    `Transactions with status ${transactionStatuses} and IDs ${transactionIds} retrieved`,
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
  asyncHandler(async (req, res, next) => {
    const { user, cameras, status, date } = req.body
    if (!user || !cameras || !status || !date) {
      return ErrorHandler(res, 400, 'Missing required fields')
    }

    const transactions = []

    for (const camera of cameras) {
      const transaction = await transactionsService.CreateTransactionData({
        user,
        camera,
        status,
        date,
      })
      transactions.push(transaction)
    }

    return SuccessHandler(
      res,
      `New transactions on ${date} were created with IDs ${transactions
        .map((t) => t._id)
        .join(', ')}`,
      transactions,
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
