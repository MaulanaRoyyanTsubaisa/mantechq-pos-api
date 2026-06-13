import pg from 'pg';
const pool = new pg.Pool({ connectionString: 'postgresql://neondb_owner:npg_LGkPYct0U8uA@ep-wild-violet-aq56gcv8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', ssl: {rejectUnauthorized: false} });
const sql = `
create table if not exists public.m_pelanggan (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  name text not null,
  phone text,
  email text,
  address text,
  points numeric(14,2) default 0,
  created_at timestamptz not null default now()
);
`;
pool.query(sql).then(() => console.log('m_pelanggan created')).catch(console.error).finally(()=>pool.end());
