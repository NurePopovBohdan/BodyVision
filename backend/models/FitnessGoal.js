const mongoose = require('mongoose');

const fitnessGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    desiredWeight: {
      type: Number,
      min: 30,
      max: 350
    },
    desiredBodyFatPercentage: {
      type: Number,
      min: 3,
      max: 70
    },
    desiredWaist: {
      type: Number,
      min: 35,
      max: 200
    },
    desiredChest: {
      type: Number,
      min: 40,
      max: 200
    },
    desiredHips: {
      type: Number,
      min: 40,
      max: 220
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required']
    },
    goalType: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance'],
      required: [true, 'Goal type is required']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

fitnessGoalSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('FitnessGoal', fitnessGoalSchema);
