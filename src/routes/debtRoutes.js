// src/routes/debtRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const debtController = require('../controllers/debtController');

router.use(authMiddleware);

// rute
router.post('/', debtController.createDebt);
router.get('/', debtController.getDebts);
router.patch('/:id/status', debtController.updateDebtStatus);
router.delete('/:id', debtController.deleteDebt);

module.exports = router;
