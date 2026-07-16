const mongoose = require('mongoose');

const progressPhotoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    imageData: {
      type: String,
      required: [true, 'Image data is required']
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 180
    },
    takenAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

progressPhotoSchema.index({ user: 1, takenAt: -1 });

module.exports = mongoose.model('ProgressPhoto', progressPhotoSchema);
