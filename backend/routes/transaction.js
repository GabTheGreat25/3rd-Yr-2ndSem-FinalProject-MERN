const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionController");

router
  .route("/transactions")
  .get(transactionsController.getAllTransactions)
  .post(transactionsController.createNewTransactions);

router
  .route("/transaction/:id")
  .get(transactionsController.getSingleTransactions)
  .patch(transactionsController.updateTransactions)
  .delete(transactionsController.deleteTransactions);

module.exports = router;
