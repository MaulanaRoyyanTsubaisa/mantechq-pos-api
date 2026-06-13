import pg from 'pg';

async function softDeleteDb() {
  const pool = new pg.Pool({
    connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pool.query(`UPDATE public.st_mast SET is_active = false, sku = 'DELETED-' || id, item_name = 'Produk Dihapus' WHERE sku = '' OR sku IS NULL`);
    console.log('Cleaned up empty SKUs by soft-deleting');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

softDeleteDb();
