import pg from 'pg';

async function checkIds() {
  const pool = new pg.Pool({
    connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query(`SELECT id, sku, item_name FROM public.st_mast`);
    console.log(res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkIds();
