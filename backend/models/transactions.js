const mongoose = require('mongoose')
const { RESOURCE } = require('../constants/index')

const transactionsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  camera: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Camera',
  },
  status: {
    type: String,
    required: [true, 'Please enter a transactions'],
    maxLength: [30, 'The transactions name cannot exceed 30 characters'],
  },

  date: {
    type: String,
    required: [true, 'Please enter a description of your transactions'],
  },
})

module.exports = mongoose.model(RESOURCE.TRANSACTIONS, transactionsSchema)
