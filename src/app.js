const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const debtRoutes = require('./routes/debtRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Rute
app.use('/api/auth', authRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/summary', summaryRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Buget API este online.' });
});

module.exports = app;
