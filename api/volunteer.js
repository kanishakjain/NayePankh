// api/volunteer.js
// POST endpoint: inserts a volunteer registration into the Neon database.

const { getPool } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, city, program, availability, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !city) {
      return res.status(400).json({ error: 'Name, email, phone and city are required.' });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO volunteers (name, email, phone, city, program, availability, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, email, phone, city, program || null, availability || null, message || null]
    );

    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Volunteer insert failed:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};
