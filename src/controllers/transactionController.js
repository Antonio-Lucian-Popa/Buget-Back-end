const db = require('../config/db');

exports.addTransaction = (req, res) => {
    const userId = req.user.id;
    const { debt_id, amount, date, note } = req.body;

    if (!amount || !date) {
        return res.status(400).json({ message: "Amount și date sunt necesare." });
    }

    db.run(
        `INSERT INTO transactions (user_id, debt_id, amount, date, note)
     VALUES (?, ?, ?, ?, ?)`,
        [userId, debt_id || null, amount, date, note || null],
        function (err) {
            if (err) return res.status(500).json({ message: "Eroare la adăugarea tranzacției." });

            res.status(201).json({
                id: this.lastID,
                user_id: userId,
                debt_id,
                amount,
                date,
                note
            });
        }
    );
};

exports.getTransactions = (req, res) => {
    const userId = req.user.id;

    db.all(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Eroare la listarea tranzacțiilor." });
            res.json({ transactions: rows });
        }
    );
};
