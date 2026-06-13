import pg from 'pg';
const pool = new pg.Pool({ connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', ssl: {rejectUnauthorized: false} });
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").then(r => console.log(r.rows.map(x=>x.table_name))).catch(console.error).finally(()=>pool.end());
