const WorkoutPlan = require('../models/WorkoutPlan');
const asyncHandler = require('../utils/asyncHandler');

const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await WorkoutPlan.find({ user: req.user._id }).sort({ dayOfWeek: 1, createdAt: 1 });
  res.json({ workouts });
});

const createWorkout = asyncHandler(async (req, res) => {
  const workout = await WorkoutPlan.create({ ...req.body, user: req.user._id });
  res.status(201).json({ workout });
});

const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await WorkoutPlan.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  res.json({ workout });
});

const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await WorkoutPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  res.json({ message: 'Workout deleted' });
});

module.exports = { createWorkout, deleteWorkout, getWorkouts, updateWorkout };
