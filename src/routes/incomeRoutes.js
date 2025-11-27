const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createIncome,
    getIncomes,
    deleteIncome
} = require('../controllers/incomeController');

router.use(authMiddleware);

router.post('/', createIncome);
router.get('/', getIncomes);
router.delete('/:id', deleteIncome);

module.exports = router;
