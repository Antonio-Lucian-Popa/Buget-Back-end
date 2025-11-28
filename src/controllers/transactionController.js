const pool = require('../config/db');

exports.addTransaction = async (req, res) => {
  const userId = req.user.id;
  const { debt_id, amount, date, note } = req.body;

  if (!amount || !date) {
    return res
      .status(400)
      .json({ message: 'Amount și date sunt necesare.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, debt_id, amount, date, note)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, debt_id, amount, date, note`,
      [userId, debt_id || null, amount, date, note || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Eroare addTransaction:', err);
    res.status(500).json({ message: 'Eroare la adăugarea tranzacției.' });
  }
};

exports.getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );

    const transactions = result.rows.map((row) => ({
      ...row,
      amount: Number(row.amount), // <- AICI
    }));

    res.json({ transactions });
  } catch (err) {
    console.error('Eroare getTransactions:', err);
    res.status(500).json({ message: 'Eroare la listarea tranzacțiilor.' });
  }
};

