import express from 'express'
import cors from 'cors'
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'

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

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ...(databaseUrl.includes('neon.tech') || databaseUrl.includes('render.com') || process.env.VERCEL 
    ? { ssl: { rejectUnauthorized: false } } 
    : {})
})

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Create uploads directory
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads')
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
} catch (err) {
  console.error('Failed to create upload dir:', err)
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '_')}`)
})
const upload = multer({ storage })

app.use('/uploads', express.static(uploadDir))

app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ url: photoUrl })
})

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

async function initDb() {
  let client
  try {
    client = await pool.connect()
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.pos_shifts (
        id uuid primary key default gen_random_uuid(),
        org_id uuid not null,
        outlet_id uuid not null,
        user_id uuid not null,
        cashier_name text,
        start_time timestamptz not null default now(),
        end_time timestamptz,
        opening_amount numeric(14,2) default 0,
        closing_amount numeric(14,2) default 0,
        expected_amount numeric(14,2) default 0,
        status text default 'open',
        created_at timestamptz default now()
      );
    `)
    console.log('Database tables verified.')
  } catch (err) {
    console.error('Failed to init DB:', err)
  } finally {
    if (client) client.release()
  }
}

initDb()

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

app.put('/api/products/:id', async (req, res) => {
  const product = toCamelProduct(req.body)
  try {
    const result = await pool.query(
      `update public.st_mast set
        sku = $1, item_name = $2, category_name = $3, unit = $4,
        sell_price = $5, qty_on_hand = $6, qty_minimum = $7, is_active = $8, photo_url = $9, updated_at = now()
      where id = $10 and org_id = $11
      returning *`,
      [
        String(product.sku || '').trim(),
        String(product.itemName || '').trim(),
        product.categoryName || null,
        product.unit || 'Pcs',
        Number(product.sellPrice || 0),
        Number(product.qtyOnHand || 0),
        Number(product.qtyMinimum || 0),
        req.body.is_active !== false,
        product.photoUrl || null,
        req.params.id,
        product.orgId
      ]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (error) {
    sendPgError(res, error)
  }
})

app.delete('/api/products/:id', async (req, res) => {
  const orgId = req.query.orgId
  try {
    const result = await pool.query(`delete from public.st_mast where id = $1 and org_id = $2 returning id`, [req.params.id, orgId])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch (error) {
    // Soft delete if foreign key violation
    if (error.code === '23503') {
      await pool.query(`update public.st_mast set is_active = false where id = $1 and org_id = $2`, [req.params.id, orgId])
      return res.json({ success: true, softDeleted: true })
    }
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

    const [memberships, stockItems, sales, salesDetails, stockMutations, customers, shifts] = await Promise.all([
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
      client.query(
        `select * from public.pos_shifts
         ${req.query.userId ? 'where user_id = $1' : ''}
         order by created_at desc`,
        req.query.userId ? [req.query.userId] : []
      ).catch(() => ({ rows: [] }))
    ])

    res.json({
      memberships: memberships.rows,
      stockItems: stockItems.rows,
      sales: sales.rows,
      salesDetails: salesDetails.rows,
      stockMutations: stockMutations.rows,
      customers: customers.rows,
      shifts: shifts.rows,
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

app.get('/api/shifts/current', async (req, res) => {
  try {
    const { orgId, outletId, userId } = req.query
    if (!orgId || !outletId || !userId) return res.status(400).json({ error: 'Missing parameters' })
    const result = await pool.query(
      `select * from public.pos_shifts where org_id = $1 and outlet_id = $2 and user_id = $3 and status = 'open' order by created_at desc limit 1`,
      [orgId, outletId, userId]
    )
    res.json(result.rows[0] || null)
  } catch (error) {
    sendPgError(res, error)
  }
})

app.post('/api/shifts', async (req, res) => {
  const { orgId, outletId, userId, cashierName, action, openingAmount, closingAmount, expectedAmount } = req.body
  try {
    if (action === 'open') {
      const result = await pool.query(
        `insert into public.pos_shifts (org_id, outlet_id, user_id, cashier_name, opening_amount, status)
         values ($1, $2, $3, $4, $5, 'open') returning *`,
        [orgId, outletId, userId, cashierName, Number(openingAmount || 0)]
      )
      res.json(result.rows[0])
    } else if (action === 'close') {
      const result = await pool.query(
        `update public.pos_shifts set closing_amount = $1, expected_amount = $2, end_time = now(), status = 'closed'
         where org_id = $3 and outlet_id = $4 and user_id = $5 and status = 'open'
         returning *`,
        [Number(closingAmount || 0), Number(expectedAmount || 0), orgId, outletId, userId]
      )
      res.json(result.rows[0] || null)
    } else {
      res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    sendPgError(res, error)
  }
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' })
})

// ---------------------------------------------------------------------
// PHASE 2 & 3: INVENTORY, CRM, ADVANCED SALES ENDPOINTS
// ---------------------------------------------------------------------

// Suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const { orgId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(`SELECT * FROM public.suppliers WHERE org_id = $1 ORDER BY name ASC`, [orgId])
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/suppliers', async (req, res) => {
  try {
    const { orgId, name, contactName, phone, email, address } = req.body
    const result = await pool.query(
      `INSERT INTO public.suppliers (org_id, name, contact_name, phone, email, address)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orgId, name, contactName, phone, email, address]
    )
    res.status(201).json(result.rows[0])
  } catch (error) { sendPgError(res, error) }
})

// Purchase Orders
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const { orgId, outletId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(
      `SELECT po.*, s.name as supplier_name 
       FROM public.purchase_orders po
       LEFT JOIN public.suppliers s ON s.id = po.supplier_id
       WHERE po.org_id = $1 ${outletId ? 'AND po.outlet_id = $2' : ''}
       ORDER BY po.created_at DESC`,
      outletId ? [orgId, outletId] : [orgId]
    )
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/purchase-orders', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { orgId, outletId, supplierId, expectedDate, notes, items, userId } = req.body
    const poNumber = `PO-${Date.now()}`
    
    // insert PO
    const poResult = await client.query(
      `INSERT INTO public.purchase_orders (org_id, outlet_id, supplier_id, po_number, expected_date, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [orgId, outletId, supplierId, poNumber, expectedDate, notes, userId]
    )
    const po = poResult.rows[0]
    
    // insert items
    let total = 0
    if (items && items.length > 0) {
      for (const item of items) {
        const subtotal = item.quantity * item.unitPrice
        total += subtotal
        await client.query(
          `INSERT INTO public.po_items (po_id, st_mast_id, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [po.id, item.stMastId, item.quantity, item.unitPrice, subtotal]
        )
      }
    }
    
    // update total
    await client.query(`UPDATE public.purchase_orders SET total_amount = $1 WHERE id = $2`, [total, po.id])
    await client.query('COMMIT')
    res.status(201).json({ ...po, total_amount: total })
  } catch (error) {
    await client.query('ROLLBACK')
    sendPgError(res, error)
  } finally {
    client.release()
  }
})

// Customers
app.get('/api/customers', async (req, res) => {
  try {
    const { orgId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(`SELECT * FROM public.customers WHERE org_id = $1 ORDER BY name ASC`, [orgId])
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/customers', async (req, res) => {
  try {
    const { orgId, name, phone, email, address, memberCode } = req.body
    const result = await pool.query(
      `INSERT INTO public.customers (org_id, name, phone, email, address, member_code)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orgId, name, phone, email, address, memberCode]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    sendPgError(res, error)
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

app.get('/api/shifts/current', async (req, res) => {
  try {
    const { orgId, outletId, userId } = req.query
    if (!orgId || !outletId || !userId) return res.status(400).json({ error: 'Missing parameters' })
    const result = await pool.query(
      `select * from public.pos_shifts where org_id = $1 and outlet_id = $2 and user_id = $3 and status = 'open' order by created_at desc limit 1`,
      [orgId, outletId, userId]
    )
    res.json(result.rows[0] || null)
  } catch (error) {
    sendPgError(res, error)
  }
})

app.post('/api/shifts', async (req, res) => {
  const { orgId, outletId, userId, cashierName, action, openingAmount, closingAmount, expectedAmount } = req.body
  try {
    if (action === 'open') {
      const result = await pool.query(
        `insert into public.pos_shifts (org_id, outlet_id, user_id, cashier_name, opening_amount, status)
         values ($1, $2, $3, $4, $5, 'open') returning *`,
        [orgId, outletId, userId, cashierName, Number(openingAmount || 0)]
      )
      res.json(result.rows[0])
    } else if (action === 'close') {
      const result = await pool.query(
        `update public.pos_shifts set closing_amount = $1, expected_amount = $2, end_time = now(), status = 'closed'
         where org_id = $3 and outlet_id = $4 and user_id = $5 and status = 'open'
         returning *`,
        [Number(closingAmount || 0), Number(expectedAmount || 0), orgId, outletId, userId]
      )
      res.json(result.rows[0] || null)
    } else {
      res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    sendPgError(res, error)
  }
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' })
})

// ---------------------------------------------------------------------
// PHASE 2 & 3: INVENTORY, CRM, ADVANCED SALES ENDPOINTS
// ---------------------------------------------------------------------

// Suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const { orgId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(`SELECT * FROM public.suppliers WHERE org_id = $1 ORDER BY name ASC`, [orgId])
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/suppliers', async (req, res) => {
  try {
    const { orgId, name, contactName, phone, email, address } = req.body
    const result = await pool.query(
      `INSERT INTO public.suppliers (org_id, name, contact_name, phone, email, address)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orgId, name, contactName, phone, email, address]
    )
    res.status(201).json(result.rows[0])
  } catch (error) { sendPgError(res, error) }
})

// Purchase Orders
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const { orgId, outletId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(
      `SELECT po.*, s.name as supplier_name 
       FROM public.purchase_orders po
       LEFT JOIN public.suppliers s ON s.id = po.supplier_id
       WHERE po.org_id = $1 ${outletId ? 'AND po.outlet_id = $2' : ''}
       ORDER BY po.created_at DESC`,
      outletId ? [orgId, outletId] : [orgId]
    )
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/purchase-orders', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { orgId, outletId, supplierId, expectedDate, notes, items, userId } = req.body
    const poNumber = `PO-${Date.now()}`
    
    // insert PO
    const poResult = await client.query(
      `INSERT INTO public.purchase_orders (org_id, outlet_id, supplier_id, po_number, expected_date, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [orgId, outletId, supplierId, poNumber, expectedDate, notes, userId]
    )
    const po = poResult.rows[0]
    
    // insert items
    let total = 0
    if (items && items.length > 0) {
      for (const item of items) {
        const subtotal = item.quantity * item.unitPrice
        total += subtotal
        await client.query(
          `INSERT INTO public.po_items (po_id, st_mast_id, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [po.id, item.stMastId, item.quantity, item.unitPrice, subtotal]
        )
      }
    }
    
    // update total
    await client.query(`UPDATE public.purchase_orders SET total_amount = $1 WHERE id = $2`, [total, po.id])
    await client.query('COMMIT')
    res.status(201).json({ ...po, total_amount: total })
  } catch (error) {
    await client.query('ROLLBACK')
    sendPgError(res, error)
  } finally {
    client.release()
  }
})

// Customers
app.get('/api/customers', async (req, res) => {
  try {
    const { orgId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(`SELECT * FROM public.customers WHERE org_id = $1 ORDER BY name ASC`, [orgId])
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/customers', async (req, res) => {
  try {
    const { orgId, name, phone, email, address, memberCode } = req.body
    const result = await pool.query(
      `INSERT INTO public.customers (org_id, name, phone, email, address, member_code)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orgId, name, phone, email, address, memberCode]
    )
    res.status(201).json(result.rows[0])
  } catch (error) { sendPgError(res, error) }
})

// Stock Opname
app.get('/api/stock-opname', async (req, res) => {
  try {
    const { orgId, outletId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(
      `SELECT * FROM public.stock_opname
       WHERE org_id = $1 ${outletId ? 'AND outlet_id = $2' : ''}
       ORDER BY created_at DESC`,
      outletId ? [orgId, outletId] : [orgId]
    )
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/stock-opname', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { orgId, outletId, notes, items, userId } = req.body
    const opnameNumber = `SO-${Date.now()}`
    
    // insert stock opname
    const opnameResult = await client.query(
      `INSERT INTO public.stock_opname (org_id, outlet_id, opname_number, notes, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [orgId, outletId, opnameNumber, notes, userId]
    )
    const opname = opnameResult.rows[0]
    
    // insert items and update st_mast
    if (items && items.length > 0) {
      for (const item of items) {
        const diff = item.actualQty - item.systemQty
        
        // 1. insert to stock_opname_items
        await client.query(
          `INSERT INTO public.stock_opname_items (opname_id, st_mast_id, system_qty, actual_qty, difference, note)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [opname.id, item.stMastId, item.systemQty, item.actualQty, diff, item.note]
        )
        
        // 2. update actual stock in st_mast
        await client.query(
          `UPDATE public.st_mast SET stock_qty = $1 WHERE id = $2`,
          [item.actualQty, item.stMastId]
        )
        
        // 3. insert stock movement
        await client.query(
          `INSERT INTO public.st_mutation (org_id, outlet_id, st_mast_id, tran_type, qty, ref_id, ref_desc, created_by)
           VALUES ($1, $2, $3, 'OPNAME', $4, $5, $6, $7)`,
          [orgId, outletId, item.stMastId, diff, opname.id, `Stock Opname ${opnameNumber}`, userId]
        )
      }
    }
    
    await client.query(`UPDATE public.stock_opname SET status = 'COMPLETED' WHERE id = $1`, [opname.id])
    await client.query('COMMIT')
    res.status(201).json({ ...opname, status: 'COMPLETED' })
  } catch (error) {
    await client.query('ROLLBACK')
    sendPgError(res, error)
  } finally {
    client.release()
  }
})

// Stock Movement / Mutasi Antar Outlet
app.get('/api/mutasi-outlet', async (req, res) => {
  try {
    const { orgId, outletId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId required' })
    const result = await pool.query(
      `SELECT * FROM public.st_mutation
       WHERE org_id = $1 AND movement_type = 'transfer' ${outletId ? 'AND outlet_id = $2' : ''}
       ORDER BY created_at DESC`,
      outletId ? [orgId, outletId] : [orgId]
    )
    res.json(result.rows)
  } catch (error) { sendPgError(res, error) }
})

app.post('/api/mutasi-outlet', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { orgId, sourceOutletId, targetOutletId, stMastId, qty, notes, userId } = req.body
    
    // Decrease source outlet stock
    const sourceStockRes = await client.query(`SELECT stock_qty FROM public.st_mast WHERE id = $1 AND outlet_id = $2`, [stMastId, sourceOutletId])
    if (sourceStockRes.rows.length === 0) throw new Error('Stok asal tidak ditemukan')
    const sourceQty = Number(sourceStockRes.rows[0].stock_qty)
    if (sourceQty < qty) throw new Error('Stok asal tidak mencukupi')

    await client.query(`UPDATE public.st_mast SET stock_qty = stock_qty - $1 WHERE id = $2 AND outlet_id = $3`, [qty, stMastId, sourceOutletId])

    // Increase target outlet stock (assuming target outlet has the same st_mast product, if not, we would need to create it. For MVP, assume it exists or we just track it)
    await client.query(`UPDATE public.st_mast SET stock_qty = stock_qty + $1 WHERE id = $2 AND outlet_id = $3`, [qty, stMastId, targetOutletId])

    // Insert to st_mutation (Out from source)
    await client.query(
      `INSERT INTO public.st_mutation (org_id, outlet_id, st_mast_id, movement_type, qty_out, qty_before, qty_after, note, created_by)
       VALUES ($1, $2, $3, 'transfer', $4, $5, $6, $7, $8)`,
      [orgId, sourceOutletId, stMastId, qty, sourceQty, sourceQty - qty, `Transfer ke Outlet ${targetOutletId}: ${notes}`, userId]
    )

    await client.query('COMMIT')
    res.status(201).json({ success: true, message: 'Mutasi berhasil' })
  } catch (error) {
    await client.query('ROLLBACK')
    sendPgError(res, error)
  } finally {
    client.release()
  }
})

if (process.env.NODE_ENV !== 'production' || (!process.env.VERCEL && !process.env.RENDER)) {
  app.listen(port, () => {
    console.log(`API Server running on port ${port}`)
  })
}

export default app;
