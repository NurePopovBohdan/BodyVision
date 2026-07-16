const FitnessGoal = require('../models/FitnessGoal');
const asyncHandler = require('../utils/asyncHandler');

const getGoals = asyncHandler(async (req, res) => {
  const goals = await FitnessGoal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ goals });
});

const getActiveGoal = asyncHandler(async (req, res) => {
  const goal = await FitnessGoal.findOne({ user: req.user._id, isActive: true }).sort({ createdAt: -1 });
  res.json({ goal });
});

const createGoal = asyncHandler(async (req, res) => {
  await FitnessGoal.updateMany({ user: req.user._id, isActive: true }, { isActive: false });

  const goal = await FitnessGoal.create({
    ...req.body,
    user: req.user._id,
    isActive: true
  });

  res.status(201).json({ goal });
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await FitnessGoal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  if (goal.isActive) {
    await FitnessGoal.updateMany(
      { user: req.user._id, _id: { $ne: goal._id } },
      { isActive: false }
    );
  }

  res.json({ goal });
});

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await FitnessGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  res.json({ message: 'Goal deleted' });
});

module.exports = {
  createGoal,
  deleteGoal,
  getActiveGoal,
  getGoals,
  updateGoal
};
