const BodyMeasurement = require('../models/BodyMeasurement');
const FitnessGoal = require('../models/FitnessGoal');
const asyncHandler = require('../utils/asyncHandler');
const { buildRecommendations } = require('../utils/calculations');

const getRecommendations = asyncHandler(async (req, res) => {
  const [currentMeasurement, goal] = await Promise.all([
    BodyMeasurement.findOne({ user: req.user._id }).sort({ measuredAt: -1 }),
    FitnessGoal.findOne({ user: req.user._id, isActive: true }).sort({ createdAt: -1 })
  ]);

  const recommendations = buildRecommendations({
    user: req.user,
    currentMeasurement,
    goal
  });

  res.json({ recommendations });
});

module.exports = { getRecommendations };
