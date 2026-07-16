const express = require('express');
const { body, param } = require('express-validator');

const {
  createWorkout,
  deleteWorkout,
  getWorkouts,
  updateWorkout
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const validators = [
  body('title').optional().trim().isLength({ min: 2, max: 120 }),
  body('dayOfWeek').optional().isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  body('workoutType').optional().isIn(['strength', 'cardio', 'mobility', 'recovery']),
  body('completed').optional().isBoolean(),
  body('exercises').optional().isArray({ max: 12 })
];

router.get('/', protect, getWorkouts);

router.post(
  '/',
  protect,
  [
    body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Workout title is required'),
    body('dayOfWeek').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    ...validators
  ],
  validateRequest,
  createWorkout
);

router.put(
  '/:id',
  protect,
  [param('id').isMongoId(), ...validators],
  validateRequest,
  updateWorkout
);

router.delete('/:id', protect, [param('id').isMongoId()], validateRequest, deleteWorkout);

module.exports = router;
