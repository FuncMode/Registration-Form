const express = require('express');
const router = express.Router();
const pool = require('../config/db');
require('dotenv').config();


// Check session
router.get('/check-session', (req, res) => {
  console.log('Session:', req.session.user);
  if (!req.session.user) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, role: req.session.user.role });
});

// Admin password check
router.post('/check-admin-password', (req, res) => {
  const { password } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'You must log in first' });
  }

  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Incorrect admin password' });
  }

  // Success
  return res.json({ success: true });
});

// Fetch all users (for admin dashboard)
router.get('/admin/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user
router.delete('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user
router.put('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ message: 'Missing name or role' });
  }

  try {
    const [result] = await pool.query('UPDATE users SET name = ?, role = ? WHERE id = ?', [name, role, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
