// transactionModel.js
// Structura pentru istoricul tranzacțiilor

const TransactionModel = {
    table: "transactions",

    schema: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT",
        user_id: "INTEGER NOT NULL",
        debt_id: "INTEGER",
        amount: "REAL NOT NULL",
        date: "TEXT NOT NULL",
        note: "TEXT",
        created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP"
    },

    fields: [
        "id",
        "user_id",
        "debt_id",
        "amount",
        "date",
        "note",
        "created_at"
    ]
};

module.exports = TransactionModel;
