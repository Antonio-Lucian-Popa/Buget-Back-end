const pool = require('../config/db');
const dayjs = require('dayjs');

exports.getMonthlySummary = async (req, res) => {
  const userId = req.user.id;
  const nowMonth = dayjs().format('YYYY-MM'); // ex: 2025-02

  try {
    const incomesRes = await pool.query(
      "SELECT * FROM incomes WHERE user_id = $1 AND to_char(date, 'YYYY-MM') = $2",
      [userId, nowMonth]
    );

    const debtsRes = await pool.query(
      "SELECT * FROM debts WHERE user_id = $1 AND to_char(due_date, 'YYYY-MM') = $2",
      [userId, nowMonth]
    );

    // 🔴 AICI facem transformarea
    const incomes = incomesRes.rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));

    const debts = debtsRes.rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));

    const totalIncome = incomes.reduce((s, v) => s + v.amount, 0);
    const totalDebts = debts.reduce((s, d) => s + d.amount, 0);
    const remaining = totalIncome - totalDebts;

    res.json({
      month: nowMonth,
      totalIncome,
      totalDebts,
      remaining,
      incomes,
      debts,
    });
  } catch (err) {
    console.error('Eroare getMonthlySummary:', err);
    res.status(500).json({ message: 'Eroare la summary curent.' });
  }
};

exports.getNextMonthSummary = async (req, res) => {
  const userId = req.user.id;
  const nextMonth = dayjs().add(1, 'month').format('YYYY-MM');

  try {
    const incomesRes = await pool.query(
      `SELECT * FROM incomes
       WHERE user_id = $1
       AND (is_recurring = TRUE OR to_char(date, 'YYYY-MM') = $2)`,
      [userId, nextMonth]
    );

    const debtsRes = await pool.query(
      `SELECT * FROM debts
       WHERE user_id = $1
       AND (is_recurring = TRUE OR to_char(due_date, 'YYYY-MM') = $2)`,
      [userId, nextMonth]
    );

    // 🔴 ȘI AICI la fel
    const incomes = incomesRes.rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));

    const debts = debtsRes.rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));

    const totalIncome = incomes.reduce((s, v) => s + v.amount, 0);
    const totalDebts = debts.reduce((s, d) => s + d.amount, 0);
    const remaining = totalIncome - totalDebts;

    res.json({
      month: nextMonth,
      totalIncome,
      totalDebts,
      remaining,
      incomes,
      debts,
    });
  } catch (err) {
    console.error('Eroare getNextMonthSummary:', err);
    res.status(500).json({ message: 'Eroare la summary luna viitoare.' });
  }
};
