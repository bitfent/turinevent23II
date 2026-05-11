const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDb() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_applications (
      id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

      first_name               TEXT NOT NULL,
      last_name                TEXT NOT NULL,
      email                    TEXT NOT NULL,
      phone                    TEXT,
      company                  TEXT NOT NULL,
      website                  TEXT,
      role                     TEXT NOT NULL,
      company_size             TEXT,
      industry                 TEXT,
      business_challenge       TEXT,
      private_preview_interest BOOLEAN NOT NULL DEFAULT FALSE,
      vip_skybox_interest      BOOLEAN NOT NULL DEFAULT FALSE,
      description              TEXT,
      consent                  BOOLEAN NOT NULL DEFAULT FALSE,

      status                   TEXT NOT NULL DEFAULT 'new',
      source                   TEXT NOT NULL DEFAULT 'torino_event_landing_page',
      user_agent               TEXT,
      ip_address               TEXT
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS event_applications_created_at_idx
      ON event_applications (created_at DESC);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS event_applications_email_idx
      ON event_applications (lower(email));
  `);
}

module.exports = { pool, initDb };
