const mongoose = require('mongoose');

const bodyMeasurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: 30,
      max: 350
    },
    bodyFatPercentage: {
      type: Number,
      min: 3,
      max: 70
    },
    chest: {
      type: Number,
      min: 40,
      max: 200
    },
    waist: {
      type: Number,
      min: 35,
      max: 200
    },
    hips: {
      type: Number,
      min: 40,
      max: 220
    },
    shoulders: {
      type: Number,
      min: 50,
      max: 220
    },
    arm: {
      type: Number,
      min: 15,
      max: 80
    },
    thigh: {
      type: Number,
      min: 25,
      max: 120
    },
    measuredAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

bodyMeasurementSchema.index({ user: 1, measuredAt: -1 });

module.exports = mongoose.model('BodyMeasurement', bodyMeasurementSchema);
