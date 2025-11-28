// src/config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('Lipsește DATABASE_URL în .env / Environment Variables!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necesar pentru Neon
});

// funcție care rulează la startup și creează tabelele dacă nu există
async function initDb() {
  try {
    // users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // incomes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS incomes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        is_recurring BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // debts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS debts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        name TEXT NOT NULL,
        due_date DATE NOT NULL,
        is_recurring BOOLEAN DEFAULT FALSE,
        category TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // transactions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        debt_id INTEGER REFERENCES debts(id) ON DELETE SET NULL,
        amount NUMERIC NOT NULL,
        date DATE NOT NULL,
        note TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Tabelele Postgres sunt gata ✅');
  } catch (err) {
    console.error('Eroare la initDb Postgres:', err);
  }
}

// pornim init-ul imediat
initDb();

module.exports = pool;
