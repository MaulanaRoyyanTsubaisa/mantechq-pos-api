import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const databaseUrl = 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    const files = [
      'postgres/migrations/001_initial_pos_core.sql',
      'postgres/migrations/002_phase2_inventory_crm.sql',
      'postgres/seeds/001_dev_dummy_data.sql'
    ];
    for (const file of files) {
      console.log(`Running ${file}...`);
      const sql = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
      await client.query(sql);
      console.log(`Done ${file}`);
    }
    console.log('All migrations completed!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
