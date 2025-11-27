const db = require('../config/db');
const dayjs = require('dayjs');

exports.getMonthlySummary = (req, res) => {
    const userId = req.user.id;

    const nowMonth = dayjs().format("YYYY-MM");

    db.all(
        "SELECT * FROM incomes WHERE user_id = ? AND date LIKE ?",
        [userId, `${nowMonth}%`],
        (err, incomes) => {
            if (err) return res.status(500).json({ message: "Eroare veniturile." });

            db.all(
                "SELECT * FROM debts WHERE user_id = ? AND due_date LIKE ?",
                [userId, `${nowMonth}%`],
                (err2, debts) => {
                    if (err2) return res.status(500).json({ message: "Eroare datoriile." });

                    const totalIncome = incomes.reduce((s, v) => s + v.amount, 0);
                    const totalDebts = debts.reduce((s, d) => s + d.amount, 0);

                    const remaining = totalIncome - totalDebts;

                    res.json({
                        month: nowMonth,
                        totalIncome,
                        totalDebts,
                        remaining,
                        incomes,
                        debts
                    });
                }
            );
        }
    );
};


exports.getNextMonthSummary = (req, res) => {
    const userId = req.user.id;
    const nextMonth = dayjs().add(1, 'month').format("YYYY-MM");

    db.all(
        "SELECT * FROM incomes WHERE user_id = ? AND (is_recurring = 1 OR date LIKE ?)",
        [userId, `${nextMonth}%`],
        (err, incomes) => {
            if (err) return res.status(500).json({ message: "Eroare veniturile luna viitoare." });

            db.all(
                "SELECT * FROM debts WHERE user_id = ? AND (is_recurring = 1 OR due_date LIKE ?)",
                [userId, `${nextMonth}%`],
                (err2, debts) => {
                    if (err2) return res.status(500).json({ message: "Eroare datoriile luna viitoare." });

                    const totalIncome = incomes.reduce((s, v) => s + v.amount, 0);
                    const totalDebts = debts.reduce((s, d) => s + d.amount, 0);

                    const remaining = totalIncome - totalDebts;

                    res.json({
                        month: nextMonth,
                        totalIncome,
                        totalDebts,
                        remaining,
                        incomes,
                        debts
                    });
                }
            );
        }
    );
};
