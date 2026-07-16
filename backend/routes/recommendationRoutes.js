const express = require('express');

const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * /recommendations:
 *   get:
 *     summary: Get calculated recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, getRecommendations);

module.exports = router;
