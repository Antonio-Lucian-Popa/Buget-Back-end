const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMonthlySummary, getNextMonthSummary } = require('../controllers/summaryController');

router.use(authMiddleware);

router.get('/current', getMonthlySummary);
router.get('/next', getNextMonthSummary);

module.exports = router;
