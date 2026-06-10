import React, { useState } from 'react'
import { toast } from 'sonner'
import {
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
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import capitalVisual from '../../assets/capital-visual.png'
import { Button } from '../../shared/ui/Button.jsx'
import { SelectButton } from '../../shared/ui/SelectButton.jsx'
import { EmptyModuleState } from '../../shared/ui/EmptyModuleState.jsx'
import { cn } from '../../shared/lib/cn.js'
import {
  reportCards,
  buildSalesSummary,
  buildDashboardChartData,
  buildChartPath,
  formatRupiah,
  formatQty,
} from '../modules/moduleBlueprints.js'

function CapitalBanner({ compact }) {
  return (
    <section className={cn('capital-banner', compact && 'compact')}>
      <div className="capital-visual">
        <img src={capitalVisual} alt="Ilustrasi modal bisnis POS" />
      </div>
      <div>
        <small>ManTechQ Capital</small>
        <h2>Modal usaha lebih siap, operasional tetap jalan.</h2>
        <p>Akses pembiayaan hingga Rp 280 juta untuk stok, outlet, dan kebutuhan bisnis harian.</p>
        <span>Ajukan Sekarang</span>
      </div>
      <button aria-label="Sembunyikan banner"><ChevronDown size={18} /></button>
    </section>
  )
}

function Onboarding({ onStartFlow }) {
  return (
    <section className="onboarding">
      <div className="setup">
        <div className="setup-title">
          <strong>Langkah Mudah Buka Outlet</strong>
          <span>0/3</span>
          <div className="progress">
            <span />
          </div>
          <Button variant="soft" aria-label="Sembunyikan onboarding">
            <ChevronDown size={16} />
          </Button>
        </div>
        <div className="setup-grid">
          {[
            ['Siapkan Produk', Package, 'product'],
            ['Informasi Karyawan', Users, 'employee'],
            ['Lengkapi Data Outlet', Store, 'outlet'],
          ].map(([label, Icon, flow]) => (
            <button key={label} onClick={() => onStartFlow(flow)}>
              <Icon size={19} />
              <span>{label}</span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function MenuFavoritePage({ onStartFlow, posData }) {
  const summary = buildSalesSummary(posData)
  const dynamicCards = {
    'Kontrol Fraud': posData.sales.filter((sale) => sale.m_stran?.status === 'void').length ? `${posData.sales.filter((sale) => sale.m_stran?.status === 'void').length} transaksi void` : 'Belum Ada Transaksi',
    'Metode Pembayaran': summary.paidCount ? `${summary.paidCount} transaksi terbayar` : 'Belum Ada Pembayaran',
    'Jenis Order': summary.transactionCount ? `${summary.transactionCount} transaksi sales` : 'Belum Ada Transaksi',
    'Penjualan per Kategori': summary.productQty ? `${formatQty(summary.productQty)} produk terjual` : 'Belum Ada Transaksi',
    'Produk Terlaris': posData.salesDetails[0]?.item_name || 'Belum Ada Transaksi',
    'Komisi per Kasir': 'Belum Ada Data Komisi',
    'Penjualan per Kasir': summary.grandTotal ? formatRupiah(summary.grandTotal) : 'Belum Ada Transaksi',
    'Stok Terendah': posData.stockItems.length ? `${posData.stockItems.filter((item) => Number(item.qty_on_hand) <= Number(item.qty_minimum)).length} item perlu dicek` : 'Belum Ada Transaksi',
  }

  return (
    <main className="content menu-favorite-page">
      <Onboarding onStartFlow={onStartFlow} />

      <section className="favorite-report-stack" aria-label="Menu Favorit">
        {reportCards.map(([title, empty, Icon]) => (
          <article className="favorite-report-card" key={title}>
            <button className="favorite-report-head" onClick={() => toast.info(`Membuka detail ${title}`)}>
              <span>
                <Icon size={20} />
                {title}
              </span>
              <ChevronDown size={15} />
            </button>
            <div className="favorite-report-empty">
              <p>{dynamicCards[title] || empty}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

function SalesDashboard({ activeTab, onStartFlow, posData }) {
  const [period, setPeriod] = useState('Harian')
  const summary = buildSalesSummary(posData)
  const chartData = buildDashboardChartData(posData, period)
  const chartPath = buildChartPath(chartData.buckets, chartData.maxValue)
  const heading = activeTab === 'Penjualan' ? 'Dashboard Penjualan' : `Dashboard ${activeTab}`
  return (
    <main className="content">
      <Onboarding onStartFlow={onStartFlow} />
      <section className="panel dashboard-panel">
        <div className="title-row">
          <div>
            <h1>{heading}</h1>
            <p>Diperbarui dari PostgreSQL, {new Date().toLocaleString('id-ID')}</p>
          </div>
          <div className="title-icons">
            <HelpCircle size={19} />
            <Star size={20} />
          </div>
        </div>

        <div className="filters">
          <div className="segmented">
            {['Harian', 'Mingguan', 'Bulan'].map((item) => (
              <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="date-nav">
            <Button variant="outline" aria-label="Tanggal sebelumnya">
              <ChevronLeft size={18} />
            </Button>
            <span>{period === 'Bulan' ? '01 Jun 26 - 30 Jun 26' : '06 Jun 26 - 06 Jun 26'}</span>
            <Button variant="outline" aria-label="Tanggal berikutnya">
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <div className="summary">
          <div className="revenue">
            <span>Total Penjualan</span>
            <strong>{formatRupiah(summary.grandTotal)}</strong>
            <p>Akumulasi dari Awal Bulan {formatRupiah(summary.grandTotal)}</p>
            <p>Proyeksi Bulan Ini {formatRupiah(summary.grandTotal)}</p>
          </div>
          <div className="paid">
            <Metric label="Penjualan Belum Dibayar" value={formatRupiah(summary.unpaidTotal)} />
            <Metric label="Penjualan Terbayar" value={formatRupiah(summary.paidTotal)} />
          </div>
          <div className="metric-grid">
            <Metric label="Transaksi" value={formatQty(summary.transactionCount)} />
            <Metric label="Penjualan per Transaksi" value={formatRupiah(summary.averageTransaction)} />
            <Metric label="Produk Terjual" value={formatQty(summary.productQty)} />
            <Metric label="Produk per Transaksi" value={formatQty(summary.averageProduct)} />
          </div>
        </div>

        <div className="chart-block">
          <div className="chart-head">
            <div>
              <strong>Tren Penjualan</strong>
              <span>{period === 'Bulan' ? 'Bulan berjalan' : period === 'Mingguan' ? 'Minggu berjalan' : 'Hari ini'}</span>
            </div>
            <strong>{formatRupiah(chartData.total)}</strong>
          </div>
          <div className="chart" aria-label="Grafik tren penjualan">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.buckets} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#666' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => value > 0 ? `Rp ${(value / 1000).toLocaleString('id-ID')}rb` : 'Rp 0'} 
                  tick={{ fontSize: 11, fill: '#666' }}
                  width={80}
                />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value), 'Penjualan']} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#06b98f" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#06b98f' }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#06b98f' }} 
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="legend">
              <span>
                <i className="muted-dot" /> Penjualan
              </span>
              <span>
                <i /> Tren penjualan
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="report-grid">
        {reportCards.map(([title, empty, Icon]) => (
          <article className="panel report-card" key={title}>
            <div>
              <Icon size={20} />
              <strong>{title}</strong>
            </div>
            <p>{empty}</p>
            <Button variant="link" onClick={() => toast.info(`Membuka detail ${title}`)}>
              Lihat Semua
            </Button>
          </article>
        ))}
      </section>
    </main>
  )
}

const topModuleBlueprints = {
  'Order Online': {
    title: 'Order Online',
    description: 'Kelola channel penjualan online, marketplace, dan pesanan masuk.',
    cards: [
      ['Pesanan Baru', '0', ShoppingBag],
      ['Diproses', '0', ClipboardList],
      ['Siap Dikirim', '0', Truck],
      ['Selesai', '0', CheckCircle2],
    ],
    actions: ['Sinkronkan Pesanan', 'Atur Channel'],
    columns: ['NO ORDER', 'CHANNEL', 'PELANGGAN', 'TOTAL', 'STATUS'],
  },
  Appointment: {
    title: 'Appointment',
    description: 'Atur jadwal booking, layanan, staff, fasilitas, dan status appointment.',
    cards: [
      ['Booking Hari Ini', '0', CalendarDays],
      ['Menunggu Konfirmasi', '0', ClipboardList],
      ['Sedang Berjalan', '0', Users],
      ['Selesai', '0', CheckCircle2],
    ],
    actions: ['Tambah Appointment', 'Atur Kalender'],
    columns: ['JAM', 'PELANGGAN', 'LAYANAN', 'STAFF', 'STATUS'],
  },
  Karyawan: {
    title: 'Karyawan',
    description: 'Kelola data karyawan, akses POS, jadwal kerja, absensi, dan komisi.',
    cards: [
      ['Total Karyawan', '0', Users],
      ['Aktif', '0', CheckCircle2],
      ['Shift Hari Ini', '0', CalendarDays],
      ['Komisi', 'Rp 0', HeartHandshake],
    ],
    actions: ['Tambah Karyawan', 'Atur Hak Akses'],
    columns: ['NAMA', 'JABATAN', 'OUTLET', 'AKSES', 'STATUS'],
  },
}

function TopModulePage({ activeTab, onStartFlow }) {
  const blueprint = topModuleBlueprints[activeTab]
  if (!blueprint) return <SalesDashboard activeTab={activeTab} />
  return (
    <main className="content">
      <section className="panel top-module">
        <div className="majoo-page-head">
          <div className="majoo-title">
            <h1>{blueprint.title}</h1>
            <p>{blueprint.description}</p>
          </div>
          <div className="majoo-actions">
            {blueprint.actions.map((action) => (
              <Button
                key={action}
                variant={action.startsWith('Tambah') || action.startsWith('Sinkron') ? 'default' : 'outline'}
                onClick={() => {
                  if (action === 'Tambah Karyawan') onStartFlow('employee')
                  else toast.success(action)
                }}
              >
                <Sparkles size={16} />
                {action}
              </Button>
            ))}
          </div>
        </div>
        <div className="top-module-grid">
          {blueprint.cards.map(([label, value, Icon]) => (
            <article key={label} className="top-module-card">
              <Icon size={21} />
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
        <div className="majoo-filterbar">
          <label>
            <Search size={17} />
            <input placeholder="Cari ..." />
          </label>
          <SelectButton label="Semua Outlet" />
          <SelectButton label="Semua Status" />
        </div>
        <div className="module-table">
          <div className="module-table-head" style={{ gridTemplateColumns: `44px repeat(${blueprint.columns.length}, minmax(130px, 1fr))` }}>
            <span className="check-col">
              <input type="checkbox" aria-label="Toggle All Current Page Rows Selected" />
            </span>
            {blueprint.columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          <EmptyModuleState type="master" />
        </div>
      </section>
    </main>
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

export { CapitalBanner, Onboarding, MenuFavoritePage, SalesDashboard, TopModulePage }
