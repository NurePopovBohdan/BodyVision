const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number, min: 1, max: 20, default: 3 },
    reps: { type: String, trim: true, default: '10-12' },
    notes: { type: String, trim: true, maxlength: 240 }
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    workoutType: {
      type: String,
      enum: ['strength', 'cardio', 'mobility', 'recovery'],
      default: 'strength'
    },
    completed: {
      type: Boolean,
      default: false
    },
    exercises: [exerciseSchema]
  },
  { timestamps: true }
);

workoutPlanSchema.index({ user: 1, dayOfWeek: 1 });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
