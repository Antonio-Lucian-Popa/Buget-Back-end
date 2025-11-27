const db = require('../config/db');

exports.createIncome = (req, res) => {
    const userId = req.user.id;
    const { amount, description, date, is_recurring = 0 } = req.body;

    if (!amount || !date) {
        return res.status(400).json({ message: "Amount și date sunt necesare." });
    }

    db.run(
        `INSERT INTO incomes (user_id, amount, description, date, is_recurring)
     VALUES (?, ?, ?, ?, ?)`,
        [userId, amount, description || null, date, is_recurring ? 1 : 0],
        function (err) {
            if (err) return res.status(500).json({ message: "Eroare la adăugarea venitului." });

            res.status(201).json({
                id: this.lastID,
                user_id: userId,
                amount,
                description,
                date,
                is_recurring: !!is_recurring
            });
        }
    );
};

exports.getIncomes = (req, res) => {
    const userId = req.user.id;

    db.all(
        "SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC",
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Eroare la listarea veniturilor." });
            res.json({ incomes: rows });
        }
    );
};

exports.deleteIncome = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    db.run(
        "DELETE FROM incomes WHERE id = ? AND user_id = ?",
        [id, userId],
        function (err) {
            if (err) return res.status(500).json({ message: "Eroare la ștergere." });
            if (this.chchanges === 0) return res.status(404).json({ message: "Venit inexistent." });

            res.json({ message: "Venit șters." });
        }
    );
};
