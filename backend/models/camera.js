const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const cameraSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please enter a camera"],
    maxLength: [30, "The camera name cannot exceed 30 characters"],
  },

  text: {
    type: String,
    required: [true, "Please enter a description of your camera"],
  },

  price: {
    type: String,
    required: [true, "Please enter a price"],
  },
});

module.exports = mongoose.model(RESOURCE.CAMERA, cameraSchema);
