import express from 'express'
import cors from 'cors'
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

function loadEnvFile(filename) {
  const fullPath = path.join(rootDir, filename)
  if (!fs.existsSync(fullPath)) return

  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const clean = line.trim()
    if (!clean || clean.startsWith('#')) continue
    const separator = clean.indexOf('=')
    if (separator === -1) continue

    const key = clean.slice(0, separator).trim()
    const value = clean.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile('.env.postgres.local')
loadEnvFile('.env.local')

const app = express()
const port = Number(process.env.API_PORT || 3001)
const databaseUrl = process.env.DATABASE_URL || 'postgresql://pos_dev:pos_dev_123@localhost:5432/mantechq_pos'
const defaultOrgId = process.env.POS_DEFAULT_ORG_ID || 'f63d5959-6c12-4765-8d27-2990f7f3139f'
const defaultOutletId = process.env.POS_DEFAULT_OUTLET_ID || 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e'

const pool = new pg.Pool({ connectionString: databaseUrl })

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function toCamelProduct(body) {
  return {
    orgId: body.orgId || body.org_id,
    outletId: body.outletId || body.outlet_id,
    sku: body.sku,
    itemName: body.itemName || body.item_name,
    categoryName: body.categoryName || body.category_name,
    unit: body.unit,
    sellPrice: body.sellPrice ?? body.sell_price,
    qtyOnHand: body.qtyOnHand ?? body.qty_on_hand,
    qtyMinimum: body.qtyMinimum ?? body.qty_minimum ?? 0,
    createdBy: body.createdBy || body.created_by,
  }
}

function sendPgError(res, error) {
  const status = error.code === '23505' ? 409 : 500
  res.status(status).json({
    error: error.message || 'Database request failed',
    code: error.code,
  })
}

async function ensureDevMembership(client, user) {
  await client.query(
    `insert into public.pos_team_members (org_id, outlet_id, user_id, role, is_active)
     values ($1, $2, $3, 'owner', true)
     on conflict (org_id, user_id) do update set
       outlet_id = excluded.outlet_id,
       role = excluded.role,
       is_active = true`,
    [defaultOrgId, defaultOutletId, user.id],
  )
}

async function findOrCreateUser(client, email) {
  const cleanEmail = String(email || 'dev-owner@mantechq.local').trim().toLowerCase()
  const existing = await client.query(
    'select id, email, full_name, is_active from public.app_users where email = $1 limit 1',
    [cleanEmail],
  )
  if (existing.rows[0]) return existing.rows[0]

  const fullName = cleanEmail.split('@')[0].replace(/[._-]+/g, ' ')
  const created = await client.query(
    `insert into public.app_users (email, full_name, is_active)
     values ($1, initcap($2), true)
     returning id, email, full_name, is_active`,
    [cleanEmail, fullName || 'Dev User'],
  )
  return created.rows[0]
}

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('select now() as now')
    res.json({ ok: true, databaseTime: result.rows[0].now })
  } catch (error) {
    sendPgError(res, error)
  }
})

app.post('/api/auth/session', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('begin')
    const user = await findOrCreateUser(client, req.body.email)
    await ensureDevMembership(client, user)
    await client.query('commit')
    res.json({ user })
  } catch (error) {
    await client.query('rollback')
    sendPgError(res, error)
  } finally {
    client.release()
  }
})

app.get('/api/memberships', async (req, res) => {
  try {
    const params = []
    const userFilter = req.query.userId ? 'and user_id = $1' : ''
    if (req.query.userId) params.push(req.query.userId)
    const result = await pool.query(
      `select * from public.pos_team_members
       where is_active = true ${userFilter}
       order by created_at`,
      params,
    )
    res.json(result.rows)
  } catch (error) {
    sendPgError(res, error)
  }
})

app.get('/api/products', async (_req, res) => {
  try {
    const result = await pool.query('select * from public.st_mast order by item_name')
    res.json(result.rows)
  } catch (error) {
    sendPgError(res, error)
  }
})

