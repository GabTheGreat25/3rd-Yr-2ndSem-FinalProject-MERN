const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')

router
  .route('/comment')
  .get(commentController.getAllComment)
  .post(commentController.createNewComment)

router
  .route('/comment/:id')
  .get(commentController.getSingleComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment)

module.exports = router
