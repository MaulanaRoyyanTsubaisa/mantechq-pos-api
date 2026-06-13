import pg from 'pg';
const pool = new pg.Pool({ connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', ssl: {rejectUnauthorized: false} });
pool.query('alter table public.st_mast add column if not exists photo_url text;').then(() => console.log('photo_url added')).catch(console.error).finally(()=>pool.end());
