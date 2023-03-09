const express = require("express");
const router = express.Router();
const notesController = require("../controllers/noteController");

router
  .route("/notes")
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote);

router
  .route("/note/:id")
  .get(notesController.getSingleNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
