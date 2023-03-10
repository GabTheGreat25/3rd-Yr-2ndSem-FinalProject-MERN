const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const { RESOURCE } = require('../constants/index')

const commentSchema = new mongoose.Schema(
  {
    transactions: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Transactions',
    },
    ratings: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model(RESOURCE.COMMENT, commentSchema)
