import React, { createPortal, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertTriangle,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  Gift,
  HeartHandshake,
  HelpCircle,
  Home,
  Info,
  ListFilter,
  LayoutDashboard,
  Menu,
  Megaphone,
  MoreVertical,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tags,
  Trash2,
  Truck,
  Upload,
  Users,
  X,
  Printer,
  ScanBarcode,
} from 'lucide-react'
import { Button } from '../../shared/ui/Button.jsx'
import { cn } from '../../shared/lib/cn.js'
import { membershipOutletLabel, parseCurrencyInput } from '../../shared/lib/formatters.js'
import { createSale, createProduct, deleteProduct } from '../../shared/api/posApi.js'
import { CapitalBanner } from '../dashboard/SalesDashboard.jsx'
import {
  moduleBlueprints,
  reportPageConfigs,
  productPageConfigs,
  getRowsForPage,
  mapStockToProductRows,
  paymentMethodOptions,
  sidebarGroups,
  flattenItems,
  formatRupiah,
  formatQty,
  buildSalesSummary,
  downloadCSV,
  shortId,
} from './moduleBlueprints.js'
import { DaftarBahanBakuPage, PemesananStokPage, DaftarStokPage, DaftarPemasokPage, KelolaStokPage } from './InventoryPages.jsx'
import { ProductFormModal } from './ProductFormModal.jsx'
import { DaftarPelangganPage } from './CustomerPages.jsx'

