const db = require('../config/db');

exports.createDebt = (req, res) => {
    const userId = req.user.id;
    const { amount, name, due_date, is_recurring = 0, category } = req.body;

    if (!amount || !name || !due_date) {
        return res.status(400).json({ message: 'Lipsesc câmpuri obligatorii.' });
    }

    db.run(
        `INSERT INTO debts (user_id, amount, name, due_date, is_recurring, category)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, amount, name, due_date, is_recurring ? 1 : 0, category || null],
        function (err) {
            if (err) return res.status(500).json({ message: 'Eroare la adăugarea datoriei.' });

            res.status(201).json({
                id: this.lastID,
                user_id: userId,
                amount,
                name,
                due_date,
                is_recurring: !!is_recurring,
                category: category || null,
                status: 'pending',
            });
        }
    );
};

exports.getDebts = (req, res) => {
    const userId = req.user.id;

    db.all(
        'SELECT * FROM debts WHERE user_id = ? ORDER BY due_date ASC',
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ message: 'Eroare la listarea datoriilor.' });
            res.json({ debts: rows });
        }
    );
};

exports.updateDebtStatus = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body; // pending / paid / overdue

    db.run(
        'UPDATE debts SET status = ? WHERE id = ? AND user_id = ?',
        [status, id, userId],
        function (err) {
            if (err) return res.status(500).json({ message: 'Eroare la actualizare.' });
            if (this.changes === 0) return res.status(404).json({ message: 'Datorie nu a fost găsită.' });

            res.json({ message: 'Status actualizat.' });
        }
    );
};

exports.deleteDebt = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    db.run(
        'DELETE FROM debts WHERE id = ? AND user_id = ?',
        [id, userId],
        function (err) {
            if (err) return res.status(500).json({ message: 'Eroare la ștergere.' });
            if (this.changes === 0) return res.status(404).json({ message: 'Datorie nu a fost găsită.' });

            res.json({ message: 'Datorie ștearsă.' });
        }
    );
};
