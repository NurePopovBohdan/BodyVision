const express = require('express');
const { body } = require('express-validator');

const { getMe, login, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must contain at least 2 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters'),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('age').optional().isInt({ min: 12, max: 100 }),
    body('height').optional().isFloat({ min: 100, max: 250 }),
    body('currentWeight').optional().isFloat({ min: 30, max: 350 }),
    body('activityLevel').optional().isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
  ],
  validateRequest,
  register
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Auth]
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, getMe);

module.exports = router;
