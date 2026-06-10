import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new pg.Pool({
  connectionString: dbUrl,
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Connected to Neon!');
    
    console.log('Running 001_initial_pos_core.sql...');
    const sql1 = fs.readFileSync(path.join(__dirname, 'postgres/migrations/001_initial_pos_core.sql'), 'utf8');
    await client.query(sql1);
    
    console.log('Running 002_phase2_inventory_crm.sql...');
    const sql2 = fs.readFileSync(path.join(__dirname, 'postgres/migrations/002_phase2_inventory_crm.sql'), 'utf8');
    await client.query(sql2);
    
    console.log('Running 001_dev_dummy_data.sql...');
    const sql3 = fs.readFileSync(path.join(__dirname, 'postgres/seeds/001_dev_dummy_data.sql'), 'utf8');
    await client.query(sql3);

    console.log('Database successfully initialized on Neon!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
