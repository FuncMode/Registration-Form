const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');

// register
router.post('/register', authController.register);

// ✅ LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// forget password
router.post('/forgot-password', authController.forgotPassword);

// resetpassword 
router.post('/reset-password', authController.resetPassword);

// ✅ LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
