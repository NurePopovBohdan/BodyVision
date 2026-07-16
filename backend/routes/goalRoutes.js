const express = require('express');
const { body, param } = require('express-validator');

const {
  createGoal,
  deleteGoal,
  getActiveGoal,
  getGoals,
  updateGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const goalValidators = [
  body('desiredWeight').optional().isFloat({ min: 30, max: 350 }),
  body('desiredBodyFatPercentage').optional().isFloat({ min: 3, max: 70 }),
  body('desiredWaist').optional().isFloat({ min: 35, max: 200 }),
  body('desiredChest').optional().isFloat({ min: 40, max: 200 }),
  body('desiredHips').optional().isFloat({ min: 40, max: 220 }),
  body('targetDate').optional().isISO8601().toDate(),
  body('goalType').optional().isIn(['weight_loss', 'muscle_gain', 'maintenance']),
  body('isActive').optional().isBoolean()
];

const idValidator = [param('id').isMongoId().withMessage('Valid goal id is required')];

/**
 * @openapi
 * /goals:
 *   get:
 *     summary: Get all user goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, getGoals);

/**
 * @openapi
 * /goals/active:
 *   get:
 *     summary: Get active user goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 */
router.get('/active', protect, getActiveGoal);

/**
 * @openapi
 * /goals:
 *   post:
 *     summary: Create active fitness goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  protect,
  [
    body('targetDate').isISO8601().withMessage('Target date is required').toDate(),
    body('goalType').isIn(['weight_loss', 'muscle_gain', 'maintenance']).withMessage('Goal type is required'),
    ...goalValidators
  ],
  validateRequest,
  createGoal
);

router.put('/:id', protect, [...idValidator, ...goalValidators], validateRequest, updateGoal);
router.delete('/:id', protect, idValidator, validateRequest, deleteGoal);

module.exports = router;
