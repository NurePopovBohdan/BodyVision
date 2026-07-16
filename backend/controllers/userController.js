const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeUser } = require('./authController');

const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'gender', 'age', 'height', 'currentWeight', 'activityLevel'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ user: sanitizeUser(user) });
});

module.exports = { getProfile, updateProfile };
