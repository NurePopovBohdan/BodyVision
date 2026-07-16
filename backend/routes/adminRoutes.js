const express = require('express');

const { getAdminSummary } = require('../controllers/adminController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, adminOnly, getAdminSummary);

module.exports = router;
