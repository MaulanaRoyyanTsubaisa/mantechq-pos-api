import pg from 'pg';

async function checkMemberships() {
  const pool = new pg.Pool({
    connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const mems = await pool.query('SELECT * FROM public.pos_team_members');
    console.log('Memberships:', mems.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkMemberships();
