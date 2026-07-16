const BodyMeasurement = require('../models/BodyMeasurement');
const FitnessGoal = require('../models/FitnessGoal');
const asyncHandler = require('../utils/asyncHandler');
const {
  buildRecommendations,
  calculateDifferences,
  calculateProgress
} = require('../utils/calculations');

const getDashboard = asyncHandler(async (req, res) => {
  const [measurements, goal] = await Promise.all([
    BodyMeasurement.find({ user: req.user._id }).sort({ measuredAt: 1 }),
    FitnessGoal.findOne({ user: req.user._id, isActive: true }).sort({ createdAt: -1 })
  ]);

  const firstMeasurement = measurements[0] || null;
  const currentMeasurement = measurements[measurements.length - 1] || null;
  const current = currentMeasurement || { weight: req.user.currentWeight };

  const differences = goal && currentMeasurement
    ? calculateDifferences(currentMeasurement, goal)
    : null;

  const progress = goal && firstMeasurement && currentMeasurement
    ? calculateProgress(firstMeasurement, currentMeasurement, goal)
    : null;

  const chartSeries = measurements.map((measurement) => ({
    id: measurement._id,
    date: measurement.measuredAt,
    weight: measurement.weight,
    bodyFatPercentage: measurement.bodyFatPercentage,
    waist: measurement.waist
  }));

  res.json({
    user: req.user,
    currentMeasurement,
    activeGoal: goal,
    differences,
    progress,
    chartSeries,
    recommendations: buildRecommendations({
      user: req.user,
      currentMeasurement: current,
      goal
    })
  });
});

module.exports = { getDashboard };
