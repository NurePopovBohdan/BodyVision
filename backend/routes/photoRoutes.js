const express = require('express');
const { body, param } = require('express-validator');

const { createPhoto, deletePhoto, getPhotos } = require('../controllers/photoController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', protect, getPhotos);

router.post(
  '/',
  protect,
  [
    body('imageData').isString().withMessage('Image is required'),
    body('caption').optional().trim().isLength({ max: 180 }),
    body('takenAt').optional().isISO8601().toDate()
  ],
  validateRequest,
  createPhoto
);

router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Valid photo id is required')],
  validateRequest,
  deletePhoto
);

module.exports = router;
