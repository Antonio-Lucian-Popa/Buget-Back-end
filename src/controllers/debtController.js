// src/controllers/debtController.js
const pool = require('../config/db');

// creează o datorie nouă
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
    debt.amount = Number(debt.amount);

    res.status(201).json(debt);
  } catch (err) {
    console.error('Eroare createDebt:', err);
    res.status(500).json({ message: 'Eroare la adăugarea datoriei.' });
  }
};

// listează toate datoriile userului
exports.getDebts = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM debts WHERE user_id = $1 ORDER BY due_date ASC',
      [userId]
    );

    const debts = result.rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));

    res.json({ debts });
  } catch (err) {
    console.error('Eroare getDebts:', err);
    res.status(500).json({ message: 'Eroare la listarea datoriilor.' });
  }
};

// schimbă statusul unei datorii (pending / paid / overdue)
exports.updateDebtStatus = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body; // "pending" | "paid" | "overdue"

  try {
    const result = await pool.query(
      'UPDATE debts SET status = $1 WHERE id = $2 AND user_id = $3',
      [status, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Datorie nu a fost găsită.' });
    }

    res.json({ message: 'Status actualizat.' });
  } catch (err) {
    console.error('Eroare updateDebtStatus:', err);
    res.status(500).json({ message: 'Eroare la actualizare.' });
  }
};

// șterge o datorie
exports.deleteDebt = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM debts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Datorie nu a fost găsită.' });
    }

    res.json({ message: 'Datorie ștearsă.' });
  } catch (err) {
    console.error('Eroare deleteDebt:', err);
    res.status(500).json({ message: 'Eroare la ștergere.' });
  }
};
