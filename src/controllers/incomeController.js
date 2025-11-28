const pool = require('../config/db');

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

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Eroare createIncome:', err);
    res.status(500).json({ message: 'Eroare la adăugarea venitului.' });
  }
};

exports.getIncomes = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );

    res.json({ incomes: result.rows });
  } catch (err) {
    console.error('Eroare getIncomes:', err);
    res.status(500).json({ message: 'Eroare la listarea veniturilor.' });
  }
};

exports.deleteIncome = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM incomes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Venit inexistent.' });
    }

    res.json({ message: 'Venit șters.' });
  } catch (err) {
    console.error('Eroare deleteIncome:', err);
    res.status(500).json({ message: 'Eroare la ștergere.' });
  }
};
