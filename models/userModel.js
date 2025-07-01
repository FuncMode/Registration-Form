const pool = require('../config/db');

// Insert new user
const createUser = async (name, email, hashedPassword) => {
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [name, email, hashedPassword]);
    return result.insertId;
};

// Find user by email
const findUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
  return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail
};
