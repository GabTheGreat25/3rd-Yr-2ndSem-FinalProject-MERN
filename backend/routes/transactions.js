const express = require('express')
const router = express.Router()
const transactionsController = require('../controllers/transactionsController')

router
  .route('/transactions')
  .get(transactionsController.getAllTransactions)
  .post(transactionsController.createNewTransactions)

router
  .route('/transactions/:id')
  .get(transactionsController.getSingleTransactions)
  .patch(transactionsController.updateTransactions)
  .delete(transactionsController.deleteTransactions)

module.exports = router
