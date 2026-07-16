const express = require('express');

const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get dashboard metrics, charts and recommendations
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, getDashboard);

module.exports = router;
