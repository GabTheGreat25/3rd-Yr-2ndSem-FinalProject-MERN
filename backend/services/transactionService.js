const Transaction = require('../models/transaction')
const ErrorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')

exports.getAllTransactionsData = (page, limit, search, sort, filter) => {
  const skip = (page - 1) * limit

  let transactionsQuery = Transaction.find().populate([
    {
      path: 'user',
      select: 'name',
    },
    {
      path: 'camera',
      select: 'name',
    },
  ])

  // Apply search option
  if (search) {
    transactionsQuery = transactionsQuery
      .where('status')
      .equals(new RegExp(search, 'i'))
  }

  // Apply sort option
  if (sort) {
    const [field, order] = sort.split(':')
    transactionsQuery = transactionsQuery.sort({
      [field]: order === 'asc' ? 1 : -1,
    })
  } else {
    transactionsQuery = transactionsQuery.sort({ createdAt: -1 })
  }

  // Apply filter option
  if (filter) {
    const [field, value] = filter.split(':')
    transactionsQuery = transactionsQuery.where(field).equals(value)
  }

  transactionsQuery = transactionsQuery.skip(skip).limit(limit)

  return transactionsQuery
}

exports.getSingleTransactionData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid transaction ID: ${id}`)

  const transaction = await Transaction.findById(id)
    .populate([
      {
        path: 'user',
        select: 'name',
      },
      {
        path: 'camera',
        select: 'name',
      },
    ])
    .lean()
    .exec()

  if (!transaction)
    throw new ErrorHandler(`Transaction not found with ID: ${id}`)

  return transaction
}

exports.CreateTransactionData = async (req, red) => {
  const transaction = await Transaction.create(req.body)

  return transaction
}

exports.updateTransactionData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid transaction ID: ${id}`)

  const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec()

  if (!updatedTransaction)
    throw new ErrorHandler(`Transaction not found with ID: ${id}`)

  return updatedTransaction
}

exports.deleteTransactionData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid transaction ID: ${id}`)

  if (!id) throw new ErrorHandler(`Transaction not found with ID: ${id}`)

  const transaction = await Transaction.findOneAndDelete({ _id: id })
    .lean()
    .exec()

  return transaction
}
