import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Boxes,
  Download,
  Plus,
  Search,
} from 'lucide-react'
import { Button } from '../../shared/ui/Button.jsx'
import { CapitalBanner } from '../dashboard/SalesDashboard.jsx'
import { SelectButton } from '../../shared/ui/SelectButton.jsx'

function PageHeader({ title, icon: Icon, actions }) {
  return (
    <div className="majoo-page-head">
      <div className="majoo-title">
        <h1>{title}</h1>
      </div>
      <div className="majoo-actions">{actions}</div>
    </div>
  )
}

function FilterBar({ children }) {
  return <div className="majoo-filterbar">{children}</div>
}

function SearchInput({ value, onChange, placeholder = 'Cari...' }) {
  return (
    <label className="detail-search">
      <Search size={17} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}

function StatusTabs({ tabs, active, onChange }) {
  return (
    <div className="radio-tabs">
      {tabs.map((tab) => (
        <button key={tab} className={active === tab ? 'active' : ''} onClick={() => onChange(tab)}>
          {tab}
        </button>
      ))}
    </div>
  )
}

function DataTable({ columns, rows, emptyText, renderRow }) {
  return (
    <div className="module-table">
      <div className="module-table-head" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(130px, 1fr))` }}>
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {rows && rows.length ? (
        <div className="module-table-body">
          {rows.map(renderRow)}
        </div>
      ) : (
        <div className="module-empty">
          <div>{emptyText}</div>
        </div>
      )}
    </div>
  )
}

export function DaftarBahanBakuPage() {
  const [query, setQuery] = useState('')

  return (
    <main className="content inv-page">
      <CapitalBanner compact />
      <section className="panel inv-card">
        <PageHeader
          title="Daftar Bahan Baku"
          icon={Boxes}
          actions={[
            <Button key="imp" variant="outline" onClick={() => toast.success('Impor Bahan Baku')}><Download size={15} style={{ transform: 'rotate(180deg)' }} /> Impor Bahan Baku</Button>,
            <Button key="exp" variant="outline" onClick={() => toast.success('Ekspor Bahan Baku')}><Download size={15} /> Ekspor Bahan Baku</Button>,
            <Button key="add" onClick={() => toast.success('Tambah Bahan Baku')}><Plus size={15} /> Tambah Bahan Baku</Button>,
          ]}
        />
        <FilterBar>
          <SearchInput value={query} onChange={setQuery} placeholder="Cari berdasarkan nama..." />
        </FilterBar>
        <DataTable
          columns={['SKU', 'NAMA', 'SATUAN']}
          rows={[]}
          emptyText={<><strong>Belum Ada Bahan Baku</strong><br/>Silahkan tambahkan bahan baku baru</>}
          renderRow={() => null}
        />
      </section>
    </main>
  )
}

export function PemesananStokPage() {
  const [query, setQuery] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [range, setRange] = useState({ label: '01 Jun 2026 - 30 Jun 2026', display: '01 Juni 2026 - 30 Juni 2026' })
  const [pos, setPos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({ supplierId: '', expectedDate: '', notes: '', items: [] })

  const load = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem('pos_session') || '{}')
      if (session?.user?.org_id) {
        const { getPurchaseOrders, getSuppliers } = await import('../../shared/api/posApi.js')
        const [poData, suppData] = await Promise.all([
          getPurchaseOrders(session.user.org_id),
          getSuppliers(session.user.org_id)
        ])
        setPos(poData || [])
        setSuppliers(suppData || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengambil daftar pemesanan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const session = JSON.parse(sessionStorage.getItem('pos_session') || '{}')
      const { createPurchaseOrder } = await import('../../shared/api/posApi.js')
      await createPurchaseOrder({ ...formData, orgId: session.user.org_id, outletId: session.user.outlet_id, userId: session.user.id })
      toast.success('Pemesanan stok berhasil dibuat')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error('Gagal membuat pemesanan stok')
    }
  }

  const filtered = pos.filter(p => p.po_number.toLowerCase().includes(query.toLowerCase()) || (p.supplier_name && p.supplier_name.toLowerCase().includes(query.toLowerCase())))

  return (
    <main className="content inv-page">
      <CapitalBanner compact />
      <section className="panel inv-card">
        <PageHeader
          title="Pemesanan Stok"
          icon={Boxes}
          actions={[
            <Button key="add" onClick={() => setModalOpen(true)}><Plus size={15} /> Tambah Pemesanan Stok</Button>,
          ]}
        />
        <FilterBar>
          <SearchInput value={query} onChange={setQuery} placeholder="Cari pemesanan..." />
          <button className="date-trigger" onClick={() => setCalendarOpen(!calendarOpen)}>
            {range.label}
          </button>
          <SelectButton label="Semua Outlet" />
        </FilterBar>
        {loading ? <div style={{padding: 20}}>Memuat data...</div> : (
          <DataTable
            columns={['NO. PEMESANAN STOK', 'JENIS PEMESANAN', 'OUTLET', 'NAMA PEMASOK', 'TANGGAL PESAN', 'TOTAL', 'STATUS PEMBAYARAN', 'STATUS PEMESANAN']}
            rows={filtered}
            emptyText={<><strong>Data tidak tersedia</strong><br/>Belum ada data yang dapat ditampilkan di halaman ini</>}
            renderRow={(p, i) => (
              <div key={i} className="module-table-row" style={{ gridTemplateColumns: `repeat(8, minmax(130px, 1fr))` }}>
                <span className="truncate">{p.po_number}</span>
                <span>Normal</span>
                <span>-</span>
                <span className="truncate">{p.supplier_name || '-'}</span>
                <span>{new Date(p.created_at).toLocaleDateString('id-ID')}</span>
                <span>Rp {p.total_amount?.toLocaleString('id-ID')}</span>
                <span><span className="status-badge" data-status="unpaid">Belum Lunas</span></span>
                <span><span className="status-badge" data-status={p.status?.toLowerCase() || 'pending'}>{p.status || 'Pending'}</span></span>
              </div>
            )}
          />
        )}
      </section>

      {modalOpen && (
        <div className="pos-modal-overlay active" onClick={() => setModalOpen(false)}>
          <div className="pos-modal product-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Pemesanan Stok</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Pemasok*</label>
                <select value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})}>
                  <option value="">-- Pilih Pemasok --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tanggal Diharapkan</label>
                <input type="date" value={formData.expectedDate} onChange={e => setFormData({...formData, expectedDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Catatan</label>
                <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
              <div className="notice-banner" style={{ marginTop: 10, background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 13 }}>
                *Penambahan item (produk) ke dalam PO akan dilakukan di halaman detail PO (WIP Phase 2.1). Klik simpan untuk membuat draft PO.
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
              <Button onClick={handleSubmit} disabled={!formData.supplierId}>Simpan</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export function DaftarStokPage() {
  const [query, setQuery] = useState('')
  const [statusTab, setStatusTab] = useState('Semua')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [range, setRange] = useState({ label: '01 Jun 2026 - 30 Jun 2026', display: '01 Juni 2026 - 30 Juni 2026' })

  return (
    <main className="content inv-page">
      <CapitalBanner compact />
      <div className="notice-banner" style={{ background: '#e7f8ec', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', color: '#08a88c', fontWeight: 600, fontSize: '13px' }}>
        Menu Baru - Tambah Bahan Baku. Tambah dan ubah bahan baku di pindahkan ke halaman khusus bahan baku. <a href="#" style={{ textDecoration: 'underline' }}>Menu Bahan Baku</a>
      </div>
      <section className="panel inv-card">
        <PageHeader
          title="Daftar Stok"
          icon={Boxes}
          actions={[
            <Button key="exp" variant="outline" onClick={() => toast.success('Ekspor Daftar Stok')}><Download size={15} /> Ekspor Daftar Stok</Button>,
          ]}
        />
        <FilterBar>
          <SearchInput value={query} onChange={setQuery} placeholder="Cari ..." />
          <button className="date-trigger" onClick={() => setCalendarOpen(!calendarOpen)}>
            {range.label}
          </button>
          <SelectButton label="" />
          <SelectButton label="Sertakan Kolom" />
          <Button variant="outline">Jumlah Stok</Button>
          <StatusTabs tabs={['Semua', 'Produk', 'Bahan']} active={statusTab} onChange={setStatusTab} />
        </FilterBar>
        <DataTable
          columns={['SKU', 'NAMA', 'JENIS', 'AWAL', 'MASUK', 'TERJUAL', 'AKHIR', 'SATUAN']}
          rows={[]}
          emptyText={<><strong>Data tidak tersedia</strong><br/>Belum ada data yang dapat ditampilkan di halaman ini</>}
          renderRow={(item, i) => (
            <tr key={i}>
              <td colSpan={9}></td>
            </tr>
          )}
        />
      </section>
    </main>
  )
}

export function DaftarPemasokPage() {
  const [query, setQuery] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', contactName: '', phone: '', email: '', address: '' })

  const load = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem('pos_session') || '{}')
      if (session?.user?.org_id) {
        const { getSuppliers } = await import('../../shared/api/posApi.js')
        const data = await getSuppliers(session.user.org_id)
        setSuppliers(data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengambil daftar pemasok')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const session = JSON.parse(sessionStorage.getItem('pos_session') || '{}')
      const { createSupplier } = await import('../../shared/api/posApi.js')
      await createSupplier({ ...formData, orgId: session.user.org_id })
      toast.success('Pemasok berhasil ditambahkan')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error('Gagal menambahkan pemasok')
    }
  }

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <main className="content inv-page">
      <CapitalBanner compact />
      <section className="panel inv-card">
        <PageHeader
          title="Daftar Pemasok"
          icon={Boxes}
          actions={[
            <Button key="add" onClick={() => setModalOpen(true)}><Plus size={15} /> Tambah Pemasok</Button>,
          ]}
        />
        <FilterBar>
          <SearchInput value={query} onChange={setQuery} placeholder="Cari pemasok..." />
        </FilterBar>
        {loading ? <div style={{padding: 20}}>Memuat data...</div> : (
          <DataTable
            columns={['NAMA PEMASOK', 'KONTAK', 'TELEPON', 'EMAIL', 'STATUS']}
            rows={filtered}
            emptyText={<><strong>Belum Ada Pemasok</strong><br/>Silahkan tambahkan pemasok baru</>}
            renderRow={(s, i) => (
              <div key={i} className="module-table-row" style={{ gridTemplateColumns: `repeat(5, minmax(130px, 1fr))` }}>
                <span className="truncate">{s.name}</span>
                <span className="truncate">{s.contact_name || '-'}</span>
                <span>{s.phone || '-'}</span>
                <span className="truncate">{s.email || '-'}</span>
                <span><span className="status-badge" data-status={s.status?.toLowerCase() || 'active'}>{s.status || 'Active'}</span></span>
              </div>
            )}
          />
        )}
      </section>

      {modalOpen && (
        <div className="pos-modal-overlay active" onClick={() => setModalOpen(false)}>
          <div className="pos-modal product-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Pemasok</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Pemasok*</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nama Kontak</label>
                <input value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Telepon</label>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <textarea rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
              <Button onClick={handleSubmit} disabled={!formData.name}>Simpan</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export function KelolaStokPage() {
  const [query, setQuery] = useState('')
  const [opnames, setOpnames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ notes: '', items: [] })

  const load = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem('pos_session') || '{}')
      if (session?.user?.org_id) {
        const { getStockOpnames } = await import('../../shared/api/posApi.js')
        const data = await getStockOpnames(session.user.org_id)
        setOpnames(data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengambil daftar stock opname')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const session = JSON.parse(sessionStorage.getItem('pos_session') || '{}')
      const { createStockOpname } = await import('../../shared/api/posApi.js')
      await createStockOpname({ ...formData, orgId: session.user.org_id, outletId: session.user.outlet_id, userId: session.user.id })
      toast.success('Stock opname berhasil disimpan')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error('Gagal membuat stock opname')
    }
  }

  const filtered = opnames.filter(o => o.opname_number.toLowerCase().includes(query.toLowerCase()) || (o.notes && o.notes.toLowerCase().includes(query.toLowerCase())))

  return (
    <main className="content inv-page">
      <CapitalBanner compact />
      <section className="panel inv-card">
        <PageHeader
          title="Kelola Stok (Opname & Terbuang)"
          icon={Boxes}
          actions={[
            <Button key="add" onClick={() => setModalOpen(true)}><Plus size={15} /> Tambah Stock Opname</Button>,
          ]}
        />
        <FilterBar>
          <SearchInput value={query} onChange={setQuery} placeholder="Cari nomor opname..." />
        </FilterBar>
        {loading ? <div style={{padding: 20}}>Memuat data...</div> : (
          <DataTable
            columns={['NO. OPNAME', 'TANGGAL', 'CATATAN', 'STATUS']}
            rows={filtered}
            emptyText={<><strong>Belum Ada Data</strong><br/>Silahkan lakukan stock opname baru</>}
            renderRow={(o, i) => (
              <div key={i} className="module-table-row" style={{ gridTemplateColumns: `repeat(4, minmax(130px, 1fr))` }}>
                <span className="truncate">{o.opname_number}</span>
                <span>{new Date(o.created_at).toLocaleDateString('id-ID')}</span>
                <span className="truncate">{o.notes || '-'}</span>
                <span><span className="status-badge" data-status={o.status?.toLowerCase() || 'completed'}>{o.status || 'COMPLETED'}</span></span>
              </div>
            )}
          />
        )}
      </section>

      {modalOpen && (
        <div className="pos-modal-overlay active" onClick={() => setModalOpen(false)}>
          <div className="pos-modal product-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Stock Opname</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Catatan</label>
                <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
              <div className="notice-banner" style={{ marginTop: 10, background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 13 }}>
                *Penyesuaian stok produk (fisik vs sistem) akan dilakukan di halaman detail Opname (WIP Phase 2.1). Klik simpan untuk membuat catatan Opname.
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
              <Button onClick={handleSubmit}>Simpan</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
