import pg from 'pg';

async function testFullUpdate() {
  const pool = new pg.Pool({
    connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('select * from public.st_mast limit 1');
    if (res.rows.length === 0) {
      console.log('No products found');
      return;
    }
    const product = res.rows[0];

    const payload = {
      orgId: product.org_id,
      outletId: product.outlet_id,
      sku: product.sku,
      itemName: product.item_name,
      categoryName: product.category_name,
      sellPrice: Number(product.sell_price),
      qtyOnHand: Number(product.qty_on_hand),
      qtyMinimum: Number(product.qty_minimum),
      photoUrl: product.photo_url,
      createdBy: product.created_by
    };

    const updateRes = await fetch(`https://mantechq-pos-api-id83.vercel.app/api/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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

testFullUpdate();
