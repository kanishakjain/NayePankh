// api/contact.js
// POST endpoint: inserts a contact message into the Neon database.

const { getPool } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, subject, message]
    );

    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Contact insert failed:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};
