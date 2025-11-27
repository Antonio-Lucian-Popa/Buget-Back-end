// incomeModel.js
// Structura pentru tabelul incomes (venituri)

const IncomeModel = {
    table: "incomes",

    schema: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT",
        user_id: "INTEGER NOT NULL",
        amount: "REAL NOT NULL",
        description: "TEXT",
        date: "TEXT NOT NULL",
        is_recurring: "INTEGER DEFAULT 0",
        created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP"
    },

    fields: [
        "id",
        "user_id",
        "amount",
        "description",
        "date",
        "is_recurring",
        "created_at"
    ]
};

module.exports = IncomeModel;
