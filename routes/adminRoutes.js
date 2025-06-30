const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Make sure this points to your DB connection

// ✅ Check Admin Password
router.post('/check-admin-password', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ message: 'Invalid admin password' });
  }
});

// ✅ Fetch All Users
router.get('/admin/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Delete User
router.delete('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Update User Name + Role
router.put('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ message: 'Name and role are required.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, role = ? WHERE id = ?',
      [name, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
