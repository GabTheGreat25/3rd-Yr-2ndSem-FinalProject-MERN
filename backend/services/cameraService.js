const Camera = require('../models/Camera')
const ErrorHandler = require('../utils/errorHandler')
const mongoose = require('mongoose')
const { cloudinary } = require('../utils/cloudinary')

exports.getAllCamerasData = (page, limit) => {
  const skip = (page - 1) * limit

  const camerasQuery = Camera.find()
    .populate({ path: 'user', select: 'name' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  return camerasQuery
}

exports.getSingleCameraData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid camera ID: ${id}`)

  const camera = await Camera.findById(id)
    .populate({ path: 'user', select: 'name' })
    .lean()
    .exec()

  if (!camera) throw new ErrorHandler(`Camera not found with ID: ${id}`)

  return camera
}

exports.CreateCameraData = async (req, res) => {
  if (
    await Camera.findOne({ name: req.body.name })
      .collation({ locale: 'en' })
      .lean()
      .exec()
  )
    throw new ErrorHandler('Duplicate name')

  const images = await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        public_id: file.filename,
      })
      return {
        public_id: result.public_id,
        url: result.url,
        originalname: file.originalname,
      }
    }),
  )

  const camera = await Camera.create({ ...req.body, image: images })

  return camera
}

exports.updateCameraData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid camera ID: ${id}`)

  const existingCamera = await Camera.findById(id).lean().exec()

  if (!existingCamera) throw new ErrorHandler(`Camera not found with ID: ${id}`)

  const duplicateCamera = await Camera.findOne({
    name: req.body.name,
    _id: { $ne: id },
  })
    .collation({ locale: 'en' })
    .lean()
    .exec()

  if (duplicateCamera) throw new ErrorHandler('Duplicate name')

  let images
  if (req.files && req.files.length > 0) {
    images = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          public_id: file.filename,
        })
        return {
          public_id: result.public_id,
          url: result.url,
          originalname: file.originalname,
        }
      }),
    )
    await cloudinary.api.delete_resources(
      existingCamera.image.map((image) => image.public_id),
    )
  } else images = existingCamera.image || []

  const updatedCamera = await Camera.findByIdAndUpdate(
    id,
    {
      ...req.body,
      image: images,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .lean()
    .exec()

  if (!updatedCamera) throw new ErrorHandler(`Camera not found with ID: ${id}`)

  return updatedCamera
}

exports.deleteCameraData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid camera ID: ${id}`)

  const camera = await Camera.findOne({ _id: id })
  if (!camera) throw new ErrorHandler(`Camera not found with ID: ${id}`)

  const publicIds = camera.image.map((image) => image.public_id)

  await Promise.all([
    Camera.deleteOne({ _id: id }).lean().exec(),
    cloudinary.api.delete_resources(publicIds),
  ])

  return camera
}
