const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../config/db');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Email și parolă (minim 6 caractere) necesare.' });
  }

  try {
    // verificăm dacă user-ul există deja
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email deja folosit.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error('Eroare register:', err);
    res.status(500).json({ message: 'Eroare server.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Email sau parolă greșite.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email sau parolă greșite.' });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error('Eroare login:', err);
    res.status(500).json({ message: 'Eroare server.' });
  }
};

exports.me = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: 'User inexistent.' });

    res.json({ user });
  } catch (err) {
    console.error('Eroare me:', err);
    res.status(500).json({ message: 'Eroare server.' });
  }
};
