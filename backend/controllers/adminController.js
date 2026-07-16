const BodyMeasurement = require('../models/BodyMeasurement');
const FitnessGoal = require('../models/FitnessGoal');
const ProgressPhoto = require('../models/ProgressPhoto');
const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const asyncHandler = require('../utils/asyncHandler');

const getAdminSummary = asyncHandler(async (req, res) => {
  const [users, measurements, goals, photos, workouts] = await Promise.all([
    User.countDocuments(),
    BodyMeasurement.countDocuments(),
    FitnessGoal.countDocuments(),
    ProgressPhoto.countDocuments(),
    WorkoutPlan.countDocuments()
  ]);

  const latestUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .select('name email role activityLevel createdAt');

  res.json({
    summary: { users, measurements, goals, photos, workouts },
    latestUsers
  });
});

module.exports = { getAdminSummary };