function ConfirmModal({ open, title, message, icon, confirmLabel = 'Ya, Lanjutkan', cancelLabel = 'Batal', variant = 'danger', onConfirm, onCancel }) {
  if (!open) return null
  const variantColor = variant === 'danger' ? '#ef4444' : variant === 'warning' ? '#f59e0b' : 'var(--primary-color)'
  const iconBg = variant === 'danger' ? '#fef2f2' : variant === 'warning' ? '#fffbeb' : '#eff6ff'
  return createPortal(
    <div className="cm-scrim" onClick={onCancel}>
      <div className="cm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="cm-icon-wrap" style={{ background: iconBg }}>
          {icon || <AlertTriangle size={26} color={variantColor} />}
        </div>
        <h2 className="cm-title">{title}</h2>
        <p className="cm-message">{message}</p>
        <div className="cm-footer">
          <button className="cm-btn cm-btn-cancel" onClick={onCancel}>{cancelLabel}</button>
          <button className="cm-btn cm-btn-confirm" style={{ background: variantColor }} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function EmptyModuleState({ type }) {
  const text = 'Data tidak tersedia'
  return (
    <div className="module-empty">
      <div>
        <ClipboardList size={42} />
        <strong>{text}</strong>
        <p>Belum ada data yang dapat ditampilkan di halaman ini</p>
      </div>
    </div>
  )
}

function ModulePage({ activePage, onStartFlow, posData }) {
  if (activePage === 'Transaksi Baru') {
    return <TransactionPage posData={posData} />
  }
  if (activePage === 'Ringkasan Penjualan') {
    return <SalesSummaryReportPage posData={posData} />
  }
  if (activePage === 'Detail Penjualan') {
    return <SalesDetailReportPage />
  }
  if (activePage === 'Penjualan Per Periode') {
    return <SalesPeriodReportPage />
  }
  if (activePage === 'Penjualan Outlet') {
    return <SalesOutletReportPage />
  }
  if (reportPageConfigs[activePage]) {
    return <MajooGenericReportPage config={reportPageConfigs[activePage]} posData={posData} />
  }
  if (productPageConfigs[activePage]) {
    return <ProductDirectoryPage config={productPageConfigs[activePage]} onStartFlow={onStartFlow} posData={posData} />
  }


  if (activePage === 'Pemesanan Stok') return <PemesananStokPage />
  if (activePage === 'Daftar Stok') return <DaftarStokPage />
  if (activePage === 'Daftar Pemasok') return <DaftarPemasokPage />
  if (activePage === 'Kelola Stok') return <KelolaStokPage />

  // Customer custom pages
  if (activePage === 'Daftar Pelanggan') return <DaftarPelangganPage posData={posData} onRefresh={() => posData?.refresh?.()} />

  return <GenericModulePage activePage={activePage} onStartFlow={onStartFlow} posData={posData} />
}

function GenericModulePage({ activePage, onStartFlow, posData }) {
  const parent = useMemo(
    () => sidebarGroups.find((group) => group.label === activePage || flattenItems(group.children).includes(activePage)),
    [activePage],
  )
  const blueprint = moduleBlueprints[activePage] || {
    type: 'master',
    title: activePage,
    description: `Kelola ${activePage.toLowerCase()} untuk operasional ManTechQ PoS.`,
    actions: ['Tambah'],
    filters: ['Outlet', 'Status'],
    columns: ['Nama', 'Status', 'Update'],
    rows: [],
  }
  const Icon = parent?.icon || Sparkles
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Semua Status')
  const [activeTab, setActiveTab] = useState('Semua')
  const controls = blueprint.controls || (blueprint.type === 'report' ? 'date-status' : 'status-tabs')
  const apiRows = getRowsForPage(activePage, posData)
  const rows = apiRows.length > 0 ? apiRows : (blueprint.rows || [])
  const filteredRows = rows.filter((row) => {
    const matchesQuery = row.join(' ').toLowerCase().includes(query.toLowerCase())
    if (!matchesQuery) return false
    if (activeTab === 'Semua') return true
    return row.includes(activeTab)
  })
  const actionIcon = (action) => {
    if (action.toLowerCase().includes('impor')) return Truck
    if (action.toLowerCase().includes('ekspor')) return FileText
    return Sparkles
  }
  const [noteCategoryModalOpen, setNoteCategoryModalOpen] = useState(false)

  return (
    <main className="content">
      <section className="panel module-page">
        <div className="majoo-page-head">
          <div className="majoo-title">
            <h1>{blueprint.title}</h1>
            {blueprint.subtitle ? <p>{blueprint.subtitle}</p> : null}
            {blueprint.countLabel ? <p>{blueprint.countLabel}</p> : null}
          </div>
          <div className="majoo-actions">
            {(blueprint.actions || ['Tambah']).map((action) => {
              const ActionIcon = actionIcon(action)
              return (
                <Button
                  key={action}
                  variant={action.toLowerCase().includes('tambah') ? 'default' : 'outline'}
                  onClick={() => {
                    if (action === 'Tambah Produk') onStartFlow('product')
                    else if (action === 'Tambah Kategori Catatan') setNoteCategoryModalOpen(true)
                    else if (action.toLowerCase().includes('ekspor')) {
                      downloadCSV(blueprint.title, blueprint.columns, rows)
                      toast.success(`Berhasil mengekspor ${blueprint.title}`)
                    } else toast.success(`${action} ${blueprint.title}`)
                  }}
                >
                  <ActionIcon size={16} />
                  {action}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="module-context">
          <span className="module-icon">
            <Icon size={20} />
          </span>
          <div>
            <strong>{parent?.label || 'ManTechQ PoS'}</strong>
            <p>{blueprint.description}</p>
          </div>
        </div>

        <div className="majoo-filterbar">
          <label>
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ..." />
          </label>
          {controls === 'product' ? <SelectButton label="Semua Kategori" /> : null}
          {controls === 'invoice' || controls === 'date-status' ? <SelectButton label="01 Jun 2026 - 30 Jun 2026" /> : null}
          {controls === 'invoice' || controls === 'date-status' ? <SelectButton label={status} onClick={() => setStatus('Semua Status')} /> : null}
          {controls === 'status-tabs' || controls === 'product' ? (
            <div className="radio-tabs" role="tablist" aria-label="Status tampil">
              {['Semua', 'Tampil di Menu', 'Tidak Tampil di Menu'].map((item) => (
                <button key={item} className={item === activeTab ? 'active' : ''} onClick={() => setActiveTab(item)}>
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {blueprint.summary ? (
          <div className="invoice-summary">
            {blueprint.summary.map(([label, value]) => (
              <MiniKpi key={label} label={label} value={value} />
            ))}
          </div>
        ) : null}

        <div className="module-table">
          <div className="module-table-head" style={{ gridTemplateColumns: `44px repeat(${blueprint.columns.length}, minmax(130px, 1fr))` }}>
            <span className="check-col">
              <input type="checkbox" aria-label="Toggle All Current Page Rows Selected" />
            </span>
            {blueprint.columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          {filteredRows.length ? (
            <div className="module-table-body">
              {filteredRows.map((row, rowIndex) => (
                <div className="module-table-row" style={{ gridTemplateColumns: `44px repeat(${blueprint.columns.length}, minmax(130px, 1fr))` }} key={`${activePage}-${rowIndex}`}>
                  <span className="check-col">
                    <input type="checkbox" aria-label={`Pilih baris ${rowIndex + 1}`} />
                  </span>
                  {blueprint.columns.map((column, index) => (
                    <span key={`${column}-${index}`}>{row[index] || '-'}</span>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <EmptyModuleState type={blueprint.type} />
          )}
        </div>
      </section>
      {noteCategoryModalOpen && <NoteCategoryModal onClose={() => setNoteCategoryModalOpen(false)} onRefresh={() => posData?.refresh?.()} />}
    </main>
  )
}

function NoteCategoryModal({ onClose, onRefresh }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name) return toast.error('Nama kategori harus diisi')
    setSaving(true)
    try {
      const payload = {
        orgId: 'f63d5959-6c12-4765-8d27-2990f7f3139f',
        name,
        status
      }
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/note-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Gagal menyimpan kategori')
      }
      toast.success('Kategori catatan berhasil ditambahkan')
      onRefresh()
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="modal-content" style={{background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 400}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <h2 style={{margin: 0, fontSize: 18}}>Tambah Kategori Catatan</h2>
          <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer'}}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <label style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, fontWeight: 500}}>
            Nama Kategori
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Catatan Dapur" style={{padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14}} required />
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer'}}>
            <input type="checkbox" checked={status} onChange={e => setStatus(e.target.checked)} style={{width: 18, height: 18}} />
            Tampil di Menu
          </label>
          <div style={{marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12}}>
            <Button variant="outline" onClick={onClose} type="button">Batal</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Kategori'}</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

const summaryMetricCards = [
  ['Total Pendapatan', 'Rp 0', 'green'],
  ['Biaya Promosi', 'Rp 0', 'yellow'],
  ['Total Penjualan', 'Rp 0', 'blue'],
  ['Penjualan Bersih', 'Rp 0', 'cyan'],
  ['Total Laba Kotor', 'Rp 0', 'purple'],
]

const summaryBreakdowns = [
  {
    title: 'Pendapatan',
    tone: 'green',
    rows: [
      ['Penjualan Kotor', 'Rp 0'],
      ['Ongkos Kirim', 'Rp 0'],
      ['Biaya Pelayanan', 'Rp 0'],
      ['Biaya Pelayanan MDR', 'Rp 0'],
      ['Pembulatan', 'Rp 0'],
      ['Pajak', 'Rp 0'],
      ['Asuransi', 'Rp 0'],
      ['Platform', 'Rp 0'],
      ['Lainnya', 'Rp 0'],
    ],
    total: ['TOTAL PENDAPATAN', 'Rp 0'],
  },
  {
    title: 'Biaya Promosi',
    tone: 'yellow',
    rows: [
      ['Promo Pembelian', '( Rp 0 )'],
      ['Promo Produk', '( Rp 0 )'],
      ['Komplimen', '( Rp 0 )'],
    ],
    total: ['TOTAL BIAYA PROMOSI', '( Rp 0 )'],
  },
  {
    title: 'Biaya Administrasi',
    tone: 'red',
    rows: [['Biaya Administrasi', '( Rp 0 )']],
    total: ['TOTAL BIAYA ADMINISTRASI', '( Rp 0 )'],
  },
  {
    title: 'Penjualan Bersih',
    tone: 'blue',
    rows: [
      ['Total Penjualan', 'Rp 0'],
      ['Pengembalian', '( Rp 0 )'],
    ],
    total: ['TOTAL PENJUALAN BERSIH', 'Rp 0'],
  },
  {
    title: 'Laba Kotor',
    tone: 'purple',
    wide: true,
    rows: [
      ['Penjualan Bersih', 'Rp 0'],
      ['Biaya MDR', '( Rp 0 )'],
      ['HPP', '( Rp 0 )'],
      ['Komisi', '( Rp 0 )'],
      ['Biaya Ongkos Kirim', '( Rp 0 )'],
      ['Biaya Asuransi', '( Rp 0 )'],
    ],
    total: ['TOTAL LABA KOTOR', 'Rp 0'],
  },
]

function SalesSummaryReportPage({ posData }) {
  const summary = buildSalesSummary(posData)
  const liveMetricCards = [
    ['Total Transaksi', formatQty(summary.transactionCount), 'green'],
    ['Total Penjualan Kotor', formatRupiah(summary.grandTotal), 'yellow'],
    ['Total Penjualan Bersih', formatRupiah(summary.grandTotal), 'blue'],
    ['Total Produk Terjual', formatQty(summary.productQty), 'purple'],
  ]
  const liveBreakdowns = summaryBreakdowns.map((section) => {
    if (section.title === 'Pendapatan') {
      return {
        ...section,
        rows: [
          ['Penjualan Kotor', formatRupiah(summary.subTotal)],
          ['Ongkos Kirim', 'Rp 0'],
          ['Biaya Pelayanan', 'Rp 0'],
          ['Biaya Pelayanan MDR', 'Rp 0'],
          ['Pembulatan', 'Rp 0'],
          ['Pajak', formatRupiah(summary.taxTotal)],
          ['Asuransi', 'Rp 0'],
          ['Platform', 'Rp 0'],
          ['Lainnya', 'Rp 0'],
        ],
        total: ['TOTAL PENDAPATAN', formatRupiah(summary.subTotal + summary.taxTotal)],
      }
    }
    if (section.title === 'Biaya Promosi') {
      return {
        ...section,
        rows: [
          ['Promo Pembelian', `( ${formatRupiah(summary.discountTotal)} )`],
          ['Promo Produk', '( Rp 0 )'],
          ['Komplimen', '( Rp 0 )'],
        ],
        total: ['TOTAL BIAYA PROMOSI', `( ${formatRupiah(summary.discountTotal)} )`],
      }
    }
    if (section.title === 'Penjualan Bersih') {
      return {
        ...section,
        rows: [
          ['Total Penjualan', formatRupiah(summary.grandTotal)],
          ['Pengembalian', '( Rp 0 )'],
        ],
        total: ['TOTAL PENJUALAN BERSIH', formatRupiah(summary.grandTotal)],
      }
    }
    if (section.title === 'Laba Kotor') {
      return {
        ...section,
        rows: [
          ['Penjualan Bersih', formatRupiah(summary.grandTotal)],
          ['Biaya MDR', '( Rp 0 )'],
          ['HPP', '( Rp 0 )'],
          ['Komisi', '( Rp 0 )'],
          ['Biaya Ongkos Kirim', '( Rp 0 )'],
          ['Biaya Asuransi', '( Rp 0 )'],
        ],
        total: ['TOTAL LABA KOTOR', formatRupiah(summary.grandTotal)],
      }
    }
    return section
  })
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('dalam beberapa detik')

  const processRange = (nextRange) => {
    setRange(nextRange)
    setLastUpdated('baru saja')
    setCalendarOpen(false)
    toast.success(`Ringkasan diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Ringkasan Penjualan ${format} disiapkan`)
  }

  return (
    <main className="content report-summary-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card">
        <div className="report-summary-head">
          <div>
            <div className="report-title-row">
              <h1>Ringkasan Penjualan</h1>
              <button className="icon-link" onClick={() => setHelpOpen((value) => !value)} aria-label="Bantuan Ringkasan Penjualan">
                <HelpCircle size={19} />
              </button>
              <button className={cn('icon-link favorite', favorite && 'active')} onClick={() => setFavorite((value) => !value)} aria-label="Favorit">
                <Star size={21} />
              </button>
            </div>
            {helpOpen ? <HelpTutorialPopover onClose={() => setHelpOpen(false)} /> : null}
          </div>
          <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
        </div>

        <div className="report-toolbar">
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <div className="report-updated">Terakhir Diperbarui: {lastUpdated}</div>

        <div className="summary-metrics">
          {liveMetricCards.map(([label, value, tone]) => (
            <ReportMetricCard key={label} label={label} value={value} tone={tone} />
          ))}
        </div>

        <h2>Rincian Ringkasan Penjualan</h2>
        <div className="summary-breakdown-grid">
          {liveBreakdowns.map((section) => (
            <ReportBreakdownTable key={section.title} {...section} />
          ))}
        </div>
      </section>
    </main>
  )
}

function ReportMetricCard({ label, value, tone }) {
  return (
    <article className={cn('report-metric-card', tone)}>
      <span>
        {label}
        <Info size={14} />
      </span>
      <strong>{value}</strong>
    </article>
  )
}

function ReportBreakdownTable({ title, tone, rows, total, wide }) {
  return (
    <article className={cn('breakdown-table', tone, wide && 'wide')}>
      <header>{title.toUpperCase()}</header>
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
      <footer>
        <span>{total[0]}</span>
        <strong>{total[1]}</strong>
      </footer>
    </article>
  )
}

function ExportDropdown({ open, onToggle, onExport }) {
  return (
    <div className="export-wrap">
      <Button onClick={onToggle}>
        <Download size={16} />
        Ekspor Laporan
      </Button>
      {open ? (
        <div className="export-menu">
          {['PDF', 'Excel'].map((format) => (
            <button key={format} onClick={() => onExport(format)}>{format}</button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function DateRangePicker({ open, range, onToggle, onProcess, onCancel }) {
  const [draft, setDraft] = useState(range)
  const presets = [
    ['Hari Ini', '06 Jun 2026 - 06 Jun 2026', '06 Juni 2026 - 06 Juni 2026'],
    ['Kemarin', '05 Jun 2026 - 05 Jun 2026', '05 Juni 2026 - 05 Juni 2026'],
    ['7 Hari Terakhir', '31 Mei 2026 - 06 Jun 2026', '31 Mei 2026 - 06 Juni 2026'],
    ['Minggu Ini', '01 Jun 2026 - 06 Jun 2026', '01 Juni 2026 - 06 Juni 2026'],
    ['Minggu Lalu', '25 Mei 2026 - 31 Mei 2026', '25 Mei 2026 - 31 Mei 2026'],
    ['30 Hari Terakhir', '08 Mei 2026 - 06 Jun 2026', '08 Mei 2026 - 06 Juni 2026'],
    ['Bulan Ini', '01 Jun 2026 - 30 Jun 2026', '01 Juni 2026 - 30 Juni 2026'],
    ['Bulan Lalu', '01 Mei 2026 - 31 Mei 2026', '01 Mei 2026 - 31 Mei 2026'],
  ]
  const juneDays = Array.from({ length: 30 }, (_, index) => index + 1)
  const mayDays = Array.from({ length: 31 }, (_, index) => index + 1)

  useEffect(() => {
    if (open) setDraft(range)
  }, [open, range])

  const choosePreset = ([, label, display]) => {
    setDraft((current) => ({ ...current, label, display }))
  }

  return (
    <div className="date-picker-wrap">
      <button className="date-trigger" onClick={onToggle}>
        <CalendarDays size={18} />
        {range.label}
      </button>
      {open ? (
        <div className="date-popover">
          <div className="date-presets">
            {presets.map((preset) => (
              <button key={preset[0]} onClick={() => choosePreset(preset)}>{preset[0]}</button>
            ))}
          </div>
          <MiniMonth title="Mei 2026" days={mayDays} mutedFrom={31} />
          <MiniMonth title="Juni 2026" days={juneDays} selectedStart={1} selectedEnd={30} rangeStart={1} rangeEnd={30} />
          <div className="date-time-panel">
            <label>Dari Tanggal<span>{draft.display.split(' - ')[0]}</span></label>
            <label>Dari Pukul<input value={draft.startTime} onChange={(event) => setDraft((current) => ({ ...current, startTime: event.target.value }))} /></label>
            <label>Hingga Tanggal<span>{draft.display.split(' - ')[1]}</span></label>
            <label>Hingga Pukul<input value={draft.endTime} onChange={(event) => setDraft((current) => ({ ...current, endTime: event.target.value }))} /></label>
          </div>
          <footer>
            <strong>{draft.display}</strong>
            <div>
              <button onClick={onCancel}>Batal</button>
              <Button onClick={() => onProcess(draft)}>Proses</Button>
            </div>
          </footer>
        </div>
      ) : null}
    </div>
  )
}

function MiniMonth({ title, days, selectedStart, selectedEnd, rangeStart, rangeEnd }) {
  return (
    <div className="mini-month">
      <header>
        <button><ChevronLeft size={18} /></button>
        <strong>{title}</strong>
        <button><ChevronRight size={18} /></button>
      </header>
      <div className="weekdays">{['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="days-grid">
        {days.map((day) => {
          const selected = day === selectedStart || day === selectedEnd
          const inRange = rangeStart && rangeEnd && day >= rangeStart && day <= rangeEnd
          return <button key={day} className={cn(inRange && 'in-range', selected && 'selected')}>{day}</button>
        })}
      </div>
    </div>
  )
}

function HelpTutorialPopover({ onClose }) {
  return (
    <div className="tutorial-popover">
      <button className="tutorial-close" onClick={onClose}><X size={16} /></button>
      <div className="tutorial-image">
        <span>Tutorial Dashboard Baru</span>
        <strong>Halaman Ringkasan Penjualan</strong>
        <button><ChevronRight size={22} /></button>
      </div>
      <p><strong>Informasi Umum</strong>Halaman Laporan Ringkasan Penjualan menyajikan informasi akumulasi nilai penjualan yang dihitung berdasarkan periode pilihan.</p>
      <Button onClick={() => toast.info('Tutorial Ringkasan Penjualan dibuka')}>Pelajari Selengkapnya</Button>
    </div>
  )
}

const detailMetrics = [
  ['Total Penjualan', 'Rp 0'],
  ['Total Transaksi', '0'],
  ['Penjualan Bersih', 'Rp 0'],
  ['Total Pembayaran', 'Rp 0'],
  ['Total Piutang', 'Rp 0'],
]

const detailColumns = [
  'NO TRANSAKSI',
  'WAKTU ORDER',
  'WAKTU BAYAR',
  'OUTLET',
  'JENIS ORDER',
  'TOTAL PENJUALAN (RP)',
  'METODE PEMBAYARAN',
  'BAYAR',
  'ORDER',
]

const detailFilterGroups = {
  'Status Pembayaran': ['Sudah Dibayar', 'Belum Dibayar', 'Piutang'],
  'Jenis Order': ['Dine In', 'Take Away', 'Delivery', 'Online Order'],
  Penjualan: ['Semua Penjualan', 'Penjualan Bersih', 'Penjualan Kotor'],
  'Penjualan Kotor': ['Dengan pajak', 'Tanpa pajak', 'Dengan ongkir'],
  'Metode Pembayaran': ['Tunai', 'QRIS', 'Transfer Bank', 'Kartu Debit'],
  Kasir: ['royyan', 'Kasir Utama', 'Admin Outlet'],
  'Jenis Harga': ['Harga Normal', 'Harga Grosir', 'Harga Promo'],
}

function SalesDetailReportPage({ posData }) {
  const summary = buildSalesSummary(posData)
  const sales = posData.sales || []
  const liveDetailMetrics = [
    ['Total Penjualan', formatRupiah(summary.grandTotal)],
    ['Total Transaksi', String(summary.transactionCount)],
    ['Penjualan Bersih', formatRupiah(summary.grandTotal)],
    ['Total Pembayaran', formatRupiah(summary.paidTotal)],
    ['Total Piutang', formatRupiah(summary.unpaidTotal)],
  ]
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [timeBasis, setTimeBasis] = useState('Waktu Order')
  const [filterOpen, setFilterOpen] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Status Pembayaran')
  const [filterValues, setFilterValues] = useState({})
  const [visibleColumns, setVisibleColumns] = useState(detailColumns)
  const [query, setQuery] = useState('')
  const [lastUpdated, setLastUpdated] = useState('beberapa detik yang lalu')
  const [selectedSale, setSelectedSale] = useState(null)

  const processRange = (nextRange) => {
    setRange(nextRange)
    setLastUpdated('baru saja')
    setCalendarOpen(false)
    toast.success(`Detail penjualan diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Detail Penjualan ${format} disiapkan`)
  }

  const applyFilters = () => {
    setFilterOpen(false)
    setLastUpdated('baru saja')
    toast.success('Filter laporan diterapkan')
  }

  const toggleColumn = (column) => {
    setVisibleColumns((current) => {
      if (current.includes(column)) return current.length === 1 ? current : current.filter((item) => item !== column)
      return detailColumns.filter((item) => current.includes(item) || item === column)
    })
  }

  return (
    <main className="content report-summary-page sales-detail-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-detail-card">
        <div className="sales-detail-head">
          <div>
            <h1>Detail Penjualan</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <Button variant="outline" onClick={() => setTableOpen(true)}>
              <Settings size={16} />
              Atur Tabel
            </Button>
            <Button variant="outline" onClick={() => setFilterOpen(true)}>
              <ListFilter size={16} />
              Filter
            </Button>
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
          <div className="select-dropdown-wrap">
            <button className="select-button detail-time-select" onClick={() => setTimeOpen((value) => !value)}>
              <span>{timeBasis}</span>
              <ChevronDown size={15} />
            </button>
            {timeOpen ? (
              <div className="simple-select-menu">
                {['Waktu Order', 'Waktu Bayar'].map((item) => (
                  <button
                    key={item}
                    className={item === timeBasis ? 'active' : ''}
                    onClick={() => {
                      setTimeBasis(item)
                      setTimeOpen(false)
                      toast.info(`Basis tanggal: ${item}`)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="detail-metrics-grid">
          {liveDetailMetrics.map(([label, value]) => (
            <article key={label} className="detail-metric-card">
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

          <table className="detail-report-table">
            <thead>
              <tr>
                {visibleColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th />
              </tr>
            </thead>
            {sales.length > 0 && (
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    {visibleColumns.includes('NO TRANSAKSI') && <td>{sale.m_stran?.tran_no || sale.tran_no || '-'}</td>}
                    {visibleColumns.includes('WAKTU ORDER') && <td>{new Date(sale.m_stran?.tran_date || sale.created_at).toLocaleString('id-ID')}</td>}
                    {visibleColumns.includes('WAKTU BAYAR') && <td>{new Date(sale.m_stran?.tran_date || sale.created_at).toLocaleString('id-ID')}</td>}
                    {visibleColumns.includes('OUTLET') && <td>{sale.m_stran?.outlet_id ? `Outlet ${shortId(sale.m_stran.outlet_id)}` : '-'}</td>}
                    {visibleColumns.includes('JENIS ORDER') && <td>{sale.note?.includes('Dine-in') || sale.note?.includes('Dine In') ? 'Dine In' : sale.note?.includes('Take Away') ? 'Take Away' : 'Reguler'}</td>}
                    {visibleColumns.includes('TOTAL PENJUALAN (RP)') && <td>{formatRupiah(sale.grand_total)}</td>}
                    {visibleColumns.includes('METODE PEMBAYARAN') && <td>{sale.note?.split('Pembayaran: ')?.[1]?.split(' |')?.[0] || sale.note?.split('Metode bayar: ')?.[1]?.split(' |')?.[0] || 'Tunai'}</td>}
                    {visibleColumns.includes('BAYAR') && <td>{sale.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}</td>}
                    {visibleColumns.includes('ORDER') && <td>Selesai</td>}
                    <td><button style={{color: 'var(--brand)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600}} onClick={() => setSelectedSale(sale)}>Detail</button></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {sales.length === 0 && <EmptyModuleState type="report" />}
        <div className="report-updated">Terakhir diperbarui {lastUpdated}</div>
      </section>

      {filterOpen ? (
        <div className="modal-backdrop">
          <div className="report-dialog filter-report-dialog">
            <header>
              <h2>Filter Laporan</h2>
              <button onClick={() => setFilterOpen(false)}><X size={18} /></button>
            </header>
            <div className="filter-dialog-body">
              <nav>
                {Object.keys(detailFilterGroups).map((group) => (
                  <button key={group} className={group === activeFilter ? 'active' : ''} onClick={() => setActiveFilter(group)}>
                    {group}
                  </button>
                ))}
              </nav>
              <section>
                <label>{activeFilter}</label>
                <div className="check-list">
                  {detailFilterGroups[activeFilter].map((item) => (
                    <label key={item}>
                      <input
                        type="checkbox"
                        checked={(filterValues[activeFilter] || []).includes(item)}
                        onChange={(event) => {
                          setFilterValues((current) => {
                            const selected = current[activeFilter] || []
                            return {
                              ...current,
                              [activeFilter]: event.target.checked
                                ? [...selected, item]
                                : selected.filter((value) => value !== item),
                            }
                          })
                        }}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
            <footer>
              <button onClick={() => setFilterOpen(false)}>Batal</button>
              <Button onClick={applyFilters}>Atur</Button>
            </footer>
          </div>
        </div>
      ) : null}

      {tableOpen ? (
        <div className="modal-backdrop">
          <div className="report-dialog table-dialog">
            <header>
              <h2>Atur Tabel</h2>
              <button onClick={() => setTableOpen(false)}><X size={18} /></button>
            </header>
            <p>Pilih kolom yang ingin ditampilkan pada tabel detail penjualan.</p>
            <div className="column-check-grid">
              {detailColumns.map((column) => (
                <label key={column}>
                  <input type="checkbox" checked={visibleColumns.includes(column)} onChange={() => toggleColumn(column)} />
                  <span>{column}</span>
                </label>
              ))}
            </div>
            <footer>
              <button onClick={() => setVisibleColumns(detailColumns)}>Reset</button>
              <Button onClick={() => { setTableOpen(false); toast.success('Pengaturan tabel disimpan') }}>Simpan</Button>
            </footer>
          </div>
        </div>
      ) : null}

      {selectedSale && (
        <ReceiptModal
          sale={selectedSale}
          details={(posData.salesDetails || []).filter((d) => d.stran_id === selectedSale.stran_id)}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </main>
  )
}

function ReceiptModal({ sale, details, onClose }) {
  const isLunas = sale.payment_status === 'paid'
  const subtotal = details.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0)
  const discount = details.reduce((sum, item) => sum + Number(item.discount || 0), 0)
  
  return (
    <div className="modal-backdrop">
      <div className="report-dialog receipt-dialog" style={{ width: 420, padding: 0, overflow: 'hidden' }}>
        <header style={{ background: 'var(--brand)', color: '#fff', padding: '16px 20px' }}>
          <h2 style={{ margin: 0, fontSize: 18, color: '#fff' }}>Detail Transaksi</h2>
          <button onClick={onClose} style={{ color: '#fff' }}><X size={20} /></button>
        </header>
        
        <div style={{ padding: '24px 30px', background: '#f8fafc', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: 50, background: isLunas ? '#e0f2fe' : '#fef08a', color: isLunas ? '#0284c7' : '#ca8a04', marginBottom: 12 }}>
                <CircleDollarSign size={32} />
              </div>
              <h3 style={{ margin: 0, fontSize: 22, color: '#1e293b' }}>{formatRupiah(sale.grand_total)}</h3>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{isLunas ? 'Transaksi Lunas' : 'Belum Lunas'}</p>
            </div>

            <div style={{ display: 'grid', gap: 10, fontSize: 13, color: '#475569', paddingBottom: 16, borderBottom: '1px dashed #cbd5e1', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>No. Transaksi</span>
                <strong style={{ color: '#1e293b' }}>{sale.m_stran?.tran_no || sale.tran_no || shortId(sale.stran_id)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Waktu</span>
                <strong style={{ color: '#1e293b' }}>{new Date(sale.m_stran?.tran_date || sale.created_at).toLocaleString('id-ID')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Metode Pembayaran</span>
                <strong style={{ color: '#1e293b' }}>{sale.note?.split('Pembayaran: ')?.[1]?.split(' |')?.[0] || sale.note?.split('Metode bayar: ')?.[1]?.split(' |')?.[0] || 'Tunai'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Kasir</span>
                <strong style={{ color: '#1e293b' }}>{sale.m_stran?.created_by || 'Admin'}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 16, borderBottom: '1px dashed #cbd5e1', paddingBottom: 16 }}>
              {details.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#1e293b', fontWeight: 600 }}>{item.item_name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{item.qty} x {formatRupiah(item.price)}</div>
                  </div>
                  <strong style={{ color: '#1e293b' }}>{formatRupiah(item.total)}</strong>
                </div>
              ))}
              {details.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Detail item tidak tersedia</p>}
            </div>

            <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal || sale.grand_total)}</span>
              </div>
              {(discount > 0 || sale.total_discount > 0) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                  <span>Diskon</span>
                  <span>-{formatRupiah(discount || sale.total_discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: '#1e293b', marginTop: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                <span>Total</span>
                <span>{formatRupiah(sale.grand_total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <footer style={{ padding: '16px 20px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          <Button onClick={() => toast.success('Struk dicetak')}><Printer size={16} /> Cetak Struk</Button>
        </footer>
      </div>
    </div>
  )
}

const periodColumns = [
  'PERIODE',
  'PENJUALAN (RP)',
  'LABA KOTOR (RP)',
  'TOTAL PRODUK',
  'TOTAL TRANSAKSI',
  'PENGEMBALIAN (RP)',
  'KOMISI (RP)',
  'ORDER/TRANSAKSI (RP)',
  'PRODUK/TRANSAKSI',
]

const periodMetrics = [
  ['Total Penjualan', 'Rp 0'],
  ['Total Laba Kotor', 'Rp 0'],
  ['Total Transaksi', '0'],
  ['Total Produk', '0'],
]

const orderTypeOptions = [
  'Semua Jenis Order',
  'Bukalapak',
  'Bungkus',
  'Consumer',
  'Delivery',
  'Drive Thru',
  'Free Table',
  'Go-Food',
  'Gofood',
  'Grab Food',
  'Invoice',
  'Jasa',
  'Kiosk',
  'Lainnya',
  'ManTechQ Order',
  'Ojek Online',
  'Quick Service',
  'Reservasi',
  'Self Order',
  'Shopee',
  'Table',
  'Tokopedia',
]

function SalesPeriodReportPage() {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [periodOpen, setPeriodOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [periodType, setPeriodType] = useState('Hari')
  const [orderType, setOrderType] = useState('Semua Jenis Order')
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(true)

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Penjualan per periode diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Penjualan Per Periode ${format} disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-period-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card">
        <div className="sales-detail-head">
          <div>
            <h1>Penjualan Per Periode</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line period-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
          <ReportSelectDropdown
            value={periodType}
            options={['Jam', 'Hari', 'Minggu', 'Bulan', 'Tahun']}
            open={periodOpen}
            setOpen={setPeriodOpen}
            onSelect={(value) => {
              setPeriodType(value)
              toast.info(`Periode: ${value}`)
            }}
          />
          <ReportSelectDropdown
            value={orderType}
            options={orderTypeOptions}
            open={orderOpen}
            setOpen={setOrderOpen}
            onSelect={(value) => {
              setOrderType(value)
              toast.info(value)
            }}
            wide
          />
        </div>

        <section className="period-chart-section">
          <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
            <span>Grafik Penjualan Per Periode</span>
            <strong>{chartOpen ? 'Sembunyikan' : 'Tampilkan'}</strong>
            <ChevronDown size={18} />
          </button>
          {chartOpen ? (
            <div className="period-chart-box" aria-label="Grafik Penjualan Per Periode">
              <div className="chart-grid-lines">
                <span>1</span>
                <span>0.5</span>
                <span>0</span>
              </div>
              <div className="chart-legend">
                <span><i /> Total Penjualan</span>
                <span><i /> Laba Kotor</span>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-metrics-grid period-metrics-grid">
          {periodMetrics.map(([label, value]) => (
            <article key={label} className="detail-metric-card">
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

        <div className="detail-table-wrap">
          <table className="detail-report-table period-report-table">
            <thead>
              <tr>
                {periodColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
          </table>
          <EmptyModuleState type="report" />
        </div>
      </section>
    </main>
  )
}

function ReportSelectDropdown({ value, options, open, setOpen, onSelect, wide }) {
  return (
    <div className={cn('select-dropdown-wrap', wide && 'wide-select-wrap')}>
      <button className="select-button detail-time-select" onClick={() => setOpen((current) => !current)}>
        <span>{value}</span>
        <ChevronDown size={15} />
      </button>
      {open ? (
        <div className={cn('simple-select-menu', wide && 'wide-select-menu')}>
          {options.map((item) => (
            <button
              key={item}
              className={item === value ? 'active' : ''}
              onClick={() => {
                onSelect(item)
                setOpen(false)
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const outletReportColumns = [
  'OUTLET',
  'PENJUALAN (RP)',
  'LABA KOTOR (RP)',
  'JUMLAH PRODUK',
  'JUMLAH TRANSAKSI',
  'PENJUALAN %',
  'LABA KOTOR %',
  'PRODUK %',
  'TRANSAKSI (%)',
  'PENJUALAN/TRANSAKSI (RP)',
  'PRODUK/TRANSAKSI',
]

function SalesOutletReportPage() {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [periodOpen, setPeriodOpen] = useState(false)
  const [metricOpen, setMetricOpen] = useState(false)
  const [orderType, setOrderType] = useState('Semua Jenis Order')
  const [periodType, setPeriodType] = useState('Hari')
  const [chartMetric, setChartMetric] = useState('Penjualan')
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(true)

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Penjualan outlet diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Penjualan Outlet ${format} disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Penjualan Outlet</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
          <ReportSelectDropdown
            value={orderType}
            options={orderTypeOptions}
            open={orderOpen}
            setOpen={setOrderOpen}
            onSelect={(value) => {
              setOrderType(value)
              toast.info(value)
            }}
            wide
          />
        </div>

        <section className="outlet-kpi-strip">
          <div className="outlet-main-kpi">
            <h2>Rp 0</h2>
            <p>Total Penjualan</p>
          </div>
          <div>
            <strong>Rp 0</strong>
            <span>Laba Kotor</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Transaksi</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Produk Terjual</span>
          </div>
        </section>

        <section className="period-chart-section outlet-chart-section">
          <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
            <span>Grafik Penjualan Outlet</span>
            <strong>{chartOpen ? 'Sembunyikan' : 'Tampilkan'}</strong>
            <ChevronDown size={18} />
          </button>
          {chartOpen ? (
            <div className="outlet-chart-body">
              <div className="outlet-chart-controls">
                <ReportSelectDropdown
                  value={periodType}
                  options={['Jam', 'Hari', 'Minggu', 'Bulan', 'Tahun']}
                  open={periodOpen}
                  setOpen={setPeriodOpen}
                  onSelect={(value) => {
                    setPeriodType(value)
                    toast.info(`Grafik: ${value}`)
                  }}
                />
                <ReportSelectDropdown
                  value={chartMetric}
                  options={['Penjualan', 'Laba', 'Transaksi', 'Produk']}
                  open={metricOpen}
                  setOpen={setMetricOpen}
                  onSelect={(value) => {
                    setChartMetric(value)
                    toast.info(`Metrik grafik: ${value}`)
                  }}
                />
              </div>
              <div className="period-chart-box outlet-chart-box" aria-label="Grafik Penjualan Outlet">
                <div className="chart-grid-lines">
                  <span>1</span>
                  <span>0.5</span>
                  <span>0</span>
                </div>
                <div className="chart-legend">
                  <span><i /> {chartMetric}</span>
                  <span><i /> Software House</span>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-table-wrap">
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {outletReportColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
          </table>
          <EmptyModuleState type="report" />
        </div>
      </section>
    </main>
  )
}

const reportFilterOptions = {
  category: ['Semua Kategori', 'Makanan', 'Minuman', 'Paket Hemat', 'Retail'],
  department: ['Semua Departemen', 'Food', 'Beverage', 'Service', 'Retail'],
  orderType: orderTypeOptions,
  productType: ['Semua Jenis Produk', 'Produk Barang', 'Produk Jasa', 'Produk Paket', 'Produk Ekstra'],
  cashierPay: ['Kasir Bayar', 'Kasir Order', 'Kasir Void'],
  outlet: ['Pilih Outlet', 'Software House', 'Semua Outlet'],
  product: ['Pilih Produk', 'Produk Utama', 'Paket Hemat', 'Layanan'],
  type: ['Semua Tipe', 'Masuk', 'Keluar', 'Penyesuaian'],
  status: ['Semua Status', 'Berhasil', 'Gagal', 'Diproses', 'Tertunda'],
  transactionType: ['Semua Jenis Transaksi', 'Pemasukan', 'Penarikan'],
}

function MajooGenericReportPage({ config, posData }) {
  const defaultRange = config.singleDate
    ? { label: '06 Juni 2026', display: '06 Juni 2026', startTime: '00:00', endTime: '23:59' }
    : { label: '01 Jun 2026 - 30 Jun 2026', display: '01 Juni 2026 - 30 Juni 2026', startTime: '00:00', endTime: '23:59' }
  const [range, setRange] = useState(defaultRange)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(config.variant !== 'tableOnly' && config.variant !== 'settlementOnline')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [metricOpen, setMetricOpen] = useState(false)
  const [periodType, setPeriodType] = useState('Hari')
  const [metricType, setMetricType] = useState('Penjualan')
  const [activeTab, setActiveTab] = useState(config.tabs?.[0] || '')
  const [tableOpen, setTableOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(config.columns)
  const [dropdowns, setDropdowns] = useState({})
  const [lastUpdated, setLastUpdated] = useState('beberapa detik yang lalu')

  // Calculate dynamic rows based on config.title
  const sales = posData?.sales || []
  const shifts = posData?.shifts || []
  
  let liveRows = config.rows || []
  let liveMetrics = config.metrics || []

  if (config.title === 'Laporan Kas Kasir') {
    liveRows = shifts.map(shift => ({
      'TRANSAKSI': '1',
      'TANGGAL': new Date(shift.created_at).toLocaleString('id-ID'),
      'OUTLET': `Outlet ${shortId(shift.outlet_id)}`,
      'MASUK (RP)': formatRupiah(shift.opening_amount),
      'KELUAR (RP)': formatRupiah(shift.closing_amount),
      'KATEGORI': 'Penjualan',
      'NAMA LOGIN': shift.cashier_name || 'Kasir',
      'NAMA DEVICE': 'POS Terminal',
    }))
    
    const totalMasuk = shifts.reduce((sum, s) => sum + Number(s.opening_amount || 0), 0)
    const totalKeluar = shifts.reduce((sum, s) => sum + Number(s.closing_amount || 0), 0)
    
    liveMetrics = [
      ['Total Kas Kasir', formatRupiah(totalMasuk - totalKeluar), 'green'],
      ['Total Uang Masuk', formatRupiah(totalMasuk), 'blue'],
      ['Total Uang Keluar', formatRupiah(totalKeluar), 'red']
    ]
  } else if (config.title === 'Penjualan per Kasir') {
    const cashierGroups = sales.reduce((acc, sale) => {
      const cashier = sale.m_stran?.created_by || 'Kasir Default'
      if (!acc[cashier]) acc[cashier] = { total: 0, count: 0, outlet: sale.m_stran?.outlet_id }
      acc[cashier].total += Number(sale.grand_total || 0)
      acc[cashier].count += 1
      return acc
    }, {})
    
    const totalSales = Object.values(cashierGroups).reduce((sum, g) => sum + g.total, 0)
    
    liveRows = Object.entries(cashierGroups).map(([cashier, data]) => ({
      'KASIR': cashier,
      'OUTLET': `Outlet ${shortId(data.outlet)}`,
      'PENJUALAN (RP)': formatRupiah(data.total),
      'PENJUALAN (%)': totalSales > 0 ? ((data.total / totalSales) * 100).toFixed(2) + '%' : '0%',
      'LABA KOTOR (RP)': formatRupiah(data.total),
      'LABA KOTOR (%)': totalSales > 0 ? ((data.total / totalSales) * 100).toFixed(2) + '%' : '0%',
      'JUMLAH TRANSAKSI': String(data.count)
    }))
  } else if (config.title === 'Penjualan per Terminal') {
    const terminalGroups = sales.reduce((acc, sale) => {
      const terminal = 'POS Terminal 1'
      if (!acc[terminal]) acc[terminal] = { total: 0, count: 0, items: 0, outlet: sale.m_stran?.outlet_id }
      acc[terminal].total += Number(sale.grand_total || 0)
      acc[terminal].count += 1
      acc[terminal].items += sale.items?.length || 1
      return acc
    }, {})
    
    liveRows = Object.entries(terminalGroups).map(([terminal, data]) => ({
      'TERMINAL': terminal,
      'OUTLET': `Outlet ${shortId(data.outlet)}`,
      'PENJUALAN (RP)': formatRupiah(data.total),
      'LABA KOTOR (RP)': formatRupiah(data.total),
      'JUMLAH TRANSAKSI': String(data.count),
      'JUMLAH PRODUK': String(data.items),
      'PENGEMBALIAN (RP)': 'Rp 0'
    }))
  } else if (config.title === 'Laporan Tutup Kasir') {
    liveRows = shifts.map(shift => ({
      'WAKTU BUKA / TUTUP KASIR': `${new Date(shift.start_time).toLocaleString('id-ID')} / ${shift.end_time ? new Date(shift.end_time).toLocaleString('id-ID') : '-'}`,
      'KASIR': shift.cashier_name || 'Kasir',
      'OUTLET': `Outlet ${shortId(shift.outlet_id)}`,
      'MODAL AWAL (RP)': formatRupiah(shift.opening_amount),
      'SALDO AKHIR (RP)': formatRupiah(shift.expected_amount || shift.opening_amount),
      'TOTAL TUNAI AKTUAL (RP)': formatRupiah(shift.closing_amount || shift.opening_amount),
      'TOTAL PENERIMAAN NON TUNAI (RP)': 'Rp 0'
    }))
  } else if (config.title === 'Laporan Tutup Toko') {
    liveRows = shifts.filter(s => s.status === 'closed').map(shift => ({
      'TANGGAL': new Date(shift.end_time || shift.created_at).toLocaleString('id-ID'),
      'OUTLET': `Outlet ${shortId(shift.outlet_id)}`,
      'KASIR': shift.cashier_name || 'Kasir',
      'TOTAL PENJUALAN': formatRupiah((shift.closing_amount || 0) - (shift.opening_amount || 0)),
      'SELISIH KAS': formatRupiah((shift.closing_amount || 0) - (shift.expected_amount || 0)),
      'STATUS': 'Selesai'
    }))
  }

  useEffect(() => {
    setRange(defaultRange)
    setVisibleColumns(config.columns)
    setActiveTab(config.tabs?.[0] || '')
    setChartOpen(config.variant !== 'tableOnly' && config.variant !== 'settlementOnline')
    setDropdowns({})
    setLastUpdated('beberapa detik yang lalu')
  }, [config])

  const processRange = (nextRange) => {
    setRange(config.singleDate ? { ...nextRange, label: nextRange.display.split(' - ')[0], display: nextRange.display.split(' - ')[0] } : nextRange)
    setCalendarOpen(false)
    setLastUpdated('baru saja')
    toast.success(`${config.title} diproses`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor ${config.title} ${format} disiapkan`)
  }

  const toggleColumn = (column) => {
    setVisibleColumns((current) => {
      if (current.includes(column)) return current.length === 1 ? current : current.filter((item) => item !== column)
      return config.columns.filter((item) => current.includes(item) || item === column)
    })
  }

  const renderFilter = (filterKey) => {
    const options = reportFilterOptions[filterKey] || ['Semua']
    const value = dropdowns[filterKey] || options[0]
    return (
      <ReportSelectDropdown
        key={filterKey}
        value={value}
        options={options}
        open={dropdowns[`${filterKey}Open`] || false}
        setOpen={(updater) => setDropdowns((current) => ({ ...current, [`${filterKey}Open`]: typeof updater === 'function' ? updater(current[`${filterKey}Open`] || false) : updater }))}
        onSelect={(nextValue) => {
          setDropdowns((current) => ({ ...current, [filterKey]: nextValue }))
          setLastUpdated('baru saja')
          toast.info(nextValue)
        }}
        wide={filterKey === 'orderType' || filterKey === 'product'}
      />
    )
  }

  if (config.variant === 'settlementOnline') {
    return (
      <main className="content report-summary-page">
        <section className="panel report-summary-card sales-period-card generic-report-card online-report-card">
          <div className="online-balance-head">
            <div>
              <h1>{config.title}</h1>
              <p>Total Saldo Merchant <Info size={14} /></p>
              <strong>Rp 0</strong>
            </div>
            <div>
              <Button variant="link">Detail Saldo</Button>
              <Button variant="link">Info Penarikan Saldo</Button>
              <Button>Tarik Saldo</Button>
            </div>
          </div>
          <div className="online-balance-grid">
            <article><strong>Rp 0</strong><span>Saldo Ditahan</span><Button variant="link">Lihat Mutasi</Button></article>
            <article><strong>Rp 0</strong><span>Saldo Pelanggan</span><Button variant="link">Detail Saldo</Button></article>
          </div>
        </section>
        <section className="panel report-summary-card sales-period-card generic-report-card">
          <GenericReportHeader config={{ ...config, title: 'Riwayat Saldo' }} range={range} exportOpen={exportOpen} setExportOpen={setExportOpen} exportReport={exportReport} hideExport />
          <GenericReportFilters config={config} query={query} setQuery={setQuery} range={range} calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} processRange={processRange} renderFilter={renderFilter} />
          <GenericMetrics metrics={config.metrics} />
          <GenericReportTable columns={visibleColumns} />
        </section>
      </main>
    )
  }

  return (
    <main className="content report-summary-page sales-period-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card generic-report-card">
        <GenericReportHeader config={config} range={range} exportOpen={exportOpen} setExportOpen={setExportOpen} exportReport={exportReport} onTable={() => setTableOpen(true)} />
        {config.info ? <div className="info-banner report-info-banner"><Info size={16} /> {config.info}</div> : null}
        {config.tabs?.length ? (
          <div className="generic-tabs" role="tablist" aria-label={`${config.title} tab`}>
            {config.tabs.map((tabName) => (
              <button
                key={tabName}
                className={tabName === activeTab ? 'active' : ''}
                onClick={() => {
                  setActiveTab(tabName)
                  setLastUpdated('baru saja')
                }}
              >
                {tabName}
              </button>
            ))}
          </div>
        ) : null}
        <GenericReportFilters config={config} query={query} setQuery={setQuery} range={range} calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} processRange={processRange} renderFilter={renderFilter} />
        {config.variant !== 'tableOnly' ? (
          <section className="period-chart-section">
            <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
              <span>{config.chartTitle || `Grafik ${config.title}`}</span>
              <strong>{chartOpen ? 'Sembunyikan' : 'Tampilkan'}</strong>
              <ChevronDown size={18} />
            </button>
            {chartOpen ? (
              <div className="generic-chart-body">
                <div className="outlet-chart-controls">
                  <ReportSelectDropdown value={periodType} options={['Jam', 'Hari', 'Minggu', 'Bulan', 'Tahun']} open={periodOpen} setOpen={setPeriodOpen} onSelect={setPeriodType} />
                  <ReportSelectDropdown value={metricType} options={['Penjualan', 'Laba Kotor', 'Transaksi', 'Produk']} open={metricOpen} setOpen={setMetricOpen} onSelect={setMetricType} />
                </div>
                <div className="period-chart-box generic-chart-box" aria-label={config.chartTitle || `Grafik ${config.title}`}>
                  <div className="chart-grid-lines">
                    <span>Rp 200</span>
                    <span>Rp 150</span>
                    <span>Rp 100</span>
                    <span>Rp 50</span>
                    <span>0</span>
                  </div>
                  <div className="chart-dates">
                    {['01 Jun', '03 Jun', '05 Jun', '07 Jun', '09 Jun', '11 Jun', '13 Jun', '15 Jun', '17 Jun', '19 Jun', '21 Jun', '23 Jun', '25 Jun', '27 Jun', '30 Jun'].map((day) => <span key={day}>{day}</span>)}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
        <GenericMetrics metrics={config.metrics} />
        <GenericReportTable columns={visibleColumns} rows={liveRows} />
        <div className="report-updated">Terakhir diperbarui {lastUpdated}</div>
      </section>
      {tableOpen ? (
        <div className="modal-backdrop">
          <div className="report-dialog table-dialog">
            <header>
              <h2>Atur Tabel</h2>
              <button onClick={() => setTableOpen(false)}><X size={18} /></button>
            </header>
            <p>Pilih kolom yang ingin ditampilkan pada {config.title}.</p>
            <div className="column-check-grid">
              {config.columns.map((column) => (
                <label key={column}>
                  <input type="checkbox" checked={visibleColumns.includes(column)} onChange={() => toggleColumn(column)} />
                  <span>{column}</span>
                </label>
              ))}
            </div>
            <footer>
              <button onClick={() => setVisibleColumns(config.columns)}>Reset</button>
              <Button onClick={() => { setTableOpen(false); toast.success('Pengaturan tabel disimpan') }}>Simpan</Button>
            </footer>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function GenericReportHeader({ config, range, exportOpen, setExportOpen, exportReport, onTable, hideExport }) {
  const [favorite, setFavorite] = useState(false)
  return (
    <div className="sales-detail-head generic-report-head">
      <div>
        <div className="report-title-row">
          <h1>{config.title}</h1>
          <button className="icon-link" onClick={() => toast.info(`Bantuan ${config.title}`)} aria-label={`Bantuan ${config.title}`}>
            <HelpCircle size={19} />
          </button>
          <button className={cn('icon-link favorite', favorite && 'active')} onClick={() => setFavorite((value) => !value)} aria-label="Favorit">
            <Star size={21} />
          </button>
        </div>
        <p><CalendarDays size={16} /> {range.display}</p>
      </div>
      <div className="sales-detail-actions">
        {(config.tableSettings || onTable) && !hideExport ? (
          <Button variant="outline" onClick={onTable}>
            <Settings size={16} />
            Atur Tabel
          </Button>
        ) : null}
        {!hideExport ? <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} /> : null}
      </div>
    </div>
  )
}

function GenericReportFilters({ config, query, setQuery, range, calendarOpen, setCalendarOpen, processRange, renderFilter }) {
  return (
    <div className="detail-filter-line generic-filter-line">
      <label className="detail-search">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ..." />
      </label>
      <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
      {(config.filters || []).map(renderFilter)}
      {config.helper ? <small className="filter-helper">{config.helper}</small> : null}
    </div>
  )
}

function GenericMetrics({ metrics = [] }) {
  if (!metrics.length) return null
  return (
    <div className="generic-metrics-grid">
      {metrics.map(([label, value, tone = 'green']) => (
        <ReportMetricCard key={label} label={label} value={value} tone={tone} />
      ))}
    </div>
  )
}

function GenericReportTable({ columns, rows = [] }) {
  const [detailRow, setDetailRow] = useState(null)

  return (
    <div className="detail-table-wrap generic-table-wrap">
      <table className="detail-report-table generic-report-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th>+</th>
          </tr>
        </thead>
        {rows?.length > 0 && (
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((column, j) => (
                  <td key={j}>{row[column] || '-'}</td>
                ))}
                <td><button onClick={() => setDetailRow(row)} style={{color: 'var(--primary-color)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600}}>Detail</button></td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {(!rows || rows.length === 0) && <EmptyModuleState type="report" />}

      {detailRow && createPortal(
        <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out'}}>
          <div className="modal-content" style={{background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto', position: 'relative', animation: 'slideUp 0.3s ease-out', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
            <button onClick={() => setDetailRow(null)} style={{position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer'}}><X size={24} color="#666"/></button>
            <h3 style={{marginTop: 0, marginBottom: 24, fontSize: 20, color: '#2b2b2b', fontWeight: 700}}>Detail Informasi</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              {columns.map(col => (
                <div key={col} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: 12}}>
                  <span style={{color: '#737373', fontSize: 13, fontWeight: 500}}>{col}</span>
                  <strong style={{color: '#2b2b2b', fontSize: 14, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word'}}>{detailRow[col] || '-'}</strong>
                </div>
              ))}
            </div>
            <div style={{marginTop: 32, display: 'flex', justifyContent: 'flex-end'}}>
              <Button onClick={() => setDetailRow(null)}>Tutup Detail</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function ProductDirectoryPage({ config, onStartFlow, posData }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Semua')
  const [favorite, setFavorite] = useState(false)
  const liveRows = config.title === 'Daftar Produk' ? mapStockToProductRows(posData.stockItems || []) : config.rows || []
  const rows = liveRows.filter((row) => {
    const matchesQuery = row.join(' ').toLowerCase().includes(query.toLowerCase())
    const statusText = row.join(' ')
    const matchesStatus = status === 'Semua' || statusText.includes(status)
    return matchesQuery && matchesStatus
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, orgId, name }

  const runAction = (action) => {
    if (action === 'Tambah Produk' || action === 'Tambah Bahan Baku') {
      setEditingProduct(null)
      setShowAddModal(true)
    } else if (action.toLowerCase().includes('impor')) {
      toast.success(`${action} dibuka`)
    } else {
      toast.success(`${action} disiapkan`)
    }
  }

  return (
    <main className="content product-page">
      {showAddModal && (
        <ProductFormModal 
          posData={posData} 
          initialData={editingProduct}
          onClose={() => setShowAddModal(false)} 
          onSuccess={async () => {
            setShowAddModal(false)
            if (posData?.refresh) {
              await posData.refresh()
            }
          }} 
        />
      )}
      <CapitalBanner compact />
      <section className="panel product-directory-card">
        <header className="product-directory-head">
          <div>
            <div className="report-title-row">
              <h1>{config.title}</h1>
              <button className="icon-link" onClick={() => toast.info(`Bantuan ${config.title}`)} aria-label={`Bantuan ${config.title}`}>
                <HelpCircle size={19} />
              </button>
              <button className={cn('icon-link favorite', favorite && 'active')} onClick={() => setFavorite((value) => !value)} aria-label="Favorit">
                <Star size={21} />
              </button>
            </div>
            {config.subtitle ? <p>{config.subtitle}</p> : null}
          </div>
          <div className="product-directory-actions">
            {(config.actions || []).map((action) => (
              <Button key={action} variant="link" onClick={() => runAction(action)}>
                {action.toLowerCase().includes('impor') ? <Upload size={16} /> : <Download size={16} />}
                {action}
              </Button>
            ))}
            {config.addLabel ? (
              <Button onClick={() => {
                if (config.addLabel === 'Tambah Produk' || config.addLabel === 'Tambah Bahan Baku') {
                  setShowAddModal(true)
                } else if (config.addFlow) {
                  onStartFlow(config.addFlow)
                } else {
                  toast.success(config.addLabel)
                }
              }}>
                <Plus size={18} />
                {config.addLabel}
              </Button>
            ) : null}
          </div>
        </header>

        <div className="product-directory-toolbar">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ..." />
          </label>
          {(config.filters || []).map((filter) => (
            <SelectButton key={filter} label={filter} />
          ))}
          <div className="radio-tabs product-status-tabs" role="tablist" aria-label="Status produk">
            {['Semua', 'Tampil di Menu', 'Tidak Tampil di Menu'].map((item) => (
              <button
                key={item}
                className={item === status ? 'active' : ''}
                onClick={() => {
                  setStatus(item)
                  toast.info(item)
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="product-table-wrap">
          <table className="product-table">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column || 'action'}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${row[0]}-${rowIndex}`}>
                  {row.map((cell, index) => {
                    const isStatus = typeof cell === 'string' && cell.includes('Tampil di Menu')
                    const isAction = index === row.length - 1
                    return (
                      <td key={`${index}`}>
                        {isStatus ? <span className="status-pill">{cell}</span> : isAction ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button className="icon-link" onClick={() => {
                              setEditingProduct(cell.item)
                              setShowAddModal(true)
                            }} aria-label="Edit Produk"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                            <button className="icon-link" onClick={() => {
                              setConfirmDelete({
                                id: cell.id,
                                orgId: cell.orgId,
                                name: cell.item?.item_name || 'produk ini',
                              })
                            }} aria-label="Hapus Produk"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button>
                          </div>
                        ) : cell?.type === 'photo' ? (
                          cell.url ? <img src={cell.url} alt={cell.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} /> : <div style={{ width: 44, height: 44, borderRadius: 6, background: '#f0f0f0', display: 'grid', placeItems: 'center', fontSize: 10, color: '#aaa' }}>-</div>
                        ) : cell}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <EmptyModuleState type="master" /> : null}
          <ConfirmModal
            open={!!confirmDelete}
            title="Hapus Produk?"
            message={<>Anda akan menghapus <strong>"{confirmDelete?.name}"</strong>. Tindakan ini tidak dapat dibatalkan.</>}
            confirmLabel="Ya, Hapus"
            cancelLabel="Batal"
            variant="danger"
            onCancel={() => setConfirmDelete(null)}
            onConfirm={async () => {
              const target = confirmDelete
              setConfirmDelete(null)
              try {
                await deleteProduct(target.id, target.orgId)
                toast.success('Produk berhasil dihapus')
                if (posData?.refresh) await posData.refresh()
              } catch (e) {
                toast.error('Gagal menghapus produk')
              }
            }}
          />
        </div>

        <footer className="product-pagination">
          <div>
            <span>Tampilkan:</span>
            <button>10 <ChevronDown size={14} /></button>
            <span>{rows.length ? `Ditampilkan 1 - ${Math.min(rows.length, 10)} dari ${rows.length} data` : config.pagination || 'Ditampilkan 0 - 0 dari 0 data'}</span>
          </div>
          <nav aria-label="Pagination">
            <button><ChevronLeft size={17} /> Sebelumnya</button>
            <strong>1</strong>
            <button>Selanjutnya <ChevronRight size={17} /></button>
          </nav>
        </footer>
      </section>
    </main>
  )
}

function TransactionPage({ posData, session }) {
  const outletOptions = posData.memberships.map(membershipOutletLabel)
  const firstOutlet = outletOptions[0] || ''
  const [selectedOutlet, setSelectedOutlet] = useState(firstOutlet)
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodOptions[0])
  const [paymentStatus, setPaymentStatus] = useState('paid')
  const [discountTotal, setDiscountTotal] = useState('0')
  const [taxTotal, setTaxTotal] = useState('0')
  const [note, setNote] = useState('')
  const [orderType, setOrderType] = useState('Dine-in')
  const [tableNumber, setTableNumber] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (selectedOutlet || !firstOutlet) return
    setSelectedOutlet(firstOutlet)
  }, [firstOutlet, selectedOutlet])

  const membership = posData.memberships.find((item) => membershipOutletLabel(item) === selectedOutlet) || posData.memberships[0]
  const outletStock = (posData.stockItems || []).filter((item) => item.outlet_id === membership?.outlet_id && item.is_active)
  const filteredStock = outletStock.filter((item) => {
    const text = `${item.item_name} ${item.sku} ${item.category_name || ''}`.toLowerCase()
    return text.includes(query.toLowerCase())
  })
  const subtotal = cart.reduce((sum, item) => sum + Math.max((item.qty * item.price) - item.discount, 0), 0)
  const discountValue = parseCurrencyInput(discountTotal)
  const taxValue = parseCurrencyInput(taxTotal)
  const grandTotal = Math.max(subtotal - discountValue + taxValue, 0)

  const addToCart = (item) => {
    const stockQty = Number(item.qty_on_hand || 0)
    if (stockQty <= 0) {
      toast.error('Stok produk ini kosong. Tambahkan stok dulu sebelum dijual.')
      return
    }

    setCart((current) => {
      const existing = current.find((row) => row.id === item.id)
      if (existing) {
        if (existing.qty + 1 > stockQty) {
          toast.error('Qty melebihi stok tersedia.')
          return current
        }
        return current.map((row) => (row.id === item.id ? { ...row, qty: row.qty + 1 } : row))
      }
      return [
        ...current,
        {
          id: item.id,
          sku: item.sku,
          item_name: item.item_name,
          unit: item.unit || 'Pcs',
          stock: stockQty,
          qty: 1,
          price: Number(item.sell_price || 0),
          discount: 0,
        },
      ]
    })
  }

  const updateCartItem = (id, field, value) => {
    setCart((current) => current.map((item) => {
      if (item.id !== id) return item
      const parsed = field === 'qty' ? Number(value || 0) : parseCurrencyInput(value)
      const nextValue = field === 'qty' ? Math.min(Math.max(parsed, 1), item.stock) : Math.max(parsed, 0)
      return { ...item, [field]: nextValue }
    }))
  }

  const removeCartItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const resetTransaction = () => {
    setCart([])
    setDiscountTotal('0')
    setTaxTotal('0')
    setNote('')
    setPaymentMethod(paymentMethodOptions[0])
    setPaymentStatus('paid')
  }

  const holdOrder = () => {
    if (!cart.length) return toast.error('Keranjang kosong')
    const holdData = { cart, discountTotal, taxTotal, note }
    const existingHolds = JSON.parse(localStorage.getItem('pos_held_orders') || '[]')
    existingHolds.push({ id: Date.now(), label: `Hold ${new Date().toLocaleTimeString('id-ID')}`, data: holdData })
    localStorage.setItem('pos_held_orders', JSON.stringify(existingHolds))
    toast.success('Pesanan berhasil disimpan')
    resetTransaction()
  }

  const loadHoldOrder = (hold) => {
    setCart(hold.data.cart || [])
    setDiscountTotal(hold.data.discountTotal || '0')
    setTaxTotal(hold.data.taxTotal || '0')
    setNote(hold.data.note || '')
    const existingHolds = JSON.parse(localStorage.getItem('pos_held_orders') || '[]')
    localStorage.setItem('pos_held_orders', JSON.stringify(existingHolds.filter(h => h.id !== hold.id)))
    toast.success('Pesanan dilanjutkan')
  }

  const saveTransaction = async () => {
    if (!membership?.org_id || !membership?.outlet_id) {
      toast.error('Outlet belum valid untuk transaksi.')
      return
    }
    if (!cart.length) {
      toast.error('Pilih minimal satu produk.')
      return
    }
    const invalidStock = cart.find((item) => item.qty > item.stock)
    if (invalidStock) {
      toast.error(`Qty ${invalidStock.item_name} melebihi stok tersedia.`)
      return
    }

    setSaving(true)
    let saved
    try {
      saved = await createSale({
        orgId: membership.org_id,
        outletId: membership.outlet_id,
        userId: session?.user?.id,
        note: [
          `Tipe: ${orderType}`,
          orderType === 'Dine-in' && tableNumber ? `Meja: ${tableNumber}` : '',
          paymentMethod ? `Metode bayar: ${paymentMethod}` : '', 
          note.trim()
        ].filter(Boolean).join(' | '),
        discountTotal: discountValue,
        taxTotal: taxValue,
        paidTotal: paymentStatus === 'paid' ? grandTotal : 0,
        paymentStatus,
        items: cart.map((item) => ({
          st_mast_id: item.id,
          qty: item.qty,
          price: item.price,
          discount: item.discount,
        })),
      })
    } catch (error) {
      toast.error(error.message || 'Transaksi gagal disimpan.')
      setSaving(false)
      return
    }
    setSaving(false)

    toast.success(`Transaksi ${saved?.tran_no || ''} tersimpan`)
    resetTransaction()
    await posData.refresh()
  }

  return (
    <main className="content transaction-page">
      <section className="panel transaction-panel">
        <header className="transaction-head">
          <div>
            <h1>Transaksi Baru</h1>
            <p>Pilih produk dari stok outlet, hitung total, lalu simpan ke PostgreSQL.</p>
          </div>
        </header>

        <div className="transaction-meta">
          <label>
            <span>Outlet</span>
            <select value={selectedOutlet} onChange={(event) => { setSelectedOutlet(event.target.value); setCart([]) }}>
              {outletOptions.map((outlet) => <option key={outlet}>{outlet}</option>)}
            </select>
          </label>
          <label>
            <span>Metode Bayar</span>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              {paymentMethodOptions.map((method) => <option key={method}>{method}</option>)}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
              <option value="paid">Lunas</option>
              <option value="unpaid">Belum Dibayar</option>
            </select>
          </label>
          <label>
            <span>Tipe Pesanan</span>
            <select value={orderType} onChange={(event) => setOrderType(event.target.value)}>
              <option value="Dine-in">Dine-in (Makan di Tempat)</option>
              <option value="Takeaway">Takeaway (Bungkus)</option>
              <option value="Delivery">Delivery (Antar)</option>
            </select>
          </label>
          {orderType === 'Dine-in' && (
            <label>
              <span>Nomor Meja</span>
              <input value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="Contoh: 12" style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: 6 }} />
            </label>
          )}
        </div>

        <div className="transaction-layout">
          <section className="product-picker-panel" aria-label="Pilih produk">
            <div className="transaction-search">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk atau SKU" />
            </div>
            <div className="transaction-product-list">
              {filteredStock.length ? filteredStock.map((item) => {
                const stockQty = Number(item.qty_on_hand || 0)
                return (
                  <button key={item.id} className="transaction-product" onClick={() => addToCart(item)} disabled={stockQty <= 0}>
                    <span>
                      <strong>{item.item_name}</strong>
                      <small>{item.sku} - {item.category_name || 'Tanpa kategori'}</small>
                    </span>
                    <span>
                      <strong>{formatRupiah(item.sell_price)}</strong>
                      <small>Stok {formatQty(stockQty)} {item.unit || 'Pcs'}</small>
                    </span>
                  </button>
                )
              }) : (
                <div className="transaction-empty">
                  <Package size={38} />
                  <strong>Produk belum tersedia</strong>
                  <p>Tambahkan produk dan stok pada outlet ini sebelum membuat transaksi.</p>
                </div>
              )}
            </div>
          </section>

          <section className="cart-panel" aria-label="Keranjang transaksi">
            <div className="cart-title-row">
              <h2>Keranjang</h2>
              <span>{cart.length} item</span>
            </div>

            {cart.length ? (
              <div className="cart-lines">
                {cart.map((item) => {
                  const lineTotal = Math.max((item.qty * item.price) - item.discount, 0)
                  return (
                    <article className="cart-line" key={item.id}>
                      <div className="cart-line-main">
                        <div>
                          <strong>{item.item_name}</strong>
                          <small>{formatRupiah(item.price)} / {item.unit} - stok {formatQty(item.stock)}</small>
                        </div>
                        <strong>{formatRupiah(lineTotal)}</strong>
                      </div>
                      <div className="cart-line-controls">
                        <label>
                          Qty
                          <input type="number" min="1" max={item.stock} value={item.qty} onChange={(event) => updateCartItem(item.id, 'qty', event.target.value)} />
                        </label>
                        <button className="row-more" onClick={() => removeCartItem(item.id)} aria-label={`Hapus ${item.item_name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="transaction-empty cart-empty">
                <ShoppingBag size={42} />
                <strong>Belum ada item</strong>
                <p>Pilih produk di sisi kiri untuk mulai transaksi.</p>
              </div>
            )}

            <div className="transaction-summary-box">
              <label>
                Diskon Transaksi
                <input value={discountTotal} onChange={(event) => setDiscountTotal(event.target.value)} />
              </label>
              <label>
                Pajak
                <input value={taxTotal} onChange={(event) => setTaxTotal(event.target.value)} />
              </label>
              <label className="summary-note">
                Catatan
                <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Opsional" />
              </label>
              <div className="summary-total-row">
                <span>Subtotal</span>
                <strong>{formatRupiah(subtotal)}</strong>
              </div>
              <div className="summary-total-row">
                <span>Total</span>
                <strong>{formatRupiah(grandTotal)}</strong>
              </div>
              <div className="cart-actions">
                <Button variant="outline" onClick={resetTransaction} disabled={saving || !cart.length}>
                  <Trash2 size={16} /> Reset
                </Button>
                <Button variant="outline" onClick={holdOrder} disabled={saving || !cart.length}>
                  <Clock3 size={16} /> Simpan
                </Button>
                <Button onClick={saveTransaction} disabled={saving || !cart.length}>
                  <CircleDollarSign size={17} />
                  {saving ? 'Menyimpan...' : 'Bayar'}
                </Button>
              </div>
              <div className="cart-actions mt-2">
                <Button 
                  variant="outline" 
                  style={{ width: '100%' }} 
                  onClick={() => {
                    const existingHolds = JSON.parse(localStorage.getItem('pos_held_orders') || '[]')
                    if (!existingHolds.length) return toast.info('Tidak ada pesanan tersimpan')
                    const hold = existingHolds[existingHolds.length - 1]
                    loadHoldOrder(hold)
                  }}
                >
                  <ClipboardList size={16} /> Lanjutkan Pesanan Terakhir ({JSON.parse(localStorage.getItem('pos_held_orders') || '[]').length})
                </Button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function SelectButton({ label, onClick }) {
  return (
    <button className="select-button" onClick={onClick || (() => toast.info(label))}>
      <span>{label}</span>
      <ChevronDown size={15} />
    </button>
  )
}

function MiniKpi({ label, value }) {
  return (
    <div className="mini-kpi">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function BarcodePrintView({ posData }) {
  const stockItems = posData?.stockItems || []
  return (
    <main className="content">
      <CapitalBanner compact />
      <section className="panel module-page">
        <div className="majoo-page-head">
          <div className="majoo-title">
            <h1>Cetak Barcode</h1>
            <p>Pilih dan cetak barcode untuk label produk di toko fisik Anda.</p>
          </div>
          <div className="top-actions">
            <Button onClick={() => window.print()}><Printer size={16} /> Cetak (A4)</Button>
          </div>
        </div>
        <div style={{ padding: 24, background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
          <div style={{ background: '#fff', border: '1px dashed #cbd5e1', padding: 32, borderRadius: 12, minHeight: 600 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px 16px' }}>
              {stockItems.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, textAlign: 'center', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.item_name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{formatRupiah(item.price || item.sell_price || 0)}</div>
                  <img src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(item.sku || `BRC${String(idx + 1).padStart(4, '0')}`)}&scale=2&height=10&includetext`} alt="Barcode" style={{ width: '100%', height: 60, objectFit: 'contain', background: '#fff', padding: 4 }} />
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{item.sku || `BRC-${String(item.id || idx).padStart(4, '0')}`}</div>
                </div>
              ))}
              {stockItems.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                  <ScanBarcode size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>Tidak ada produk untuk dicetak.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export {
  Metric,
  EmptyModuleState,
  ModulePage,
  GenericModulePage,
  SalesSummaryReportPage,
  SalesDetailReportPage,
  SalesPeriodReportPage,
  SalesOutletReportPage,
  MajooGenericReportPage,
  ReportMetricCard,
  ReportBreakdownTable,
  ExportDropdown,
  DateRangePicker,
  GenericReportHeader,
  GenericReportFilters,
  GenericMetrics,
  GenericReportTable,
  ProductDirectoryPage,
  TransactionPage,
  SelectButton,
  MiniKpi,
  BarcodePrintView,
}
