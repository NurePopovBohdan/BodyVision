const BodyMeasurement = require('../models/BodyMeasurement');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const getMeasurements = asyncHandler(async (req, res) => {
  const measurements = await BodyMeasurement.find({ user: req.user._id }).sort({ measuredAt: -1 });
  res.json({ measurements });
});

const getMeasurementById = asyncHandler(async (req, res) => {
  const measurement = await BodyMeasurement.findOne({ _id: req.params.id, user: req.user._id });

  if (!measurement) {
    res.status(404);
    throw new Error('Measurement not found');
  }

  res.json({ measurement });
});

const createMeasurement = asyncHandler(async (req, res) => {
  const measurement = await BodyMeasurement.create({
    ...req.body,
    user: req.user._id
  });

  // Keep user profile weight in sync with the newest measurement for quick profile display.
  await User.findByIdAndUpdate(req.user._id, { currentWeight: measurement.weight });

  res.status(201).json({ measurement });
});

const updateMeasurement = asyncHandler(async (req, res) => {
  const measurement = await BodyMeasurement.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!measurement) {
    res.status(404);
    throw new Error('Measurement not found');
  }

  res.json({ measurement });
});

const deleteMeasurement = asyncHandler(async (req, res) => {
  const measurement = await BodyMeasurement.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!measurement) {
    res.status(404);
    throw new Error('Measurement not found');
  }

  res.json({ message: 'Measurement deleted' });
});

module.exports = {
  createMeasurement,
  deleteMeasurement,
  getMeasurementById,
  getMeasurements,
  updateMeasurement
};
