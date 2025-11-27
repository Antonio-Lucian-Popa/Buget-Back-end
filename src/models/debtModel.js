// debtModel.js
// Structura pentru tabelul debt (datorii)

const DebtModel = {
    table: "debts",

    schema: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT",
        user_id: "INTEGER NOT NULL",
        amount: "REAL NOT NULL",
        name: "TEXT NOT NULL",
        due_date: "TEXT NOT NULL",
        is_recurring: "INTEGER DEFAULT 0",
        category: "TEXT",
        status: "TEXT DEFAULT 'pending'",
        created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP"
    },

    fields: [
        "id",
        "user_id",
        "amount",
        "name",
        "due_date",
        "is_recurring",
        "category",
        "status",
        "created_at"
    ]
};

module.exports = DebtModel;
