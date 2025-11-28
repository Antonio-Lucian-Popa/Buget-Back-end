const pool = require('../config/db');

// createIncome
exports.createIncome = async (req, res) => {
  const userId = req.user.id;
  const { amount, description, date, is_recurring = false } = req.body;

  if (!amount || !date) {
    return res
      .status(400)
      .json({ message: 'Amount și date sunt necesare.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO incomes (user_id, amount, description, date, is_recurring)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, amount, description, date, is_recurring`,
      [userId, amount, description || null, date, is_recurring]
    );

    const income = result.rows[0];
    income.amount = Number(income.amount); // <- AICI

    res.status(201).json(income);
  } catch (err) {
    console.error('Eroare createIncome:', err);
    res.status(500).json({ message: 'Eroare la adăugarea venitului.' });
  }
};

// getIncomes
exports.getIncomes = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );

    const incomes = result.rows.map((row) => ({
      ...row,
      amount: Number(row.amount), // <- AICI
    }));

    res.json({ incomes });
  } catch (err) {
    console.error('Eroare getIncomes:', err);
    res.status(500).json({ message: 'Eroare la listarea veniturilor.' });
  }
};

// deleteIncome
exports.deleteIncome = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM incomes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Venit inexistent sau nu aparține acestui user.' });
    }

    res.json({ message: 'Venit șters cu succes.' });
  } catch (err) {
    console.error('Eroare deleteIncome:', err);
    res.status(500).json({ message: 'Eroare la ștergerea venitului.' });
  }
};
