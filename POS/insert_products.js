import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://pos_dev:pos_dev_123@localhost:5432/mantechq_pos'
});

async function run() {
  const orgId = 'f63d5959-6c12-4765-8d27-2990f7f3139f';
  const outletId = 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e';
  const userId = '6804bcfd-e51f-4cbc-87cb-47d7649bbc34';

  const products = [
    {
      sku: 'FOOD-001',
      item_name: 'Gourmet Beef Burger',
      category_name: 'Makanan',
      sell_price: 45000,
      qty_on_hand: 50,
      photo_url: 'http://localhost:5173/uploads/burger.png'
    },
    {
      sku: 'FOOD-002',
      item_name: 'Crispy French Fries',
      category_name: 'Makanan',
      sell_price: 25000,
      qty_on_hand: 100,
      photo_url: 'http://localhost:5173/uploads/fries.png'
    },
    {
      sku: 'DRINK-001',
      item_name: 'Ice Cold Cola',
      category_name: 'Minuman',
      sell_price: 15000,
      qty_on_hand: 200,
      photo_url: 'http://localhost:5173/uploads/cola.png'
    },
    {
      sku: 'DRINK-002',
      item_name: 'Hot Cafe Latte',
      category_name: 'Minuman',
      sell_price: 35000,
      qty_on_hand: 80,
      photo_url: 'http://localhost:5173/uploads/latte.png'
    }
  ];

  for (const p of products) {
    try {
      await pool.query(`
        INSERT INTO public.st_mast (org_id, outlet_id, sku, item_name, category_name, sell_price, qty_on_hand, photo_url, created_by, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        ON CONFLICT (org_id, outlet_id, sku) DO UPDATE SET
          item_name = EXCLUDED.item_name,
          photo_url = EXCLUDED.photo_url,
          sell_price = EXCLUDED.sell_price,
          qty_on_hand = EXCLUDED.qty_on_hand
      `, [orgId, outletId, p.sku, p.item_name, p.category_name, p.sell_price, p.qty_on_hand, p.photo_url, userId]);
      console.log('Inserted', p.item_name);
    } catch (e) {
      console.error('Error inserting', p.item_name, e);
    }
  }

  await pool.end();
}

run();
