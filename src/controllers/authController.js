const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db');

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

exports.register = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: 'Email și parolă (minim 6 caractere) necesare.' });
    }

    // verificăm dacă există deja
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Eroare server.' });
        if (user) return res.status(400).json({ message: 'Email deja folosit.' });

        const hashed = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashed],
            function (err2) {
                if (err2) return res.status(500).json({ message: 'Eroare la creare user.' });

                const token = generateToken(this.lastID);
                res.status(201).json({
                    token,
                    user: { id: this.lastID, email },
                });
            }
        );
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Eroare server.' });
        if (!user) return res.status(400).json({ message: 'Email sau parolă greșite.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Email sau parolă greșite.' });

        const token = generateToken(user.id);
        res.json({
            token,
            user: { id: user.id, email: user.email },
        });
    });
};

exports.me = (req, res) => {
    const userId = req.user.id;
    db.get('SELECT id, email, created_at FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) return res.status(500).json({ message: 'Eroare server.' });
        if (!user) return res.status(404).json({ message: 'User inexistent.' });

        res.json({ user });
    });
};