app.post('/api/products', async (req, res) => {
  const product = toCamelProduct(req.body)
  try {
    const result = await pool.query(
      `insert into public.st_mast (
        org_id, outlet_id, sku, item_name, category_name, unit,
        sell_price, qty_on_hand, qty_minimum, is_active, created_by, photo_url
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10, $11)
      returning *`,
      [
        product.orgId,
        product.outletId,
        String(product.sku || '').trim(),
        String(product.itemName || '').trim(),
        product.categoryName || null,
        product.unit || 'Pcs',
        Number(product.sellPrice || 0),
        Number(product.qtyOnHand || 0),
        Number(product.qtyMinimum || 0),
        product.createdBy || null,
        product.photoUrl || null,
      ],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    sendPgError(res, error)
  }
})

app.get('/api/customers', async (_req, res) => {
  try {
    const result = await pool.query('select * from public.m_pelanggan order by name')
    res.json(result.rows)
  } catch (error) {
    sendPgError(res, error)
  }
})

app.post('/api/customers', async (req, res) => {
  const c = req.body
  try {
    const result = await pool.query(
      `insert into public.m_pelanggan (org_id, outlet_id, name, phone, email, address, points)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [c.orgId, c.outletId, c.name, c.phone, c.email, c.address, c.points || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    sendPgError(res, error)
  }
})

app.get('/api/sales', async (_req, res) => {
  try {
    const result = await pool.query(
      `select t.*, row_to_json(s.*) as m_stran
       from public.m_tran t
       join public.m_stran s on s.id = t.stran_id
       order by t.created_at desc`,
    )
    res.json(result.rows)
  } catch (error) {
    sendPgError(res, error)
  }
})

app.get('/api/stock', async (_req, res) => {
  try {
    const result = await pool.query('select * from public.st_mast order by item_name')
    res.json(result.rows)
  } catch (error) {
    sendPgError(res, error)
  }
})

app.get('/api/pos-data', async (req, res) => {
  const client = await pool.connect()
  try {
    const membershipParams = []
    const membershipUserFilter = req.query.userId ? 'and user_id = $1' : ''
    if (req.query.userId) membershipParams.push(req.query.userId)

    const [memberships, stockItems, sales, salesDetails, stockMutations, customers] = await Promise.all([
      client.query(
        `select * from public.pos_team_members
         where is_active = true ${membershipUserFilter}
         order by created_at`,
        membershipParams,
      ),
      client.query('select * from public.st_mast order by item_name'),
      client.query(
        `select t.*, row_to_json(s.*) as m_stran
         from public.m_tran t
         join public.m_stran s on s.id = t.stran_id
         order by t.created_at desc`,
      ),
      client.query(
        `select d.*, row_to_json(s.*) as m_stran
         from public.m_tran_d d
         join public.m_stran s on s.id = d.stran_id
         order by d.created_at desc`,
      ),
      client.query(
        `select sm.*, json_build_object(
          'item_name', st.item_name,
          'sku', st.sku,
          'unit', st.unit
        ) as st_mast
         from public.st_mutation sm
         join public.st_mast st on st.id = sm.st_mast_id
         order by sm.created_at desc`,
      ),
      client.query('select * from public.m_pelanggan order by name'),
    ])

    res.json({
      memberships: memberships.rows,
      stockItems: stockItems.rows,
      sales: sales.rows,
      salesDetails: salesDetails.rows,
      stockMutations: stockMutations.rows,
      customers: customers.rows,
    })
  } catch (error) {
    sendPgError(res, error)
  } finally {
    client.release()
  }
})

app.post('/api/sales', async (req, res) => {
  const body = req.body || {}
  try {
    const result = await pool.query(
      `select * from public.create_sales_transaction(
        $1::uuid,
        $2::uuid,
        $3::text,
        $4::numeric,
        $5::numeric,
        $6::numeric,
        $7::text,
        $8::jsonb,
        $9::uuid
      )`,
      [
        body.orgId || body.org_id,
        body.outletId || body.outlet_id,
        body.note || '',
        Number(body.discountTotal ?? body.discount_total ?? 0),
        Number(body.taxTotal ?? body.tax_total ?? 0),
        Number(body.paidTotal ?? body.paid_total ?? 0),
        body.paymentStatus || body.payment_status || 'paid',
        JSON.stringify(body.items || []),
        body.userId || body.user_id || null,
      ],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    sendPgError(res, error)
  }
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' })
})

app.listen(port, () => {
  console.log(`POS API listening on http://localhost:${port}`)
})
