const express = require('express');
const { body } = require('express-validator');

const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', protect, getProfile);

/**
 * @openapi
 * /users/profile:
 *   put:
 *     summary: Update profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('age').optional().isInt({ min: 12, max: 100 }),
    body('height').optional().isFloat({ min: 100, max: 250 }),
    body('currentWeight').optional().isFloat({ min: 30, max: 350 }),
    body('activityLevel').optional().isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
  ],
  validateRequest,
  updateProfile
);

module.exports = router;
