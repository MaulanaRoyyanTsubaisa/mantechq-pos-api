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

  return (
    <main className="content inv-page">
      <CapitalBanner compact />
      <section className="panel inv-card">
        <PageHeader
          title="Pemesanan Stok"
          icon={Boxes}
          actions={[
            <Button key="add" onClick={() => toast.success('Tambah Pemesanan Stok')}><Plus size={15} /> Tambah Pemesanan Stok</Button>,
          ]}
        />
        <FilterBar>
          <SearchInput value={query} onChange={setQuery} placeholder="Cari..." />
          <button className="date-trigger" onClick={() => setCalendarOpen(!calendarOpen)}>
            {range.label}
          </button>
          <SelectButton label="Semua Outlet" />
        </FilterBar>
        <DataTable
          columns={['NO. PEMESANAN STOK', 'JENIS PEMESANAN', 'OUTLET', 'NAMA PEMASOK', 'TANGGAL PESAN', 'TOTAL', 'STATUS PEMBAYARAN', 'STATUS PEMESANAN']}
          rows={[]}
          emptyText={<><strong>Data tidak tersedia</strong><br/>Belum ada data yang dapat ditampilkan di halaman ini</>}
          renderRow={() => null}
        />
      </section>
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
