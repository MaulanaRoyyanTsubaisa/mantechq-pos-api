import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()

function loadEnvFile(filename) {
  const fullPath = path.join(rootDir, filename)
  if (!fs.existsSync(fullPath)) return

  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const clean = line.trim()
    if (!clean || clean.startsWith('#')) continue
    const separator = clean.indexOf('=')
    if (separator === -1) continue

    const key = clean.slice(0, separator).trim()
    const value = clean.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile('.env.postgres.local')
loadEnvFile('.env.local')

const databaseUrl = process.env.DATABASE_URL || 'postgresql://pos_dev:pos_dev_123@localhost:5432/mantechq_pos'

async function run() {
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ...(databaseUrl.includes('neon.tech') || databaseUrl.includes('render.com') || process.env.VERCEL 
      ? { ssl: { rejectUnauthorized: false } } 
      : {})
  })

  try {
    console.log('Connecting to', databaseUrl.split('@')[1])
    const sql = fs.readFileSync(path.join(process.cwd(), 'postgres/migrations/003_note_categories.sql'), 'utf8')
    await pool.query(sql)
    console.log('Migration successful!')
  } catch (err) {
    console.error('Migration failed:', err)
  } finally {
    await pool.end()
  }
}

run()
