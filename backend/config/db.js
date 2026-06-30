const { Pool } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jobportal'

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('render.com') || connectionString.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false
})

// Helper to convert ? to $1, $2, $3...
function convertPlaceholders(sql) {
  let index = 1
  return sql.replace(/\?/g, () => `$${index++}`)
}

async function query(sql, params = []) {
  const pgSql = convertPlaceholders(sql)
  return pool.query(pgSql, params)
}

const db = {
  prepare: (sql) => {
    return {
      get: async (...params) => {
        const args = params.length === 1 && Array.isArray(params[0]) ? params[0] : params
        const res = await query(sql, args)
        return res.rows[0] || null
      },
      all: async (...params) => {
        const args = params.length === 1 && Array.isArray(params[0]) ? params[0] : params
        const res = await query(sql, args)
        return res.rows
      },
      run: async (...params) => {
        const args = params.length === 1 && Array.isArray(params[0]) ? params[0] : params
        const res = await query(sql, args)
        return {
          lastInsertRowid: res.rows[0]?.id || null,
          changes: res.rowCount,
        }
      }
    }
  },
  exec: async (sql) => {
    return query(sql)
  },
  query,
  pool,
}

const initDb = async () => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('jobseeker','recruiter')),
          profile_image TEXT DEFAULT NULL,
          resume_url TEXT DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          company_logo TEXT,
          location TEXT NOT NULL,
          salary INTEGER,
          description TEXT,
          skills TEXT,
          experience TEXT,
          job_type TEXT,
          recruiter_id INTEGER NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (recruiter_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          job_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          status TEXT DEFAULT 'Applied',
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(job_id,user_id),
          FOREIGN KEY (job_id) REFERENCES jobs(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS saved_jobs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          job_id INTEGER NOT NULL,
          UNIQUE(user_id,job_id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (job_id) REFERENCES jobs(id)
      );
    `)

    await db.exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT NULL;`)
    await db.exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_text TEXT DEFAULT NULL;`)
    console.log('Database initialized successfully.')
  } catch (err) {
    console.error('Database initialization failed:', err)
  }
}

const initPromise = initDb()

db.initPromise = initPromise

module.exports = db