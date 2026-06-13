import pg from 'pg';

async function testUpdate() {
  const pool = new pg.Pool({
    connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('select id, org_id from public.st_mast limit 1');
    if (res.rows.length === 0) {
      console.log('No products found');
      return;
    }
    const product = res.rows[0];
    console.log('Found product:', product.id);

    const updateRes = await fetch(`https://mantechq-pos-api-id83.vercel.app/api/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orgId: product.org_id,
        photoUrl: 'data:image/gif;base64,testdata'
      })
    });
    
    console.log('Update Status:', updateRes.status);
    const text = await updateRes.text();
    console.log('Update Response:', text);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

testUpdate();
