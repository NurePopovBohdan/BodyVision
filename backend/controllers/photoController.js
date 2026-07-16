const ProgressPhoto = require('../models/ProgressPhoto');
const asyncHandler = require('../utils/asyncHandler');

const getPhotos = asyncHandler(async (req, res) => {
  const photos = await ProgressPhoto.find({ user: req.user._id }).sort({ takenAt: -1 });
  res.json({ photos });
});

const createPhoto = asyncHandler(async (req, res) => {
  const { imageData, caption, takenAt } = req.body;

  if (!imageData?.startsWith('data:image/')) {
    res.status(400);
    throw new Error('Valid image data URL is required');
  }

  if (imageData.length > 2_500_000) {
    res.status(413);
    throw new Error('Image is too large. Please use an image under 2 MB.');
  }

  const photo = await ProgressPhoto.create({
    user: req.user._id,
    imageData,
    caption,
    takenAt
  });

  res.status(201).json({ photo });
});

const deletePhoto = asyncHandler(async (req, res) => {
  const photo = await ProgressPhoto.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!photo) {
    res.status(404);
    throw new Error('Photo not found');
  }

  res.json({ message: 'Photo deleted' });
});

module.exports = { createPhoto, deletePhoto, getPhotos };
