// userModel.js
// Structura pentru tabelul users

const UserModel = {
    table: "users",

    schema: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT",
        email: "TEXT UNIQUE NOT NULL",
        password: "TEXT NOT NULL",
        created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP"
    },

    fields: ["id", "email", "password", "created_at"]
};

module.exports = UserModel;
