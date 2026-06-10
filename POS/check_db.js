import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://pos_dev:pos_dev_123@localhost:5432/mantechq_pos'
});

async function run() {
  const result = await pool.query('SELECT * FROM public.m_stran ORDER BY created_at DESC LIMIT 5;');
  console.log('m_stran:', result.rows);
  const result2 = await pool.query('SELECT * FROM public.m_tran_d ORDER BY created_at DESC LIMIT 5;');
  console.log('m_tran_d:', result2.rows);
  const result3 = await pool.query('SELECT * FROM public.st_mutation ORDER BY created_at DESC LIMIT 5;');
  console.log('st_mutation:', result3.rows);
  const result4 = await pool.query('SELECT sku, item_name, qty_on_hand FROM public.st_mast ORDER BY updated_at DESC LIMIT 5;');
  console.log('st_mast:', result4.rows);
  await pool.end();
}

run();
