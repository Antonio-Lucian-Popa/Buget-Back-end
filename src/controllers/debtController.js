const pool = require('../config/db');

// createDebt
exports.createDebt = async (req, res) => {
  const userId = req.user.id;
  const { amount, name, due_date, is_recurring = false, category } = req.body;

  if (!amount || !name || !due_date) {
    return res
      .status(400)
      .json({ message: 'Lipsesc câmpuri obligatorii (amount, name, due_date).' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO debts (user_id, amount, name, due_date, is_recurring, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, amount, name, due_date, is_recurring, category, status`,
      [userId, amount, name, due_date, is_recurring, category || null]
    );

    const debt = result.rows[0];
    debt.amount = Number(debt.amount); // <- AICI

    res.status(201).json(debt);
  } catch (err) {
    console.error('Eroare createDebt:', err);
    res.status(500).json({ message: 'Eroare la adăugarea datoriei.' });
  }
};

// getDebts
exports.getDebts = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM debts WHERE user_id = $1 ORDER BY due_date ASC',
      [userId]
    );

    const debts = result.rows.map((row) => ({
      ...row,
      amount: Number(row.amount), // <- AICI
    }));

    res.json({ debts });
  } catch (err) {
    console.error('Eroare getDebts:', err);
    res.status(500).json({ message: 'Eroare la listarea datoriilor.' });
  }
};
