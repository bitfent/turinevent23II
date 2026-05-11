const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS landing_page_leads (
      id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      first_name      TEXT NOT NULL,
      last_name       TEXT NOT NULL,
      email           TEXT NOT NULL UNIQUE,
      company         TEXT NOT NULL UNIQUE,
      website         TEXT,
      role            TEXT,
      company_size    TEXT,
      monthly_volume  TEXT,
      use_case        TEXT,
      description     TEXT,
      created_at      TIMESTAMPTZ DEFAULT now()
    );
  `);
}

module.exports = { pool, initDb };
