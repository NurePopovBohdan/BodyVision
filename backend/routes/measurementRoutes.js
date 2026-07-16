const express = require('express');
const { body, param } = require('express-validator');

const {
  createMeasurement,
  deleteMeasurement,
  getMeasurementById,
  getMeasurements,
  updateMeasurement
} = require('../controllers/measurementController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const measurementValidators = [
  body('weight').optional().isFloat({ min: 30, max: 350 }),
  body('bodyFatPercentage').optional().isFloat({ min: 3, max: 70 }),
  body('chest').optional().isFloat({ min: 40, max: 200 }),
  body('waist').optional().isFloat({ min: 35, max: 200 }),
  body('hips').optional().isFloat({ min: 40, max: 220 }),
  body('shoulders').optional().isFloat({ min: 50, max: 220 }),
  body('arm').optional().isFloat({ min: 15, max: 80 }),
  body('thigh').optional().isFloat({ min: 25, max: 120 }),
  body('measuredAt').optional().isISO8601().toDate(),
  body('notes').optional().trim().isLength({ max: 500 })
];

const idValidator = [param('id').isMongoId().withMessage('Valid measurement id is required')];

/**
 * @openapi
 * /measurements:
 *   get:
 *     summary: Get all body measurements
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, getMeasurements);

/**
 * @openapi
 * /measurements:
 *   post:
 *     summary: Create body measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  protect,
  [
    body('weight').isFloat({ min: 30, max: 350 }).withMessage('Weight is required'),
    ...measurementValidators
  ],
  validateRequest,
  createMeasurement
);

router.get('/:id', protect, idValidator, validateRequest, getMeasurementById);
router.put('/:id', protect, [...idValidator, ...measurementValidators], validateRequest, updateMeasurement);
router.delete('/:id', protect, idValidator, validateRequest, deleteMeasurement);

module.exports = router;
