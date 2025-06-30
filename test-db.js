const pool = require('./config/db');

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Connected to DB! Result:', rows[0].result); // Should be 2
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
  }
})();
