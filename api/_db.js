// api/_db.js
// Shared Postgres connection pool for Neon, reused across serverless function invocations.

const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Neon requires SSL
    });
  }
  return pool;
}

module.exports = { getPool };
