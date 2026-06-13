import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

function loadEnvFile(filename) {
  const fullPath = path.join(process.cwd(), filename)
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

const databaseUrl = process.env.DATABASE_URL || 'postgresql://pos_dev:pos_dev_123@localhost:5432/mantechq_pos';
const pool = new pg.Pool({
  connectionString: databaseUrl,
  ...(databaseUrl.includes('neon.tech') || databaseUrl.includes('render.com') || process.env.VERCEL 
    ? { ssl: { rejectUnauthorized: false } } 
    : {})
})

async function run() {
  const orgId = process.env.POS_DEFAULT_ORG_ID || 'f63d5959-6c12-4765-8d27-2990f7f3139f';
  const outletId = process.env.POS_DEFAULT_OUTLET_ID || 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e';
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.pos_product_categories (
        id uuid primary key default gen_random_uuid(),
        org_id uuid not null,
        outlet_id uuid not null,
        name text not null,
        sequence integer default 0,
        department text,
        is_active boolean default true,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );
    `);
    
    await pool.query(
      `insert into public.pos_product_categories (org_id, outlet_id, name, sequence) values 
      ($1, $2, 'Makanan', 1),
      ($1, $2, 'Minuman', 2),
      ($1, $2, 'Retail', 3)`,
      [orgId, outletId]
    );
    console.log('Categories inserted successfully.');
  } catch (err) {
    console.error('Error inserting categories:', err);
  } finally {
    pool.end();
  }
}

run();
