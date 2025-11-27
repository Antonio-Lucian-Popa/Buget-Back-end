const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addTransaction, getTransactions } = require('../controllers/transactionController');

router.use(authMiddleware);

router.post('/', addTransaction);
router.get('/', getTransactions);

module.exports = router;
