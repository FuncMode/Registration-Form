// 📁 controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// gmail sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await pool.query('UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?', [
      token, expires, email
    ]);

    const resetUrl = `${process.env.BASE_URL}/reset-password.html?token=${token}`;
    await transporter.sendMail({
      from: `"Support" <Registration Form>`,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    });

    res.json({ message: 'Reset link sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and password required' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()', [token]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?', [hashed, user.id]);

    res.json({ message: 'Password updated. You may now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser.length > 0) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [countResult] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const role = countResult[0].total === 0 ? 'admin' : 'user';

    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), hashedPassword, role]);

    res.status(201).json({ message: 'User registered', userId: result.insertId, role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
