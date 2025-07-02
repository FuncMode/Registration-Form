const pool = require('../config/db');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getAllUsers };
    