const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createDebt, getDebts, updateDebtStatus, deleteDebt } = require('../controllers/debtController');

router.use(authMiddleware);

router.post('/', createDebt);
router.get('/', getDebts);
router.patch('/:id/status', updateDebtStatus);
router.delete('/:id', deleteDebt);

module.exports = router;
