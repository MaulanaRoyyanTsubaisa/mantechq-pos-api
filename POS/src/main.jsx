import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { Toaster, toast } from 'sonner'
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
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts'
import {
  clearStoredSession,
  createProduct,
  createCategory,
  createSale,
  getPosData,
  getStoredSession,
  signInWithEmail,
  updateCategory,
  deleteCategory,
} from './lib/api.js'
import { deleteProduct, updateProduct } from './shared/api/posApi.js'
import { PosApp } from './features/pos/PosApp.jsx'
import { ProductFormModal } from './features/modules/ProductFormModal.jsx'
import capitalVisual from './assets/capital-visual.png'
import './style.css'

const monthMapIndo = {
  'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
  'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11,
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
  'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
};

export function isDateWithinRange(dateStr, range) {
  if (!dateStr || !range?.display) return true;
  
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return true;

  const parts = range.display.split(' - ');
  if (parts.length !== 2) return true;

  const parseIndoStr = (str) => {
    const match = str.trim().match(/^(\d+)\s+([A-Za-z]+)\s+(\d+)$/);
    if (!match) return null;
    const d = parseInt(match[1], 10);
    const m = monthMapIndo[match[2]];
    const y = parseInt(match[3], 10);
    if (m === undefined) return null;
    return new Date(y, m, d);
  };

  const startDate = parseIndoStr(parts[0]);
  const endDate = parseIndoStr(parts[1]);

  if (!startDate || !endDate) return true;

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  if (range.startTime) {
    const [h, m] = range.startTime.split(':');
    if (h !== undefined && m !== undefined) startDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  }
  if (range.endTime) {
    const [h, m] = range.endTime.split(':');
    if (h !== undefined && m !== undefined) endDate.setHours(parseInt(h, 10), parseInt(m, 10), 59, 999);
  }

  return targetDate >= startDate && targetDate <= endDate;
}

/**
 * ConfirmModal – replaces native browser confirm() with a styled modal.
 * Props:
 *   open       – boolean, controls visibility
 *   title      – string, modal heading
 *   message    – string | ReactNode, body text
 *   icon       – ReactNode, optional icon (defaults to warning triangle)
 *   confirmLabel – string (default 'Ya, Lanjutkan')
 *   cancelLabel  – string (default 'Batal')
 *   variant    – 'danger' | 'warning' | 'primary' (default 'danger')
 *   onConfirm  – callback when user clicks confirm
 *   onCancel   – callback when user clicks cancel / overlay
 */
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

const sidebarGroups = [
  { label: 'Menu Favorit', icon: Star, children: [] },
  { label: 'Dashboard', icon: LayoutDashboard, children: [] },
  { label: 'Transaksi Baru', icon: CircleDollarSign, children: [] },
  {
    label: 'Laporan',
    icon: ClipboardList,
    children: [
      {
        label: 'Laporan Penjualan',
        children: [
          'Ringkasan Penjualan',
          'Detail Penjualan',
          'Penjualan Per Periode',
          'Penjualan Outlet',
          'Laporan Uang Muka',
          'Laporan Jenis Bayar',
          'Laporan Jenis Order',
          'Laporan Void',
          'Laporan Refund',
        ],
      },
      {
        label: 'Laporan Dapur',
        children: ['Laporan Proses Order', 'Laporan Proses Produk'],
      },
      {
        label: 'Laporan Produk',
        children: ['Penjualan Produk', 'Penjualan Kategori', 'Penjualan Ekstra', 'Penjualan Sub Ekstra'],
      },
      'Laporan Promo & Loyalti',
      {
        label: 'Laporan Kasir',
        children: ['Laporan Kas Kasir', 'Penjualan Per Kasir', 'Penjualan Per Terminal', 'Laporan Tutup Kasir', 'Laporan Tutup Toko'],
      },
      {
        label: 'Laporan Persediaan',
        children: ['Lap. Ringkasan Persediaan', 'Lap. Detail Persediaan', 'Laporan Stok Kedaluwarsa', 'Laporan Serial Number', 'Laporan Batch Number'],
      },
    ],
  },
  {
    label: 'Produk',
    icon: Package,
    children: [
      'Daftar Kategori',
      'Daftar Produk',
      'Cetak Barcode',
      'Daftar Kategori Catatan',
      'Master Resep',
    ],
  },
  {
    label: 'Inventori',
    icon: Boxes,
    children: ['Daftar Bahan Baku', 'Pembelian Stok', 'Kelola Stok'],
  },
  {
    label: 'Pelanggan',
    icon: Users,
    children: ['Daftar Pelanggan', 'Grup Pelanggan', 'Grup Harga Spesial', 'Kustom Data Pelanggan', 'Pengaturan Data Pelanggan'],
  },
  {
    label: 'Promosi',
    icon: Percent,
    children: [{ label: 'Promo', children: ['Basic Promo', 'Per Total Pembelian', 'Per Produk'] }, 'Kupon', 'Loyalty', 'Poin Reward'],
  },
  {
    label: 'Invoice',
    icon: FileText,
    children: [
      'Daftar Penawaran Penjualan',
      'Daftar Pesanan Penjualan',
      'Daftar Pengiriman Penjualan',
      'Daftar Invoice',
      'Daftar Penerimaan Penjualan',
    ],
  },
]

const defaultOutlets = ['Software House', 'Semua Outlet']
const accessRoleOptions = ['Kasir', 'Manager', 'Admin Outlet', 'Supervisor', 'Owner']
const categoryOptions = ['Makanan', 'Minuman', 'Paket Hemat', 'Jasa', 'Retail']
const unitOptions = ['Pcs', 'Porsi', 'Cup', 'Kg', 'Gram', 'Liter']
const serialInputOptions = ['Input manual', 'Scan barcode', 'Auto generate']
const groupOptions = ['Menu Utama', 'Minuman', 'Paket Promo', 'Produk Retail']
const extraOptions = ['Saus Sambal', 'Topping Keju', 'Gula', 'Es Batu', 'Level Pedas']
const recipeOptions = ['Resep Salad', 'Resep Kopi Susu', 'Resep Nasi Goreng', 'Resep Teh Lemon']
const paymentMethodOptions = ['Tunai', 'QRIS', 'Transfer', 'Kartu Debit', 'Kartu Kredit']
const provinceOptions = ['Jawa Tengah', 'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Banten']
const cityOptions = ['Kab. Tegal', 'Jakarta Selatan', 'Bandung', 'Surabaya', 'Tangerang']
const socialOptions = ['Instagram', 'Facebook', 'TikTok', 'Website']
const scheduleDays = ['Setiap hari', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const topTabs = [
  { label: 'Penjualan', icon: ShoppingBag },
  { label: 'Order Online', icon: Store },
  { label: 'Appointment', icon: CalendarDays },
  { label: 'Karyawan', icon: Users },
]

const moreMenu = ['Keuangan', 'Pengaturan', 'Bantuan', 'Layanan', 'Inspirasi', 'Kamu Punya Pendanaan Siap pakai', 'Supplies']

const reportCards = [
  ['Kontrol Fraud', 'Belum Ada Transaksi', ShieldCheck],
  ['Metode Pembayaran', 'Belum Ada Pembayaran', CreditCard],
  ['Jenis Order', 'Belum Ada Transaksi', ShoppingBag],
  ['Penjualan per Kategori', 'Belum Ada Transaksi', ChartColumn],
  ['Produk Terlaris', 'Belum Ada Transaksi', Package],
  ['Komisi per Kasir', 'Belum Ada Data Komisi', HeartHandshake],
  ['Penjualan per Kasir', 'Belum Ada Transaksi', Users],
  ['Stok Terendah', 'Belum Ada Transaksi', Boxes],
]

const quickFavorites = ['Dashboard', 'Laporan Penjualan', 'Daftar Produk', 'Kelola Stok', 'Daftar Pelanggan', 'Promo']

const moduleBlueprints = {
  'Laporan Penjualan': {
    type: 'report',
    title: 'Laporan Penjualan',
    description: 'Ringkasan transaksi, pembayaran, pajak, diskon, refund, dan channel penjualan.',
    actions: ['Export', 'Cetak'],
    filters: ['Outlet', 'Tanggal', 'Kasir', 'Metode Bayar', 'Jenis Order'],
    columns: ['Tanggal', 'No Transaksi', 'Pelanggan', 'Kasir', 'Total', 'Status'],
    rows: [],
  },
  'Laporan Dapur': {
    type: 'report',
    title: 'Laporan Dapur',
    description: 'Pantau pesanan dapur berdasarkan status proses, waktu tunggu, dan item terjual.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Status Dapur'],
    columns: ['Waktu', 'No Order', 'Produk', 'Qty', 'Status', 'Durasi'],
    rows: [],
  },
  'Laporan Produk': {
    type: 'report',
    title: 'Laporan Produk',
    description: 'Detail produk terjual, kategori, HPP, margin, dan performa per outlet.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Departemen', 'Kategori'],
    columns: ['Produk', 'Kategori', 'Qty', 'Gross Sales', 'Diskon', 'Net Sales'],
    rows: [],
  },
  'Laporan Jasa': {
    type: 'report',
    title: 'Laporan Jasa',
    description: 'Rekap penjualan jasa, appointment, durasi layanan, dan staff pelaksana.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Staff'],
    columns: ['Jasa', 'Staff', 'Booking', 'Selesai', 'Pendapatan'],
    rows: [],
  },
  'Laporan Fasilitas': {
    type: 'report',
    title: 'Laporan Fasilitas',
    description: 'Monitor penggunaan fasilitas dan paket booking per periode.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Fasilitas'],
    columns: ['Fasilitas', 'Booking', 'Jam Pakai', 'Pendapatan', 'Status'],
    rows: [],
  },
  'Laporan Promo & Loyalti': {
    type: 'report',
    title: 'Laporan Promo & Loyalti',
    description: 'Efektivitas promo, kupon, poin, dan loyalti pelanggan.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Tipe Promo'],
    columns: ['Promo', 'Digunakan', 'Diskon', 'Penjualan', 'Konversi'],
    rows: [],
  },
  'Laporan Pajak': {
    type: 'report',
    title: 'Laporan Pajak',
    description: 'Rekap pajak transaksi, service charge, dan nilai sebelum atau sesudah pajak.',
    actions: ['Export', 'Cetak'],
    filters: ['Outlet', 'Tanggal', 'Tipe Pajak'],
    columns: ['Tanggal', 'Pajak', 'DPP', 'Nilai Pajak', 'Total'],
    rows: [],
  },
  'Laporan Kasir': {
    type: 'report',
    title: 'Laporan Kasir',
    description: 'Shift kasir, uang masuk, uang keluar, selisih kas, dan tutup kasir.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Kasir', 'Shift'],
    columns: ['Kasir', 'Shift', 'Modal Awal', 'Penjualan', 'Selisih', 'Status'],
    rows: [],
  },
  'Laporan Deposit': {
    type: 'report',
    title: 'Laporan Deposit',
    description: 'Mutasi saldo deposit pelanggan dan pemakaian deposit per transaksi.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Pelanggan'],
    columns: ['Pelanggan', 'Masuk', 'Keluar', 'Saldo', 'Update'],
    rows: [],
  },
  'Laporan Pelanggan': {
    type: 'report',
    title: 'Laporan Pelanggan',
    description: 'Analisis pelanggan baru, pelanggan aktif, frekuensi belanja, dan nilai transaksi.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Grup'],
    columns: ['Pelanggan', 'Transaksi', 'Total Belanja', 'Terakhir Belanja', 'Grup'],
    rows: [],
  },
  'Laporan Karyawan': {
    type: 'report',
    title: 'Laporan Karyawan',
    description: 'Produktivitas karyawan, absensi, komisi, dan penjualan per staff.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Jabatan'],
    columns: ['Karyawan', 'Jabatan', 'Transaksi', 'Komisi', 'Status'],
    rows: [],
  },
  'Laporan Persediaan': {
    type: 'report',
    title: 'Laporan Persediaan',
    description: 'Rekap stok masuk, stok keluar, stok opname, dan nilai persediaan.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Kategori'],
    columns: ['Item', 'Awal', 'Masuk', 'Keluar', 'Akhir', 'Nilai'],
    rows: [],
  },
  'Laporan Settlement': {
    type: 'report',
    title: 'Laporan Settlement',
    description: 'Status settlement pembayaran digital dan rekonsiliasi transaksi.',
    actions: ['Export'],
    filters: ['Outlet', 'Tanggal', 'Provider', 'Status'],
    columns: ['Tanggal', 'Provider', 'Nominal', 'Fee', 'Diterima', 'Status'],
    rows: [],
  },
  'Waktu Teramai Produk': {
    type: 'analysis',
    title: 'Waktu Teramai Produk',
    description: 'Jam dan hari paling ramai untuk tiap produk.',
    filters: ['Outlet', 'Tanggal', 'Produk'],
    columns: ['Jam', 'Produk', 'Qty', 'Penjualan', 'Tren'],
    rows: [],
  },
  'Waktu Teramai Penjualan': {
    type: 'analysis',
    title: 'Waktu Teramai Penjualan',
    description: 'Pola traffic penjualan berdasarkan jam, hari, dan outlet.',
    filters: ['Outlet', 'Tanggal'],
    columns: ['Jam', 'Transaksi', 'Total Penjualan', 'Rata-rata Struk'],
    rows: [],
  },
  'Perputaran Stok': {
    type: 'analysis',
    title: 'Perputaran Stok',
    description: 'Produk dengan perputaran tercepat dan stok yang perlu diperhatikan.',
    filters: ['Outlet', 'Tanggal', 'Kategori'],
    columns: ['Produk', 'Stok Awal', 'Terjual', 'Stok Akhir', 'Turnover'],
    rows: [],
  },
  'Kepuasan Pelanggan': {
    type: 'analysis',
    title: 'Kepuasan Pelanggan',
    description: 'Ringkasan rating, feedback, dan keluhan pelanggan.',
    filters: ['Outlet', 'Tanggal', 'Rating'],
    columns: ['Tanggal', 'Pelanggan', 'Rating', 'Feedback', 'Status'],
    rows: [],
  },
}

const crudBlueprints = {
  'Daftar Departemen': ['Nama Departemen', 'Jumlah Kategori', 'Produk', 'Status'],
  'Daftar Kategori': ['Kategori', 'Departemen', 'Produk', 'Status'],
  'Daftar Produk': ['Nama Produk', 'SKU', 'Kategori', 'Harga', 'Stok', 'Status'],
  'Produk Layanan': ['Nama Layanan', 'Durasi', 'Harga', 'Staff', 'Status'],
  'Produk Fasilitas': ['Fasilitas', 'Kapasitas', 'Tarif', 'Jadwal', 'Status'],
  'Produk Ekstra': ['Ekstra', 'Produk Terkait', 'Harga', 'Status'],
  'Produk Paket': ['Paket', 'Isi Paket', 'Harga', 'Status'],
  Deposit: ['Nama Deposit', 'Nominal', 'Bonus', 'Masa Aktif', 'Status'],
  'Penjadwalan Perubahan Resep': ['Produk', 'Resep Baru', 'Mulai Berlaku', 'Status'],
  'Daftar Harga Ojek Online': ['Produk', 'Platform', 'Harga Outlet', 'Harga Online', 'Status'],
  'Penjadwalan Harga': ['Produk', 'Harga Baru', 'Periode', 'Status'],
  'Harga Berdasarkan Waktu': ['Produk', 'Hari/Jam', 'Harga', 'Status'],
  'Cetak Barcode': ['Produk', 'SKU', 'Barcode', 'Status'],
  'Daftar Kategori Catatan': ['Kategori Catatan', 'Jumlah Catatan', 'Status'],
  'Master Resep': ['Produk', 'Bahan Baku', 'Qty Resep', 'Status'],
  'Daftar Bahan Baku': ['Bahan Baku', 'Satuan', 'Stok', 'Minimum', 'Status'],
  'Pembelian Stok': ['No Pembelian', 'Pemasok', 'Tanggal', 'Total', 'Status'],
  'Kelola Stok': ['Item', 'Stok Sistem', 'Stok Fisik', 'Selisih', 'Status'],
  'Produksi Stok': ['No Produksi', 'Produk', 'Qty', 'Tanggal', 'Status'],
  'Mutasi Antar Outlet': ['No Mutasi', 'Dari Outlet', 'Ke Outlet', 'Qty', 'Status'],
  'Daftar Pemasok': ['Pemasok', 'Kontak', 'Kategori', 'Status'],
  'Daftar Pelanggan': ['Nama Pelanggan', 'No HP', 'Grup', 'Poin', 'Status'],
  'Grup Pelanggan': ['Grup', 'Jumlah Pelanggan', 'Benefit', 'Status'],
  'Grup Harga Spesial': ['Grup Harga', 'Produk', 'Harga Spesial', 'Status'],
  'Kustom Data Pelanggan': ['Field', 'Tipe Data', 'Wajib', 'Status'],
  'Pengaturan Data Pelanggan': ['Pengaturan', 'Nilai', 'Status'],
  Promo: ['Nama Promo', 'Periode', 'Tipe', 'Nilai', 'Status'],
  Kupon: ['Kode Kupon', 'Kuota', 'Terpakai', 'Periode', 'Status'],
  Loyalty: ['Program Loyalty', 'Mekanisme', 'Reward', 'Status'],
  'Poin Reward': ['Reward', 'Poin', 'Stok', 'Status'],
  'Daftar Grup Komisi': ['Grup Komisi', 'Tipe', 'Nilai', 'Karyawan', 'Status'],
  'Daftar Penawaran Penjualan': ['No Penawaran', 'Pelanggan', 'Tanggal', 'Total', 'Status'],
  'Daftar Pesanan Penjualan': ['No Pesanan', 'Pelanggan', 'Tanggal', 'Total', 'Status'],
  'Daftar Pengiriman Penjualan': ['No Pengiriman', 'Pelanggan', 'Kurir', 'Status'],
  'Daftar Invoice': ['No Invoice', 'Pelanggan', 'Jatuh Tempo', 'Total', 'Status'],
  'Daftar Penerimaan Penjualan': ['No Penerimaan', 'Invoice', 'Tanggal', 'Nominal', 'Status'],
  'Kirim Kampanye Marketing': ['Nama Kampanye', 'Segmentasi', 'Channel', 'Jadwal', 'Status'],
  'Beli Kampanye Marketing': ['Paket Kampanye', 'Target Audience', 'Harga', 'Status'],
}

Object.entries(crudBlueprints).forEach(([key, columns]) => {
  moduleBlueprints[key] = {
    type: 'master',
    title: key,
    description: `Kelola ${key.toLowerCase()} untuk operasional ManTechQ PoS.`,
    actions: ['Tambah', 'Import', 'Export'],
    filters: ['Outlet', 'Status'],
    columns,
    rows: [],
  }
})

const salesReportPages = [
  'Ringkasan Penjualan',
  'Detail Penjualan',
  'Penjualan Per Periode',
  'Penjualan Outlet',
  'Laporan Uang Muka',
  'Laporan Jenis Bayar',
  'Laporan Jenis Order',
  'Laporan Void',
  'Laporan Refund',
]

salesReportPages.forEach((page) => {
  moduleBlueprints[page] = {
    type: 'report',
    title: page,
    description: 'Laporan transaksi penjualan berdasarkan periode dan outlet.',
    actions: ['Ekspor Data'],
    filters: ['Tanggal', 'Outlet', 'Kasir'],
    controls: 'date-status',
    columns:
      page === 'Detail Penjualan'
        ? ['NO TRANSAKSI', 'TANGGAL', 'PRODUK', 'QTY', 'HARGA', 'DISKON', 'TOTAL']
        : ['TANGGAL', 'OUTLET', 'TRANSAKSI', 'PENJUALAN KOTOR', 'DISKON', 'PENJUALAN BERSIH'],
    rows: [],
  }
})

const reportPageConfigs = {
  'Laporan Uang Muka': {
    title: 'Laporan Uang Muka',
    metrics: [['Total Transaksi Uang Muka', '0', 'green'], ['Total Penerimaan Uang Muka', 'Rp 0', 'blue']],
    columns: ['NO TRANSAKSI', 'TANGGAL', 'PELANGGAN', 'KASIR', 'PENERIMAAN UANG MUKA', 'OUTLET'],
  },
  'Laporan Jenis Bayar': {
    title: 'Laporan Jenis Bayar',
    chartTitle: 'Grafik Jenis Pembayaran',
    metrics: [
      ['Total Transaksi Terbayar', '0', 'green'],
      ['Total Penjualan Terbayar', 'Rp 0', 'yellow'],
      ['Total Jenis Pembayaran', '0', 'blue'],
      ['Total Transaksi Deposit', '0', 'cyan'],
      ['Total Transaksi Uang Muka', '0', 'red'],
      ['Total Penjualan Deposit', 'Rp 0', 'purple'],
      ['Total Penerimaan Uang Muka', 'Rp 0', 'orange'],
    ],
    columns: ['JENIS PEMBAYARAN', 'JUMLAH TRANSAKSI', 'TRANSAKSI (%)', 'JML TRANSAKSI DEPOSIT', 'JML TRANSAKSI UANG MUKA', 'PENJUALAN (RP)', 'PENJUALAN (%)', 'PENJUALAN DEPOSIT', 'PENERIMAAN UANG MUKA'],
  },
  'Laporan Jenis Order': {
    title: 'Laporan Jenis Order',
    chartTitle: 'Grafik Jenis Order',
    metrics: [['Total Transaksi', '0', 'green'], ['Total Penjualan', 'Rp 0', 'blue']],
    columns: ['JENIS ORDER', 'JUMLAH TRANSAKSI', 'JUMLAH TRANSAKSI (%)', 'PENJUALAN (RP)', 'PENJUALAN %'],
  },
  'Laporan Void': {
    title: 'Laporan Void',
    variant: 'tableOnly',
    filters: ['orderType'],
    metrics: [['Total Void', 'Rp 0', 'red'], ['Total Transaksi', '0', 'green']],
    columns: ['NO NOTA', 'TANGGAL VOID', 'TANGGAL ORDER', 'KASIR', 'OTORISASI', 'PRODUK', 'SUBTOTAL VOID', 'JENIS ORDER', 'NAMA MEJA'],
  },
  'Laporan Refund': {
    title: 'Laporan Refund',
    variant: 'tableOnly',
    tabs: ['Semua', 'Tunai', 'Non Tunai'],
    tableSettings: true,
    metrics: [['Total Transaksi Refund', '0', 'green'], ['Total Refund', 'Rp 0', 'red']],
    columns: ['NO TRANSAKSI REFUND', 'TANGGAL', 'REFUND (RP)', 'METODE PEMBAYARAN', 'NAMA OUTLET'],
  },
  'Laporan Proses Order': {
    title: 'Laporan Waktu Proses Order',
    variant: 'tableOnly',
    columns: ['NO ORDER', 'PERIODE', 'PRODUK', 'JUMLAH', 'ORDER-PROSES (PRODUK)', 'PROSES-SELESAI (PRODUK)', 'TOTAL (PRODUK)', 'ORDER-PROSES (ORDER)', 'PROSES-SELESAI (ORDER)', 'TOTAL (ORDER)'],
  },
  'Laporan Proses Produk': {
    title: 'Laporan Waktu Proses Produk',
    variant: 'tableOnly',
    columns: ['PRODUK', 'JUMLAH', 'RATA-RATA ORDER-PROSES', 'RATA-RATA PROSES-SELESAI', 'RATA-RATA TOTAL WAKTU', 'WAKTU TERCEPAT', 'WAKTU TERLAMA'],
  },
  'Penjualan Produk': {
    title: 'Penjualan Produk',
    chartTitle: 'Grafik Penjualan Produk',
    filters: ['category', 'department', 'orderType', 'productType'],
    helper: '44 jenis order terpilih',
    metrics: [['Total Penjualan Per Produk', 'Rp 0', 'green'], ['Total Produk Terjual', '0 Produk', 'blue'], ['Total Laba Kotor Per Produk', 'Rp 0', 'purple']],
    columns: ['PRODUK', 'SKU', 'DEPARTEMEN', 'KATEGORI', 'JENIS PRODUK', 'JUMLAH', 'PENJUALAN (RP)', 'JUMLAH REFUND', 'REFUND (RP)'],
  },
  'Penjualan Departemen': {
    title: 'Penjualan Departemen',
    variant: 'tableOnly',
    metrics: [['Total Departemen', '0', 'green'], ['Total Penjualan Departemen', 'Rp 0', 'blue']],
    columns: ['DEPARTEMEN', 'JUMLAH PRODUK', 'PRODUK (%)', 'PENJUALAN (RP)', 'PENJUALAN (%)'],
  },
  'Penjualan Kategori': {
    title: 'Penjualan Kategori',
    chartTitle: 'Grafik Penjualan Kategori',
    filters: ['department'],
    metrics: [['Total Kategori', '0', 'green'], ['Total Penjualan Kategori', 'Rp 0', 'blue']],
    columns: ['KATEGORI', 'JUMLAH PRODUK', 'PRODUK (%)', 'PENJUALAN (RP)', 'PENJUALAN (%)', 'HPP (RP)'],
  },
  'Penjualan Ekstra': {
    title: 'Penjualan Ekstra',
    chartTitle: 'Grafik Penjualan Ekstra',
    metrics: [['Total Ekstra', '0', 'green'], ['Total Item Ekstra', '0', 'blue'], ['Total Penjualan Ekstra', 'Rp 0', 'purple'], ['Total Refund Ekstra', 'Rp 0', 'red']],
    columns: ['NAMA EKSTRA', 'JUMLAH', 'JUMLAH (%)', 'PENJUALAN (RP)', 'PENJUALAN (%)', 'LABA KOTOR (RP)', 'LABA KOTOR (%)', 'JUMLAH REFUND', 'REFUND (RP)'],
  },
  'Penjualan Sub Ekstra': {
    title: 'Penjualan Sub Ekstra',
    chartTitle: 'Grafik Penjualan Sub Ekstra',
    metrics: [['Total Sub Ekstra', '0', 'green'], ['Total Penjualan', 'Rp 0', 'blue'], ['Total Refund Sub Ekstra', 'Rp 0', 'red']],
    columns: ['SUB EKSTRA', 'EKSTRA', 'JUMLAH', 'JUMLAH %', 'PENJUALAN (RP)', 'PENJUALAN %', 'LABA KOTOR (RP)', 'LABA KOTOR %', 'JUMLAH REFUND', 'REFUND (RP)'],
  },
  'Laporan Jasa': {
    title: 'Laporan Jasa',
    chartTitle: 'Grafik Laporan Jasa',
    metrics: [['Total Jasa Terjual', '0', 'green'], ['Total Penjualan Jasa', 'Rp 0', 'blue']],
    columns: ['JASA', 'STAFF', 'JUMLAH', 'PENJUALAN (RP)', 'LABA KOTOR (RP)', 'OUTLET'],
  },
  'Laporan Reservasi': {
    title: 'Laporan Reservasi',
    variant: 'tableOnly',
    columns: ['TANGGAL RESERVASI', 'NO RESERVASI', 'PELANGGAN', 'ORDER', 'TANGGAL BUAT', 'STATUS LAYANAN'],
  },
  'Laporan Reservasi & Utilisasi': {
    title: 'Laporan Reservasi & Utilisasi',
    chartTitle: 'Grafik Utilisasi Reservasi',
    metrics: [['Total Reservasi', '0', 'green'], ['Total Utilisasi', '0%', 'blue']],
    columns: ['TANGGAL', 'FASILITAS', 'RESERVASI', 'UTILISASI', 'STATUS'],
  },
  'Laporan Kas Kasir': {
    title: 'Laporan Kas Kasir',
    variant: 'tableOnly',
    metrics: [['Total Kas Kasir', 'Rp 0', 'green'], ['Total Uang Masuk', 'Rp 0', 'blue'], ['Total Uang Keluar', 'Rp 0', 'red']],
    columns: ['TRANSAKSI', 'TANGGAL', 'OUTLET', 'MASUK (RP)', 'KELUAR (RP)', 'KATEGORI', 'NAMA LOGIN', 'NAMA DEVICE'],
  },
  'Penjualan Per Kasir': {
    title: 'Penjualan per Kasir',
    chartTitle: 'Grafik per Kasir',
    filters: ['cashierPay'],
    columns: ['KASIR', 'OUTLET', 'PENJUALAN (RP)', 'PENJUALAN (%)', 'LABA KOTOR (RP)', 'LABA KOTOR (%)', 'JUMLAH TRANSAKSI'],
  },
  'Penjualan Per Terminal': {
    title: 'Penjualan per Terminal',
    variant: 'tableOnly',
    columns: ['TERMINAL', 'OUTLET', 'PENJUALAN (RP)', 'LABA KOTOR (RP)', 'JUMLAH TRANSAKSI', 'JUMLAH PRODUK', 'PENGEMBALIAN (RP)'],
  },
  'Laporan Tutup Kasir': {
    title: 'Laporan Tutup Kasir',
    variant: 'tableOnly',
    columns: ['WAKTU BUKA / TUTUP KASIR', 'KASIR', 'OUTLET', 'MODAL AWAL (RP)', 'SALDO AKHIR (RP)', 'TOTAL TUNAI AKTUAL (RP)', 'TOTAL PENERIMAAN NON TUNAI (RP)'],
  },
  'Laporan Tutup Toko': {
    title: 'Laporan Tutup Toko',
    variant: 'tableOnly',
    columns: ['TANGGAL', 'OUTLET', 'KASIR', 'TOTAL PENJUALAN', 'SELISIH KAS', 'STATUS'],
  },
  'Penjualan Deposit': {
    title: 'Penjualan Deposit',
    variant: 'tableOnly',
    metrics: [['Jumlah Transaksi Deposit', '0', 'green'], ['Total Penjualan Deposit', 'Rp 0', 'blue']],
    columns: ['NO. TRANSAKSI', 'TANGGAL TRANSAKSI', 'KASIR', 'PELANGGAN', 'NAMA DEPOSIT', 'JENIS DEPOSIT', 'NILAI DEPOSIT', 'KEDALUWARSA'],
  },
  'Deposit Kedaluwarsa': {
    title: 'Deposit Kedaluwarsa',
    variant: 'tableOnly',
    metrics: [['Total Deposit Kedaluwarsa', '0', 'yellow'], ['Total Nominal Kedaluwarsa', 'Rp 0', 'red']],
    columns: ['NO TRANSAKSI', 'TANGGAL', 'PELANGGAN', 'NAMA PAKET', 'TANGGAL KEDALUWARSA', 'NOMINAL KEDALUWARSA', 'OUTLET'],
  },
  'Sisa Deposit': {
    title: 'Laporan Sisa Deposit',
    variant: 'tableOnly',
    singleDate: true,
    columns: ['PELANGGAN', 'SISA DEPOSIT'],
  },
  'Lap. Ringkasan Persediaan': {
    title: 'Laporan Ringkasan Persediaan',
    variant: 'tableOnly',
    singleDate: true,
    filters: ['category', 'productType'],
    metrics: [['Total Nilai Persediaan', 'Rp 0', 'green']],
    columns: ['NAMA PRODUK', 'SKU', 'JENIS', 'KATEGORI', 'KUANTITAS', 'SATUAN', 'HARGA MODAL', 'TOTAL NILAI PERSEDIAAN'],
  },
  'Lap. Detail Persediaan': {
    title: 'Laporan Detail Persediaan',
    variant: 'tableOnly',
    info: 'Harap pilih outlet dan produk terlebih dahulu untuk menampilkan data pada Laporan Detail Persediaan',
    filters: ['outlet', 'product', 'type'],
    columns: ['OUTLET', 'TANGGAL TRANSAKSI', 'TRANSAKSI', 'NO TRANSAKSI', 'KUANTITAS', 'SATUAN', 'HARGA JUAL/BELI', 'STOK'],
  },
  'Laporan Stok Kedaluwarsa': {
    title: 'Laporan Stok Kedaluwarsa',
    variant: 'tableOnly',
    columns: ['PRODUK', 'SKU', 'KATEGORI', 'TANGGAL KEDALUWARSA', 'STOK', 'OUTLET'],
  },
  'Laporan Serial Number': {
    title: 'Laporan Serial Number',
    variant: 'tableOnly',
    columns: ['PRODUK', 'SERIAL NUMBER', 'STATUS', 'OUTLET', 'TANGGAL'],
  },
  'Laporan Batch Number': {
    title: 'Laporan Batch Number',
    variant: 'tableOnly',
    columns: ['PRODUK', 'BATCH NUMBER', 'TANGGAL MASUK', 'KEDALUWARSA', 'STOK', 'OUTLET'],
  },
  QRIS: {
    title: 'Laporan Settlement QRIS',
    variant: 'tableOnly',
    tabs: ['Transaksi Berhasil', 'Transaksi Gagal', 'Settlement Diproses', 'Settlement Tertunda', 'Settlement Berhasil'],
    filters: ['type', 'status'],
    metrics: [['Total Penjualan', 'Rp 0', 'green'], ['Total MDR', 'Rp 0', 'purple'], ['Total Settlement', 'Rp 0', 'blue'], ['Settlement Tertunda', 'Rp 0', 'orange']],
    columns: ['NO TRANSAKSI', 'TANGGAL TRANSAKSI', 'TIPE QRIS', 'NOMOR REFERENSI', 'TOTAL', 'STATUS SETTLEMENT', 'TANGGAL SETTLEMENT'],
  },
  'Order Online': {
    title: 'Order Online',
    variant: 'settlementOnline',
    singleDate: false,
    filters: ['outlet', 'transactionType'],
    metrics: [['Pemasukan', 'Rp 0', 'green'], ['Penarikan', 'Rp 0', 'red']],
    columns: ['OUTLET', 'TANGGAL', 'JENIS TRANSAKSI', 'NOMOR', 'TOTAL', 'KETERANGAN'],
  },
}

;['Basic Promo', 'Per Total Pembelian', 'Per Produk'].forEach((page) => {
  moduleBlueprints[page] = {
    type: 'master',
    title: page,
    description: 'Kelola promo aktif untuk transaksi kasir dan pelanggan.',
    actions: ['Tambah Promo'],
    filters: ['Outlet', 'Status'],
    controls: 'status-tabs',
    columns: ['NAMA PROMO', 'PERIODE', 'TIPE PROMO', 'NILAI PROMO', 'STATUS'],
    rows: [],
  }
})

Object.assign(moduleBlueprints, {
  'Daftar Produk': {
    type: 'master',
    title: 'Daftar Produk',
    subtitle: 'Software House -',
    countLabel: '0 Produk barang',
    actions: ['Impor Data', 'Ekspor Data', 'Tambah Produk'],
    filters: ['Kategori'],
    controls: 'product',
    columns: ['NAMA PRODUK', 'SKU', 'KATEGORI', 'HARGA MODAL', 'HARGA BELI', 'HARGA JUAL', 'STATUS'],
    rows: [],
  },
  'Daftar Bahan Baku': {
    type: 'master',
    title: 'Daftar Bahan Baku',
    actions: ['Impor Bahan Baku', 'Ekspor Bahan Baku', 'Tambah Bahan Baku'],
    filters: [],
    controls: 'search-only',
    columns: ['SKU', 'NAMA', 'SATUAN'],
    rows: [],
  },
  'Daftar Pelanggan': {
    type: 'master',
    title: 'Daftar Pelanggan',
    actions: ['Ekspor Data', 'Impor Data', 'Tambah Pelanggan'],
    filters: [],
    controls: 'search-only',
    columns: ['NAMA', 'KODE PELANGGAN', 'ALAMAT', 'TELEPON', 'JENIS KELAMIN', 'POIN', 'SALDO DEPOSIT'],
    rows: [],
  },
  'Daftar Invoice': {
    type: 'invoice',
    title: 'Daftar Invoice',
    subtitle: '01 Juni 2026 - 30 Juni 2026',
    actions: ['Impor Invoice', 'Ekspor Invoice', 'Tambah Invoice'],
    filters: ['Tanggal', 'Status'],
    controls: 'invoice',
    summary: [
      ['Invoice', 'Rp 0'],
      ['Void', 'Rp 0'],
      ['Lunas', 'Rp 0'],
      ['Belum Lunas', 'Rp 0'],
    ],
    columns: ['NO INVOICE', 'PELANGGAN', 'OUTLET', 'TANGGAL', 'TOTAL TAGIHAN (RP)', 'SISA TAGIHAN (RP)', 'STATUS'],
    rows: [],
  },
})

const productPageConfigs = {
  'Daftar Kategori': {
    title: 'Daftar Kategori',
    addLabel: 'Tambah Kategori',
    addFlow: 'category',
    columns: ['NAMA KATEGORI', 'URUTAN', 'JUMLAH PRODUK', 'DEPARTEMEN', 'STATUS', ''],
    rows: [],
  },
  'Daftar Produk': {
    title: 'Daftar Produk',
    subtitle: 'Software House - 0 Produk barang',
    addLabel: 'Tambah Produk',
    addFlow: 'product',
    actions: ['Impor Data', 'Ekspor Data'],
    filters: ['Semua Kategori'],
    columns: ['NAMA PRODUK', 'SKU', 'KATEGORI', 'HARGA MODAL', 'HARGA BELI', 'HARGA JUAL', 'STATUS', ''],
    rows: [],
  },
  'Penjadwalan Harga': {
    title: 'Penjadwalan Harga',
    addLabel: 'Tambah Jadwal Harga',
    filters: ['Semua Kategori', 'Semua Status'],
    columns: ['NAMA JADWAL', 'PERIODE', 'PRODUK', 'HARGA BARU', 'STATUS', ''],
    rows: [],
  },
  'Harga Berdasarkan Waktu': {
    title: 'Harga Berdasarkan Waktu',
    addLabel: 'Tambah Harga Waktu',
    filters: ['Semua Kategori', 'Semua Hari'],
    columns: ['PRODUK', 'HARI/JAM', 'HARGA', 'OUTLET', 'STATUS', ''],
    rows: [],
  },
  'Cetak Barcode': {
    title: 'Cetak Barcode',
    addLabel: 'Cetak Barcode',
    filters: ['Semua Kategori'],
    columns: ['NAMA PRODUK', 'SKU', 'BARCODE', 'KATEGORI', 'STATUS', ''],
    rows: [],
  },
  'Daftar Kategori Catatan': {
    title: 'Daftar Kategori Catatan',
    addLabel: 'Tambah Kategori Catatan',
    columns: ['KATEGORI CATATAN', 'JUMLAH CATATAN', 'STATUS', ''],
    rows: [],
  },
  'Master Resep': {
    title: 'Master Resep',
    addLabel: 'Tambah Resep',
    filters: ['Semua Kategori'],
    columns: ['NAMA RESEP', 'PRODUK', 'BAHAN BAKU', 'QTY RESEP', 'STATUS', ''],
    rows: [],
  },
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatQty(value) {
  return Number(value || 0).toLocaleString('id-ID')
}

function shortId(value) {
  return value ? String(value).slice(0, 8) : '-'
}

function membershipOutletLabel(membership) {
  return `Outlet ${shortId(membership?.outlet_id || membership?.org_id)}`
}

function parseCurrencyInput(value) {
  const normalized = String(value || '').replace(/[^\d]/g, '')
  return Number(normalized || 0)
}

function parseQuantityInput(value) {
  const normalized = String(value || '').replace(',', '.').replace(/[^\d.]/g, '')
  const parsed = Number(normalized || 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function mapCategoryToRows(categories, stockItems) {
  const sortedCategories = [...categories].sort((a, b) => (Number(a.sequence) || 0) - (Number(b.sequence) || 0))
  return sortedCategories.map(cat => {
    const productCount = stockItems.filter(p => p.category_name === cat.name).length
    return [
      cat.name,
      String(cat.sequence || 0),
      `${productCount} item`,
      cat.department || '-',
      cat.is_active ? 'Tampil di Menu' : 'Sembunyi',
      { id: cat.id, orgId: cat.org_id, name: cat.name, item: cat }
    ]
  })
}

function mapStockToProductRows(stockItems) {
  return stockItems.map((item) => [
    item.item_name,
    item.sku,
    item.category_name || '-',
    formatRupiah(0),
    formatRupiah(0),
    formatRupiah(item.sell_price),
    item.is_active ? 'Tampil di Menu' : 'Tidak Tampil di Menu',
    { id: item.id, orgId: item.org_id, item },
  ])
}

function mapStockToBarcodeRows(stockItems) {
  return stockItems.map((item) => [
    item.item_name,
    item.sku,
    item.barcode || '-',
    item.category_name || '-',
    item.is_active ? 'Tampil di Menu' : 'Tidak Tampil di Menu',
    `${formatQty(item.qty_on_hand)} ${item.unit || 'Pcs'}`,
    '',
  ])
}

function mapStockToInventoryRows(stockItems) {
  return stockItems.map((item) => [
    item.item_name,
    item.sku,
    `${formatQty(item.qty_on_hand)} ${item.unit || 'Pcs'}`,
    `${formatQty(item.qty_minimum)} ${item.unit || 'Pcs'}`,
    item.is_active ? 'Aktif' : 'Nonaktif',
  ])
}

function mapSalesDetailRows(details) {
  return details.map((row) => [
    row.m_stran?.tran_no || shortId(row.stran_id),
    row.m_stran?.tran_date ? new Date(row.m_stran.tran_date).toLocaleDateString('id-ID') : '-',
    row.item_name,
    formatQty(row.qty),
    formatRupiah(row.price),
    formatRupiah(row.discount),
    formatRupiah(row.total),
  ])
}

function buildSalesSummary(posData) {
  const sales = posData.sales || []
  const details = posData.salesDetails || []
  const paidSales = sales.filter((sale) => sale.payment_status === 'paid')
  const grandTotal = sales.reduce((sum, sale) => sum + Number(sale.grand_total || 0), 0)
  const paidTotal = paidSales.reduce((sum, sale) => sum + Number(sale.paid_total || 0), 0)
  const productQty = details.reduce((sum, row) => sum + Number(row.qty || 0), 0)
  const discountTotal = sales.reduce((sum, sale) => sum + Number(sale.discount_total || 0), 0)
  const taxTotal = sales.reduce((sum, sale) => sum + Number(sale.tax_total || 0), 0)
  const subTotal = grandTotal - taxTotal + discountTotal

  return {
    grandTotal,
    paidTotal,
    discountTotal,
    taxTotal,
    subTotal,
    unpaidTotal: Math.max(grandTotal - paidTotal, 0),
    transactionCount: sales.length,
    paidCount: paidSales.length,
    productQty,
    averageTransaction: sales.length ? grandTotal / sales.length : 0,
    averageProduct: sales.length ? productQty / sales.length : 0,
  }
}

function buildDashboardChartData(posData, period) {
  const sales = posData.sales || []
  const labels = period === 'Bulan'
    ? ['M1', 'M2', 'M3', 'M4']
    : period === 'Mingguan'
      ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
      : ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
  const buckets = labels.map((label) => ({ label, current: 0, previous: 0 }))
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  sales.forEach((sale) => {
    const date = new Date(sale.m_stran?.tran_date || sale.created_at)
    if (Number.isNaN(date.getTime())) return
    const value = Number(sale.grand_total || 0)
    if (!value) return

    if (period === 'Bulan') {
      if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) return
      const index = Math.min(Math.floor((date.getDate() - 1) / 7), 3)
      buckets[index].current += value
      return
    }

    if (period === 'Mingguan') {
      const index = (date.getDay() + 6) % 7
      buckets[index].current += value
      return
    }

    const hour = date.getHours()
    const index = Math.min(Math.max(Math.floor(hour / 2), 0), buckets.length - 1)
    buckets[index].current += value
  })

  const maxValue = Math.max(...buckets.map((item) => item.current), 0)
  return {
    buckets,
    maxValue,
    pointCount: buckets.filter((item) => item.current > 0).length,
    total: buckets.reduce((sum, item) => sum + item.current, 0),
  }
}

function buildChartPath(buckets, maxValue) {
  if (!buckets.length) return ''
  const max = maxValue || 1
  const width = 100
  const height = 100
  return buckets.map((item, index) => {
    const x = buckets.length === 1 ? 50 : (index / (buckets.length - 1)) * width
    const y = height - ((item.current / max) * 76 + 10)
    return `${index ? 'L' : 'M'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
}

function getRowsForPage(page, posData) {
  const stockItems = posData.stockItems || []
  const salesDetails = posData.salesDetails || []
  const categories = posData.categories || []

  if (page === 'Daftar Kategori') {
    return categories.map(cat => {
      const productCount = stockItems.filter(p => p.category_name === cat.name).length
      return [
        cat.name,
        String(cat.sequence || 0),
        `${productCount} item`,
        cat.department || '-',
        cat.is_active ? 'Tampil di Menu' : 'Sembunyi',
        { id: cat.id, name: cat.name }
      ]
    })
  }
  if (page === 'Daftar Produk') return mapStockToProductRows(stockItems)
  if (page === 'Cetak Barcode') return mapStockToBarcodeRows(stockItems)
  if (['Kelola Stok', 'Daftar Bahan Baku', 'Lap. Ringkasan Persediaan', 'Lap. Detail Persediaan'].includes(page)) {
    return mapStockToInventoryRows(stockItems)
  }
  if (page === 'Detail Penjualan') return mapSalesDetailRows(salesDetails)
  return []
}

function itemLabel(item) {
  return typeof item === 'string' ? item : item.label
}

function itemChildren(item) {
  return typeof item === 'string' ? [] : item.children || []
}

function flattenItems(items) {
  return items.flatMap((item) => [itemLabel(item), ...flattenItems(itemChildren(item))])
}

function Button({ className, variant = 'default', ...props }) {
  return <button className={cn('btn', `btn-${variant}`, className)} {...props} />
}

function Brand() {
  return (
    <div className="brand" aria-label="ManTechQ PoS">
      <span className="brand-mark">
        <span className="brand-mark-glow" />
        <CircleDollarSign size={18} />
      </span>
      <span className="brand-word">
        <span>ManTechQ</span>
        <strong>POS</strong>
      </span>
    </div>
  )
}

function Sidebar({ activePage, openGroup, setOpenGroup, setActivePage, isOpen, setIsOpen, activeOutlet, setIsPosMode }) {
  const [openNested, setOpenNested] = useState('Laporan Penjualan')
  const choose = (group, child) => {
    const nextPage = child || group.label
    setActivePage(nextPage)
    setOpenGroup(group.children.length || group.label === 'Menu Favorit' ? group.label : '')
    if (window.innerWidth < 900) setIsOpen(false)
    toast.success(`${nextPage} dibuka`)
  }

  return (
    <>
      <div className={cn('mobile-scrim', isOpen && 'show')} onClick={() => setIsOpen(false)} />
      <aside className={cn('sidebar', isOpen && 'open')}>
        <div className="sidebar-head">
          <Brand />
          <Button variant="ghost" className="mobile-close" onClick={() => setIsOpen(false)} aria-label="Tutup menu">
            <X size={18} />
          </Button>
        </div>

        <button className="outlet-switch" onClick={() => toast.info(`Outlet aktif: ${activeOutlet}`)}>
          <Store size={30} />
          <span>
            <small>Outlet</small>
            {activeOutlet}
          </span>
          <PanelLeftClose size={18} />
        </button>

        <div style={{ padding: '0 16px', marginBottom: '16px' }}>
          <button 
            onClick={() => setIsPosMode(true)}
            style={{ width: '100%', background: '#08a88c', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <ShoppingBag size={18} /> Buka PoS Kasir
          </button>
        </div>

        <nav className="side-nav" aria-label="Navigasi utama">
          {sidebarGroups.map((group) => {
            const Icon = group.icon
            const expanded = openGroup === group.label
            const flatChildren = flattenItems(group.children)
            const active = activePage === group.label || flatChildren.includes(activePage)
            const hasCaret = group.children.length || group.label === 'Menu Favorit'
            return (
              <section key={group.label}>
                <button
                  className={cn('side-item', active && 'active', expanded && 'expanded')}
                  onClick={() => {
                    if (group.children.length) {
                      setOpenGroup(expanded ? '' : group.label)
                      return
                    }
                    choose(group)
                  }}
                >
                  <Icon size={19} />
                  <span>{group.label}</span>
                  {hasCaret ? <ChevronDown className={cn('chevron', expanded && 'rotate')} size={17} /> : null}
                </button>
                {group.children.length && expanded ? (
                  <div className="submenu expanded">
                    {group.children.map((child) => {
                      const label = itemLabel(child)
                      const nested = itemChildren(child)
                      const nestedActive = nested.includes(activePage)
                      const nestedOpen = openNested === label || nestedActive
                      if (!nested.length) {
                        return (
                          <button key={label} className={cn(activePage === label && 'selected')} onClick={() => choose(group, label)}>
                            {label}
                          </button>
                        )
                      }
                      return (
                        <div key={label} className="submenu-group">
                          <button
                            className={cn((activePage === label || nestedActive) && 'selected')}
                            onClick={() => setOpenNested(nestedOpen ? '' : label)}
                          >
                            <span>{label}</span>
                            <ChevronDown className={cn('chevron', nestedOpen && 'rotate')} size={14} />
                          </button>
                          {nestedOpen ? (
                            <div className="nested-submenu">
                              {nested.map((grandchild) => (
                                <button
                                  key={grandchild}
                                  className={cn(activePage === grandchild && 'selected')}
                                  onClick={() => choose(group, grandchild)}
                                >
                                  {grandchild}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </section>
            )
          })}
        </nav>

        <button className="care-card" onClick={() => toast.info('ManTechQ Care siap membantu 24 jam')}>
          <span className="care-logo">
            <HelpCircle size={19} /> Care
          </span>
          <strong>Chat 24 Jam</strong>
        </button>
      </aside>
    </>
  )
}

function Topbar({ activeTab, setActiveTab, setIsOpen, onSignOut }) {
  const [showMore, setShowMore] = useState(false)
  return (
    <header className="topbar">
      <Button variant="ghost" className="hamburger" onClick={() => setIsOpen(true)} aria-label="Buka menu">
        <Menu size={21} />
      </Button>
      <div className="top-tabs" role="tablist" aria-label="Modul">
        {topTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              className={cn(activeTab === tab.label && 'active')}
              role="tab"
              aria-selected={activeTab === tab.label}
              onClick={() => setActiveTab(tab.label)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="more-wrap">
        <Button variant="ghost" className="capital-pill" onClick={() => setShowMore((value) => !value)} aria-expanded={showMore}>
          <span>Lainnya |</span>
          <CircleDollarSign size={20} />
          <strong>Dana Siap Pakai</strong>
          <ChevronDown size={15} />
        </Button>
        {showMore ? (
          <div className="dropdown">
            {moreMenu.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setShowMore(false)
                  toast.info(`${item} dipilih`)
                }}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="top-actions">
        <Button variant="ghost" aria-label="Cari">
          <Search size={19} />
        </Button>
        <Button variant="ghost" className="notif" aria-label="Notifikasi" onClick={() => toast('Tidak ada notifikasi baru')}>
          <Bell size={19} />
        </Button>
        <button className="account" onClick={() => toast.info('Software House - royyan')}>
          <span>SH</span>
          <strong>Software House</strong>
          <small>royyan</small>
        </button>
        <Button variant="ghost" aria-label="Keluar akun" onClick={onSignOut}>
          <MoreVertical size={19} />
        </Button>
      </div>
    </header>
  )
}

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
    return <SalesDetailReportPage posData={posData} />
  }
  if (activePage === 'Penjualan Per Periode') {
    return <SalesPeriodReportPage posData={posData} />
  }
  if (activePage === 'Penjualan Outlet') {
    return <SalesOutletReportPage posData={posData} />
  }
  if (activePage === 'Laporan Uang Muka') {
    return <SalesDownPaymentReportPage posData={posData} />
  }
  if (activePage === 'Laporan Jenis Bayar') {
    return <SalesPaymentMethodReportPage posData={posData} />
  }
  if (activePage === 'Laporan Jenis Order') {
    return <SalesOrderTypeReportPage posData={posData} />
  }
  if (activePage === 'Laporan Void') {
    return <SalesVoidReportPage posData={posData} />
  }
  if (activePage === 'Laporan Refund') {
    return <SalesRefundReportPage posData={posData} />
  }
  if (activePage === 'Laporan Proses Order') {
    return <KitchenOrderProcessReportPage posData={posData} />
  }
  if (activePage === 'Laporan Proses Produk') {
    return <KitchenProductProcessReportPage posData={posData} />
  }
  if (activePage === 'Penjualan Produk') {
    return <ProductSalesReportPage posData={posData} />
  }
  if (activePage === 'Penjualan Kategori') {
    return <CategorySalesReportPage posData={posData} />
  }
  if (reportPageConfigs[activePage]) {
    return <MajooGenericReportPage config={reportPageConfigs[activePage]} posData={posData} />
  }
  if (activePage === 'Cetak Barcode') {
    return <BarcodePrintView posData={posData} />
  }
  if (productPageConfigs[activePage]) {
    return <ProductDirectoryPage config={productPageConfigs[activePage]} onStartFlow={onStartFlow} posData={posData} />
  }

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
  const controls = blueprint.controls || (blueprint.type === 'report' ? 'date-status' : 'status-tabs')
  const apiRows = getRowsForPage(activePage, posData)
  const rows = apiRows.length > 0 ? apiRows : (blueprint.rows || [])
  const filteredRows = rows.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase()))
  const actionIcon = (action) => {
    if (action.toLowerCase().includes('impor')) return Truck
    if (action.toLowerCase().includes('ekspor')) return FileText
    return Sparkles
  }

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
                    else toast.success(`${action} ${blueprint.title}`)
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
                <button key={item} className={item === 'Semua' ? 'active' : ''} onClick={() => toast.info(item)}>
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
    </main>
  )
}


/** 
 * BarcodeLabel renders one barcode label using JsBarcode via an SVG ref.
 * The barcode encodes the SKU so the POS scanner can look it up on Enter.
 */
function BarcodeLabel({ item }) {
  const svgRef = useRef(null)
  const barcodeValue = (item.sku || `SKU-${String(item.id || '').slice(0, 8)}`).trim()

  useEffect(() => {
    if (!svgRef.current) return
    try {
      import('jsbarcode').then(({ default: JsBarcode }) => {
        JsBarcode(svgRef.current, barcodeValue, {
          format: 'CODE128',
          width: 2,
          height: 50,
          displayValue: false,
          margin: 4,
          background: '#ffffff',
          lineColor: '#000000',
        })
      })
    } catch (e) {
      console.warn('Barcode error:', e)
    }
  }, [barcodeValue])

  return (
    <div className="bc-label">
      <div className="bc-product-name">{item.item_name}</div>
      <div className="bc-price">{formatRupiah(item.sell_price || 0)}</div>
      <svg ref={svgRef} className="bc-svg" />
      <div className="bc-sku">{barcodeValue}</div>
    </div>
  )
}

function BarcodePrintView({ posData }) {
  const stockItems = posData?.stockItems || []
  const [selected, setSelected] = useState(() => new Set(stockItems.map((_, i) => i)))
  const [copies, setCopies] = useState(1)

  const toggleItem = (idx) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === stockItems.length) setSelected(new Set())
    else setSelected(new Set(stockItems.map((_, i) => i)))
  }

  const handlePrint = () => {
    window.print()
  }

  const selectedItems = stockItems.filter((_, i) => selected.has(i))
  const printItems = []
  for (let c = 0; c < copies; c++) selectedItems.forEach(item => printItems.push(item))

  return (
    <main className="content bc-page">
      {/* ── Screen: header + selector ── */}
      <div className="bc-screen-only">
        <CapitalBanner compact />
        <section className="panel module-page">
          <div className="majoo-page-head">
            <div className="majoo-title">
              <h1>Cetak Barcode</h1>
              <p>Pilih produk lalu cetak. Scan barcode di kasir → produk langsung masuk keranjang.</p>
            </div>
            <div className="top-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                Salinan:
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={copies}
                  onChange={e => setCopies(Math.max(1, Math.min(10, Number(e.target.value))))}
                  style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 600 }}
                />
              </label>
              <Button onClick={handlePrint} disabled={selected.size === 0}>
                <Printer size={16} /> Cetak (A4) {selected.size > 0 ? `· ${selected.size} produk` : ''}
              </Button>
            </div>
          </div>

          {/* Info banner */}
          <div style={{ margin: '0 24px 16px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: '#166534' }}>
            <ScanBarcode size={18} color="#16a34a" />
            <span>Barcode dikodekan berdasarkan <strong>SKU</strong> produk. Kasir cukup scan → produk otomatis masuk keranjang belanja.</span>
          </div>

          {/* Selector table */}
          <div style={{ padding: '0 24px 24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', width: 40 }}>
                    <input type="checkbox" checked={selected.size === stockItems.length && stockItems.length > 0} onChange={toggleAll} />
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Nama Produk</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>SKU (Barcode)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Harga Jual</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Preview</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
                    <ScanBarcode size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                    <p>Belum ada produk. Tambahkan produk di Daftar Produk terlebih dahulu.</p>
                  </td></tr>
                )}
                {stockItems.map((item, idx) => (
                  <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9', background: selected.has(idx) ? '#f0fdf4' : 'transparent' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <input type="checkbox" checked={selected.has(idx)} onChange={() => toggleItem(idx)} />
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 500, color: '#1e293b' }}>{item.item_name}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#0891b2', fontSize: 12 }}>
                      {item.sku || <span style={{ color: '#f59e0b' }}>⚠ Belum ada SKU</span>}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>{formatRupiah(item.sell_price || 0)}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <BarcodeLabel item={item} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Print-only: grid of labels ── */}
      <div className="bc-print-only">
        <div className="bc-print-grid">
          {printItems.map((item, idx) => (
            <BarcodeLabel key={idx} item={item} />
          ))}
        </div>
      </div>
    </main>
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
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })

  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    const salesIds = new Set(sales.map(s => s.stran_id))
    const salesDetails = posData?.salesDetails?.filter(d => salesIds.has(d.stran_id)) || []
    return { ...posData, sales, salesDetails }
  }, [posData, range])

  const summary = useMemo(() => buildSalesSummary(filteredPosData), [filteredPosData])
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

  const [pickStep, setPickStep] = useState(0)

  useEffect(() => {
    if (open) {
      setDraft(range)
      setPickStep(0)
    }
  }, [open, range])

  const choosePreset = ([, label, display]) => {
    setDraft((current) => ({ ...current, label, display }))
    setPickStep(0)
  }

  const handleSelectDate = (day, monthTitle) => {
    if (pickStep === 0) {
      toast.success(`Tanggal Mulai: ${day} ${monthTitle}`)
      setDraft(current => ({
        ...current,
        label: `Kustom (${day} ${monthTitle.split(' ')[0]})`,
        display: `${day} ${monthTitle} - ${day} ${monthTitle}`
      }))
      setPickStep(1)
    } else {
      toast.success(`Tanggal Akhir: ${day} ${monthTitle}`)
      setDraft(current => {
        const startStr = current.display.split(' - ')[0]
        return {
          ...current,
          display: `${startStr} - ${day} ${monthTitle}`
        }
      })
      setPickStep(0)
    }
  }

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const match = dateStr.match(/^(\d+)\s+([A-Za-z]+)\s+(\d+)$/);
    if (match) return { day: parseInt(match[1]), month: match[2], year: parseInt(match[3]) };
    return null;
  }

  const getMonthProps = (title) => {
    const titleMatch = title.match(/^([A-Za-z]+)\s+(\d+)$/);
    if (!titleMatch) return {};
    const month = titleMatch[1];
    const year = parseInt(titleMatch[2]);
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonthIdx = monthNames.indexOf(month) + (year * 12);
    
    const parts = draft.display.split(' - ');
    let start = parseDate(parts[0]);
    let end = parseDate(parts[1] || parts[0]);

    if (start && end) {
      const startVal = start.year * 10000 + monthNames.indexOf(start.month) * 100 + start.day;
      const endVal = end.year * 10000 + monthNames.indexOf(end.month) * 100 + end.day;
      if (startVal > endVal) {
        const temp = start;
        start = end;
        end = temp;
      }
    }

    const startMonthIdx = start ? monthNames.indexOf(start.month) + (start.year * 12) : null;
    const endMonthIdx = end ? monthNames.indexOf(end.month) + (end.year * 12) : null;

    let selectedStart = null;
    let selectedEnd = null;
    let rangeStart = null;
    let rangeEnd = null;

    if (start && startMonthIdx === currentMonthIdx) {
      selectedStart = start.day;
      rangeStart = start.day;
    } else if (start && currentMonthIdx > startMonthIdx) {
      rangeStart = 1;
    }

    if (end && endMonthIdx === currentMonthIdx) {
      selectedEnd = end.day;
      rangeEnd = end.day;
    } else if (end && currentMonthIdx < endMonthIdx) {
      rangeEnd = 31;
    }

    return { selectedStart, selectedEnd, rangeStart, rangeEnd };
  }

  const meiProps = getMonthProps("Mei 2026");
  const juniProps = getMonthProps("Juni 2026");

  return (
    <div className="date-picker-wrap">
      <button className="date-trigger" onClick={onToggle}>
        <CalendarDays size={18} />
        {range.label}
      </button>
      {open ? createPortal(
        <div className="modal-backdrop" style={{ zIndex: 99998 }} onClick={onCancel}>
          <div className="date-popover" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', transform: 'none', margin: 'auto' }}>
            <div className="date-presets">
              {presets.map((preset) => (
                <button key={preset[0]} onClick={() => choosePreset(preset)}>{preset[0]}</button>
              ))}
            </div>
            <MiniMonth title="Mei 2026" days={mayDays} mutedFrom={31} {...meiProps} onSelectDate={handleSelectDate} />
            <MiniMonth title="Juni 2026" days={juneDays} {...juniProps} onSelectDate={handleSelectDate} />
            <div className="date-time-panel">
              <label>Dari Tanggal<span>{draft.display.split(' - ')[0]}</span></label>
              <label>Dari Pukul<input value={draft.startTime} onChange={(event) => setDraft((current) => ({ ...current, startTime: event.target.value }))} /></label>
              <label>Hingga Tanggal<span>{draft.display.split(' - ')[1] || draft.display.split(' - ')[0]}</span></label>
              <label>Hingga Pukul<input value={draft.endTime} onChange={(event) => setDraft((current) => ({ ...current, endTime: event.target.value }))} /></label>
            </div>
            <footer style={{ width: '100%' }}>
              <strong>{draft.display}</strong>
              <div>
                <button onClick={onCancel} style={{ border: 0, background: 'transparent', color: '#4b5563', fontWeight: 600, marginRight: 16 }}>Batal</button>
                <Button onClick={() => onProcess(draft)}>Proses</Button>
              </div>
            </footer>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  )
}

function MiniMonth({ title, days, selectedStart, selectedEnd, rangeStart, rangeEnd, onSelectDate }) {
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
          const minRange = rangeStart !== null && rangeEnd !== null ? Math.min(rangeStart, rangeEnd) : null
          const maxRange = rangeStart !== null && rangeEnd !== null ? Math.max(rangeStart, rangeEnd) : null
          const inRange = minRange !== null && maxRange !== null && day >= minRange && day <= maxRange
          
          return (
            <button 
              key={day} 
              className={cn(inRange && 'in-range', selected && 'selected')}
              onClick={() => onSelectDate && onSelectDate(day, title)}
            >
              {day}
            </button>
          )
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
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })

  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    const salesIds = new Set(sales.map(s => s.stran_id))
    const salesDetails = posData?.salesDetails?.filter(d => salesIds.has(d.stran_id)) || []
    return { ...posData, sales, salesDetails }
  }, [posData, range])

  const summary = useMemo(() => buildSalesSummary(filteredPosData), [filteredPosData])
  const sales = filteredPosData.sales || []
  const liveDetailMetrics = [
    ['Total Penjualan', formatRupiah(summary.grandTotal)],
    ['Total Transaksi', String(summary.transactionCount)],
    ['Penjualan Bersih', formatRupiah(summary.grandTotal)],
    ['Total Pembayaran', formatRupiah(summary.paidTotal)],
    ['Total Piutang', formatRupiah(summary.unpaidTotal)],
  ]
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [timeBasis, setTimeBasis] = useState('Waktu Order')
  const [filterOpen, setFilterOpen] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Semua Filter')
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

  const sortedSales = useMemo(() => {
    return [...sales].sort((a, b) => {
      const timeA = new Date(a.m_stran?.tran_date || a.created_at).getTime()
      const timeB = new Date(b.m_stran?.tran_date || b.created_at).getTime()
      return timeBasis === 'Waktu Order' ? timeB - timeA : timeA - timeB
    })
  }, [sales, timeBasis])

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
          <ReportSelectDropdown
            value={timeBasis}
            options={['Waktu Order', 'Waktu Bayar']}
            open={timeOpen}
            setOpen={setTimeOpen}
            onSelect={(value) => {
              setTimeBasis(value)
              toast.info(`Basis tanggal: ${value}`)
            }}
          />
        </div>

        <div className="detail-metrics-grid">
          {liveDetailMetrics.map(([label, value]) => (
            <article key={label} className="detail-metric-card">
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

        <div className="detail-table-wrap">
          <table className="detail-report-table">
            <thead>
              <tr>
                {visibleColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th />
              </tr>
            </thead>
            {sortedSales.length > 0 && (
              <tbody>
                {sortedSales.map((sale) => (
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
        </div>
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
    <div className="modal-backdrop" style={{ zIndex: 9999 }}>
      <div className="report-dialog receipt-dialog" style={{ width: 420, padding: 0, overflow: 'hidden' }}>
        <header className="hide-on-print" style={{ background: 'var(--brand)', color: '#fff', padding: '16px 20px' }}>
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
        
        <footer className="hide-on-print" style={{ padding: '16px 20px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          <Button onClick={() => window.print()}><Printer size={16} /> Cetak Struk</Button>
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

function SalesPeriodReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })

  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    const salesIds = new Set(sales.map(s => s.stran_id))
    const salesDetails = posData?.salesDetails?.filter(d => salesIds.has(d.stran_id)) || []
    return { ...posData, sales, salesDetails }
  }, [posData, range])

  const summary = useMemo(() => buildSalesSummary(filteredPosData), [filteredPosData])
  const sales = filteredPosData.sales || []
  const salesDetails = filteredPosData.salesDetails || []
  const totalItems = salesDetails.reduce((sum, item) => sum + Number(item.qty), 0)
  const grossProfit = summary.grandTotal * 0.3

  const livePeriodMetrics = [
    ['Total Penjualan', formatRupiah(summary.grandTotal)],
    ['Total Laba Kotor', formatRupiah(grossProfit)],
    ['Total Transaksi', String(summary.transactionCount)],
    ['Total Produk', String(totalItems)],
  ]

  const salesByDate = {}
  sales.forEach(sale => {
    const dateObj = new Date(sale.m_stran?.tran_date || sale.created_at)
    const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    if (!salesByDate[dateStr]) salesByDate[dateStr] = { count: 0, total: 0 }
    salesByDate[dateStr].count++
    salesByDate[dateStr].total += Number(sale.grand_total)
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

  const chartData = Object.entries(salesByDate)
    .map(([date, data]) => ({
      dateObj: new Date(date),
      label: date.split(' ')[0] + ' ' + date.split(' ')[1],
      sales: data.total,
      profit: data.total * 0.3
    }))
    .sort((a, b) => a.dateObj - b.dateObj);

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
            <div className="period-chart-box" aria-label="Grafik Penjualan Per Periode" style={{ height: 320, padding: '24px 0 0 0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
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
                    formatter={(value, name) => [formatRupiah(value), name === 'sales' ? 'Total Penjualan' : 'Laba Kotor']} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#06b98f" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#06b98f' }} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#06b98f' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#0090ff" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#0090ff' }} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0090ff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-legend" style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i style={{ width: 10, height: 10, borderRadius: '50%', background: '#06b98f' }} /> Total Penjualan
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i style={{ width: 10, height: 10, borderRadius: '50%', background: '#0090ff' }} /> Laba Kotor
                </span>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-metrics-grid period-metrics-grid">
          {livePeriodMetrics.map(([label, value]) => (
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
            {sales.length > 0 && (
              <tbody>
                {Object.entries(salesByDate).map(([date, data]) => {
                  const itemsCount = Math.round(data.count * (totalItems / (summary.transactionCount || 1)))
                  return (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>{formatRupiah(data.total)}</td>
                      <td>{formatRupiah(data.total * 0.3)}</td>
                      <td>{itemsCount}</td>
                      <td>{data.count}</td>
                      <td>Rp 0</td>
                      <td>Rp 0</td>
                      <td>{formatRupiah(data.total / data.count)}</td>
                      <td>{(itemsCount / data.count).toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
          {sales.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function ReportSelectDropdown({ value, options, open, setOpen, onSelect, wide }) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])

  return (
    <div className={cn('select-dropdown-wrap', wide && 'wide-select-wrap')} ref={dropdownRef}>
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

function SalesOutletReportPage({ posData }) {
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

  // Aggregation Logic
  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    const salesIds = new Set(sales.map(s => s.stran_id))
    const salesDetails = posData?.salesDetails?.filter(d => salesIds.has(d.stran_id)) || []
    return { ...posData, sales, salesDetails }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  const salesDetails = filteredPosData.salesDetails || []

  const salesByOutlet = useMemo(() => {
    const grouped = sales.reduce((acc, sale) => {
      const outletId = sale.m_stran?.outlet_id || 'Unknown'
      const outletName = sale.m_stran?.outlet_id ? `Outlet ${shortId(sale.m_stran.outlet_id)}` : 'Software House'
      
      if (!acc[outletId]) {
        acc[outletId] = {
          name: outletName,
          totalPenjualan: 0,
          labaKotor: 0,
          jumlahTransaksi: 0,
          jumlahProduk: 0
        }
      }
      
      const saleTotal = Number(sale.grand_total || 0)
      acc[outletId].totalPenjualan += saleTotal
      acc[outletId].jumlahTransaksi += 1

      // Qty & Profit
      const details = salesDetails.filter(d => d.stran_id === sale.stran_id || d.m_stran_id === sale.id)
      const saleQty = details.reduce((sum, d) => sum + Number(d.qty || 0), 0)
      acc[outletId].jumlahProduk += saleQty
      
      // Calculate profit if buy_price exists, else rough 30% mock for visualization
      const saleProfit = details.reduce((sum, d) => sum + (Number(d.qty || 0) * (Number(d.price || 0) - Number(d.buy_price || d.price * 0.7))), 0)
      acc[outletId].labaKotor += saleProfit

      return acc
    }, {})

    return Object.values(grouped).filter(outlet => outlet.name.toLowerCase().includes(query.toLowerCase()))
  }, [sales, salesDetails, query])

  const overallPenjualan = salesByOutlet.reduce((sum, o) => sum + o.totalPenjualan, 0)
  const overallLaba = salesByOutlet.reduce((sum, o) => sum + o.labaKotor, 0)
  const overallTransaksi = salesByOutlet.reduce((sum, o) => sum + o.jumlahTransaksi, 0)
  const overallProduk = salesByOutlet.reduce((sum, o) => sum + o.jumlahProduk, 0)

  // Chart data
  const chartData = salesByOutlet.map(o => ({
    name: o.name,
    value: chartMetric === 'Penjualan' ? o.totalPenjualan : chartMetric === 'Laba' ? o.labaKotor : chartMetric === 'Transaksi' ? o.jumlahTransaksi : o.jumlahProduk
  }))

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
            <h2>{formatRupiah(overallPenjualan)}</h2>
            <p>Total Penjualan</p>
          </div>
          <div>
            <strong>{formatRupiah(overallLaba)}</strong>
            <span>Laba Kotor</span>
          </div>
          <div>
            <strong>{overallTransaksi}</strong>
            <span>Transaksi</span>
          </div>
          <div>
            <strong>{overallProduk}</strong>
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
              <div className="period-chart-box outlet-chart-box" aria-label="Grafik Penjualan Outlet" style={{ height: 320, padding: '24px 0 0 0', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#666' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => (chartMetric === 'Penjualan' || chartMetric === 'Laba') ? (value > 0 ? `Rp ${(value / 1000).toLocaleString('id-ID')}rb` : '0') : value} 
                      tick={{ fontSize: 11, fill: '#666' }}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value) => [(chartMetric === 'Penjualan' || chartMetric === 'Laba') ? formatRupiah(value) : value, chartMetric]} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="var(--brand)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
            {salesByOutlet.length > 0 && (
              <tbody>
                {salesByOutlet.map((outlet, idx) => {
                  const pPenjualan = overallPenjualan ? (outlet.totalPenjualan / overallPenjualan) * 100 : 0
                  const pLaba = overallLaba ? (outlet.labaKotor / overallLaba) * 100 : 0
                  const pProduk = overallProduk ? (outlet.jumlahProduk / overallProduk) * 100 : 0
                  const pTransaksi = overallTransaksi ? (outlet.jumlahTransaksi / overallTransaksi) * 100 : 0
                  const penjualanPerTransaksi = outlet.jumlahTransaksi ? outlet.totalPenjualan / outlet.jumlahTransaksi : 0
                  const produkPerTransaksi = outlet.jumlahTransaksi ? outlet.jumlahProduk / outlet.jumlahTransaksi : 0

                  return (
                    <tr key={idx}>
                      <td>{outlet.name}</td>
                      <td>{formatRupiah(outlet.totalPenjualan)}</td>
                      <td>{formatRupiah(outlet.labaKotor)}</td>
                      <td>{outlet.jumlahProduk}</td>
                      <td>{outlet.jumlahTransaksi}</td>
                      <td>{pPenjualan.toFixed(2)}%</td>
                      <td>{pLaba.toFixed(2)}%</td>
                      <td>{pProduk.toFixed(2)}%</td>
                      <td>{pTransaksi.toFixed(2)}%</td>
                      <td>{formatRupiah(penjualanPerTransaksi)}</td>
                      <td>{produkPerTransaksi.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
          {salesByOutlet.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function SalesDownPaymentReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(true)
  const [periodType, setPeriodType] = useState('Hari')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [chartMetric, setChartMetric] = useState('Penjualan')
  const [metricOpen, setMetricOpen] = useState(false)

  // Aggregation Logic
  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    return { ...posData, sales }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  const dpSales = useMemo(() => {
    return sales.filter(s => {
      const paid = Number(s.paid_total || 0)
      const grand = Number(s.grand_total || 0)
      return paid > 0 && paid < grand
    })
  }, [sales])

  const filteredSales = useMemo(() => {
    return dpSales.filter(sale => {
      const noTrans = sale.m_stran?.tran_no || sale.tran_no || ''
      const customer = sale.m_stran?.customer_id ? `Pelanggan ${shortId(sale.m_stran.customer_id)}` : 'Umum'
      return noTrans.toLowerCase().includes(query.toLowerCase()) || customer.toLowerCase().includes(query.toLowerCase())
    })
  }, [dpSales, query])

  const totalDp = dpSales.reduce((sum, s) => sum + Number(s.paid_total || 0), 0)

  // Group by date for the chart
  const dpByDate = useMemo(() => {
    const grouped = dpSales.reduce((acc, sale) => {
      const dateObj = new Date(sale.m_stran?.tran_date || sale.created_at)
      const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, value: 0 }
      }
      acc[dateStr].value += Number(sale.paid_total || 0)
      return acc
    }, {})
    return Object.values(grouped)
  }, [dpSales])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan Uang Muka diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan Uang Muka ${format} disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Laporan Uang Muka</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari Pelanggan/Transaksi ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <section className="outlet-kpi-strip" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="outlet-main-kpi">
            <h2>{dpSales.length}</h2>
            <p>Total Transaksi Uang Muka</p>
          </div>
          <div>
            <strong style={{ color: 'var(--brand)', fontSize: 24 }}>{formatRupiah(totalDp)}</strong>
            <span>Total Penerimaan Uang Muka</span>
          </div>
        </section>

        <section className="period-chart-section outlet-chart-section">
          <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
            <span>Grafik Laporan Uang Muka</span>
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
                  options={['Penjualan', 'Transaksi']}
                  open={metricOpen}
                  setOpen={setMetricOpen}
                  onSelect={(value) => {
                    setChartMetric(value)
                    toast.info(`Metrik grafik: ${value}`)
                  }}
                />
              </div>
              <div className="period-chart-box outlet-chart-box" aria-label="Grafik Laporan Uang Muka" style={{ height: 320, padding: '24px 0 0 0', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dpByDate} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#666' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => value > 0 ? `Rp ${(value / 1000).toLocaleString('id-ID')}rb` : '0'} 
                      tick={{ fontSize: 11, fill: '#666' }}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value) => [formatRupiah(value), 'Total DP']} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="var(--brand)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-table-wrap">
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Laporan Uang Muka'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredSales.length > 0 && (
              <tbody>
                {filteredSales.map((sale, idx) => (
                  <tr key={idx}>
                    <td>{sale.m_stran?.tran_no || sale.tran_no || '-'}</td>
                    <td>{new Date(sale.m_stran?.tran_date || sale.created_at).toLocaleString('id-ID')}</td>
                    <td>{sale.m_stran?.customer_id ? `Pelanggan ${shortId(sale.m_stran.customer_id)}` : 'Umum'}</td>
                    <td>{sale.m_stran?.created_by || 'Admin'}</td>
                    <td>{formatRupiah(sale.paid_total)}</td>
                    <td>{sale.m_stran?.outlet_id ? `Outlet ${shortId(sale.m_stran.outlet_id)}` : 'Software House'}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredSales.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function getPaymentMethod(sale) {
  const note = sale.note || ''
  if (note.includes('Split:')) return 'Split Payment'
  if (note.includes('DP / Uang Muka:')) return note.split('DP / Uang Muka: ')[1]?.split(' |')[0]?.trim() || 'Tunai'
  if (note.includes('Pembayaran:')) return note.split('Pembayaran: ')[1]?.split(' |')[0]?.trim() || 'Tunai'
  if (note.includes('Metode bayar:')) return note.split('Metode bayar: ')[1]?.split(' |')[0]?.trim() || 'Tunai'
  return 'Tunai'
}

function SalesPaymentMethodReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(true)
  const [periodType, setPeriodType] = useState('Hari')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [chartMetric, setChartMetric] = useState('Penjualan')
  const [metricOpen, setMetricOpen] = useState(false)

  // Aggregation Logic
  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    return { ...posData, sales }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  
  // Group by payment method
  const { paymentStats, totalMetrics, chartData } = useMemo(() => {
    const stats = {}
    let totalTransactions = 0
    let totalSales = 0
    let totalDpCount = 0
    let totalDpSales = 0
    let totalDpReceived = 0
    
    // For chart
    const byDate = {}

    sales.forEach(sale => {
      const method = getPaymentMethod(sale)
      const grandTotal = Number(sale.grand_total || 0)
      const paidTotal = Number(sale.paid_total || 0)
      
      const isDp = paidTotal > 0 && paidTotal < grandTotal
      
      if (!stats[method]) {
        stats[method] = {
          method,
          trxCount: 0,
          trxDepositCount: 0,
          trxDpCount: 0,
          salesRp: 0,
          salesDepositRp: 0,
          dpReceivedRp: 0,
        }
      }
      
      stats[method].trxCount += 1
      stats[method].salesRp += grandTotal
      totalTransactions += 1
      totalSales += grandTotal
      
      if (isDp) {
        stats[method].trxDpCount += 1
        stats[method].dpReceivedRp += paidTotal
        totalDpCount += 1
        totalDpSales += grandTotal
        totalDpReceived += paidTotal
      }
      
      const dateObj = new Date(sale.m_stran?.tran_date || sale.created_at)
      if (Number.isNaN(dateObj.getTime())) return
      const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      if (!byDate[dateStr]) {
        byDate[dateStr] = { name: dateStr, Tunai: 0, QRIS: 0, Transfer: 0, 'Split Payment': 0 }
      }
      if (byDate[dateStr][method] === undefined) byDate[dateStr][method] = 0
      byDate[dateStr][method] += (chartMetric === 'Transaksi' ? 1 : grandTotal)
    })
    
    const statsArray = Object.values(stats).map(item => ({
      ...item,
      trxPercent: totalTransactions > 0 ? (item.trxCount / totalTransactions) * 100 : 0,
      salesPercent: totalSales > 0 ? (item.salesRp / totalSales) * 100 : 0,
    }))
    
    statsArray.sort((a, b) => b.salesRp - a.salesRp)
    
    return {
      paymentStats: statsArray,
      totalMetrics: {
        trxCount: totalTransactions,
        salesRp: totalSales,
        methodCount: Object.keys(stats).length,
        trxDpCount: totalDpCount,
        dpSalesRp: totalDpSales,
        dpReceivedRp: totalDpReceived,
      },
      chartData: Object.values(byDate)
    }
  }, [sales, chartMetric])

  const filteredStats = useMemo(() => {
    return paymentStats.filter(stat => stat.method.toLowerCase().includes(query.toLowerCase()))
  }, [paymentStats, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan Jenis Bayar diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan Jenis Bayar ${format} disiapkan`)
  }

  const COLORS = {
    Tunai: '#08a88c',
    QRIS: '#3b82f6',
    Transfer: '#8b5cf6',
    'Split Payment': '#f59e0b',
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Laporan Jenis Bayar</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari Jenis Pembayaran ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <section className="outlet-kpi-strip" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, overflowX: 'auto' }}>
          <div className="outlet-main-kpi" style={{ minWidth: 150 }}>
            <h2 style={{ fontSize: 20 }}>{totalMetrics.trxCount}</h2>
            <p style={{ fontSize: 11 }}>Total Transaksi Terbayar</p>
          </div>
          <div style={{ minWidth: 150 }}>
            <strong style={{ color: '#eab308', fontSize: 20 }}>{formatRupiah(totalMetrics.salesRp)}</strong>
            <span style={{ fontSize: 11 }}>Total Penjualan Terbayar</span>
          </div>
          <div style={{ minWidth: 150 }}>
            <strong style={{ color: '#3b82f6', fontSize: 20 }}>{totalMetrics.methodCount}</strong>
            <span style={{ fontSize: 11 }}>Total Jenis Pembayaran</span>
          </div>
          <div style={{ minWidth: 150 }}>
            <strong style={{ color: '#06b6d4', fontSize: 20 }}>0</strong>
            <span style={{ fontSize: 11 }}>Total Transaksi Deposit</span>
          </div>
          <div style={{ minWidth: 150 }}>
            <strong style={{ color: '#ef4444', fontSize: 20 }}>{totalMetrics.trxDpCount}</strong>
            <span style={{ fontSize: 11 }}>Total Transaksi Uang Muka</span>
          </div>
          <div style={{ minWidth: 150 }}>
            <strong style={{ color: '#a855f7', fontSize: 20 }}>Rp 0</strong>
            <span style={{ fontSize: 11 }}>Total Penjualan Deposit</span>
          </div>
          <div style={{ minWidth: 150 }}>
            <strong style={{ color: '#f97316', fontSize: 20 }}>{formatRupiah(totalMetrics.dpReceivedRp)}</strong>
            <span style={{ fontSize: 11 }}>Total Penerimaan Uang Muka</span>
          </div>
        </section>

        <section className="period-chart-section outlet-chart-section">
          <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
            <span>Grafik Jenis Pembayaran</span>
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
                  options={['Penjualan', 'Transaksi']}
                  open={metricOpen}
                  setOpen={setMetricOpen}
                  onSelect={(value) => {
                    setChartMetric(value)
                    toast.info(`Metrik grafik: ${value}`)
                  }}
                />
              </div>
              <div className="period-chart-box outlet-chart-box" aria-label="Grafik Jenis Pembayaran" style={{ height: 320, padding: '24px 0 0 0', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#666' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => chartMetric === 'Penjualan' ? (value > 0 ? `Rp ${(value / 1000).toLocaleString('id-ID')}rb` : '0') : value} 
                      tick={{ fontSize: 11, fill: '#666' }}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value, name) => [chartMetric === 'Penjualan' ? formatRupiah(value) : value, name]} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    {Object.keys(COLORS).map(key => (
                      <Bar key={key} dataKey={key} stackId="a" fill={COLORS[key]} radius={[0, 0, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-table-wrap">
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Laporan Jenis Bayar'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredStats.length > 0 && (
              <tbody>
                {filteredStats.map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.method}</td>
                    <td>{stat.trxCount}</td>
                    <td>{stat.trxPercent.toFixed(2)}%</td>
                    <td>{stat.trxDepositCount}</td>
                    <td>{stat.trxDpCount}</td>
                    <td>{formatRupiah(stat.salesRp)}</td>
                    <td>{stat.salesPercent.toFixed(2)}%</td>
                    <td>{formatRupiah(stat.salesDepositRp)}</td>
                    <td>{formatRupiah(stat.dpReceivedRp)}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredStats.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function getOrderType(sale) {
  const note = sale.note || ''
  if (note.includes('Dine-in') || note.includes('Dine In')) return 'Dine In'
  if (note.includes('Take Away') || note.includes('Bungkus')) return 'Take Away'
  if (note.includes('Delivery') || note.includes('Kirim')) return 'Delivery'
  if (note.includes('Online')) return 'Online Order'
  return 'Reguler'
}

function SalesOrderTypeReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(true)
  const [periodType, setPeriodType] = useState('Hari')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [chartMetric, setChartMetric] = useState('Penjualan')
  const [metricOpen, setMetricOpen] = useState(false)

  // Aggregation Logic
  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    return { ...posData, sales }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  
  // Group by order type
  const { orderStats, totalMetrics, chartData } = useMemo(() => {
    const stats = {}
    let totalTransactions = 0
    let totalSales = 0
    
    // For chart
    const byDate = {}

    sales.forEach(sale => {
      const type = getOrderType(sale)
      const grandTotal = Number(sale.grand_total || 0)
      
      if (!stats[type]) {
        stats[type] = {
          type,
          trxCount: 0,
          salesRp: 0,
        }
      }
      
      stats[type].trxCount += 1
      stats[type].salesRp += grandTotal
      totalTransactions += 1
      totalSales += grandTotal
      
      const dateObj = new Date(sale.m_stran?.tran_date || sale.created_at)
      if (Number.isNaN(dateObj.getTime())) return
      const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      if (!byDate[dateStr]) {
        byDate[dateStr] = { name: dateStr, 'Dine In': 0, 'Take Away': 0, 'Delivery': 0, 'Online Order': 0, 'Reguler': 0 }
      }
      if (byDate[dateStr][type] === undefined) byDate[dateStr][type] = 0
      byDate[dateStr][type] += (chartMetric === 'Transaksi' ? 1 : grandTotal)
    })
    
    const statsArray = Object.values(stats).map(item => ({
      ...item,
      trxPercent: totalTransactions > 0 ? (item.trxCount / totalTransactions) * 100 : 0,
      salesPercent: totalSales > 0 ? (item.salesRp / totalSales) * 100 : 0,
    }))
    
    statsArray.sort((a, b) => b.salesRp - a.salesRp)
    
    return {
      orderStats: statsArray,
      totalMetrics: {
        trxCount: totalTransactions,
        salesRp: totalSales,
      },
      chartData: Object.values(byDate)
    }
  }, [sales, chartMetric])

  const filteredStats = useMemo(() => {
    return orderStats.filter(stat => stat.type.toLowerCase().includes(query.toLowerCase()))
  }, [orderStats, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan Jenis Order diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan Jenis Order ${format} disiapkan`)
  }

  const COLORS = {
    'Dine In': '#08a88c',
    'Take Away': '#3b82f6',
    'Delivery': '#8b5cf6',
    'Online Order': '#f59e0b',
    'Reguler': '#64748b'
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Laporan Jenis Order</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari Jenis Order ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <section className="outlet-kpi-strip" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="outlet-main-kpi">
            <h2>{totalMetrics.trxCount}</h2>
            <p>Total Transaksi</p>
          </div>
          <div>
            <strong style={{ color: '#3b82f6', fontSize: 24 }}>{formatRupiah(totalMetrics.salesRp)}</strong>
            <span>Total Penjualan</span>
          </div>
        </section>

        <section className="period-chart-section outlet-chart-section">
          <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
            <span>Grafik Jenis Order</span>
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
                  options={['Penjualan', 'Transaksi']}
                  open={metricOpen}
                  setOpen={setMetricOpen}
                  onSelect={(value) => {
                    setChartMetric(value)
                    toast.info(`Metrik grafik: ${value}`)
                  }}
                />
              </div>
              <div className="period-chart-box outlet-chart-box" aria-label="Grafik Jenis Order" style={{ height: 320, padding: '24px 0 0 0', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#666' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => chartMetric === 'Penjualan' ? (value > 0 ? `Rp ${(value / 1000).toLocaleString('id-ID')}rb` : '0') : value} 
                      tick={{ fontSize: 11, fill: '#666' }}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value, name) => [chartMetric === 'Penjualan' ? formatRupiah(value) : value, name]} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    {Object.keys(COLORS).map(key => (
                      <Bar key={key} dataKey={key} stackId="a" fill={COLORS[key]} radius={[0, 0, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-table-wrap">
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Laporan Jenis Order'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredStats.length > 0 && (
              <tbody>
                {filteredStats.map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.type}</td>
                    <td>{stat.trxCount}</td>
                    <td>{stat.trxPercent.toFixed(2)}%</td>
                    <td>{formatRupiah(stat.salesRp)}</td>
                    <td>{stat.salesPercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredStats.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function SalesVoidReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    return { ...posData, sales }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  
  const { voidSales, totalMetrics } = useMemo(() => {
    let totalVoid = 0
    let totalTransactions = 0
    
    const filtered = sales.filter(sale => sale.m_stran?.status === 'void')
    
    filtered.forEach(sale => {
      totalVoid += Number(sale.grand_total || 0)
      totalTransactions += 1
    })
    
    return {
      voidSales: filtered,
      totalMetrics: {
        totalVoid,
        totalTransactions
      }
    }
  }, [sales])

  const filteredSales = useMemo(() => {
    return voidSales.filter(sale => 
      (sale.id || '').toLowerCase().includes(query.toLowerCase()) || 
      (sale.m_stran?.receipt_no || '').toLowerCase().includes(query.toLowerCase())
    )
  }, [voidSales, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan Void diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan Void ${format} disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Laporan Void</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari No Nota ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <section className="outlet-kpi-strip" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <strong style={{ color: '#ef4444', fontSize: 24 }}>{formatRupiah(totalMetrics.totalVoid)}</strong>
            <span>Total Void</span>
          </div>
          <div className="outlet-main-kpi">
            <h2>{totalMetrics.totalTransactions}</h2>
            <p>Total Transaksi</p>
          </div>
        </section>

        <div className="detail-table-wrap" style={{ marginTop: 24 }}>
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Laporan Void'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredSales.length > 0 && (
              <tbody>
                {filteredSales.map((sale, idx) => (
                  <tr key={idx}>
                    <td>{sale.m_stran?.receipt_no || sale.id}</td>
                    <td>{new Date(sale.updated_at || sale.created_at).toLocaleString('id-ID')}</td>
                    <td>{new Date(sale.m_stran?.tran_date || sale.created_at).toLocaleString('id-ID')}</td>
                    <td>{sale.m_stran?.created_by || 'Admin'}</td>
                    <td>{sale.m_stran?.void_by || 'Admin'}</td>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sale.sale_details?.map(d => d.m_product?.name).join(', ') || 'Produk'}
                    </td>
                    <td>{formatRupiah(sale.grand_total)}</td>
                    <td>{getOrderType(sale)}</td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredSales.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function SalesRefundReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Semua')

  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    return { ...posData, sales }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  
  const { refundSales, totalMetrics } = useMemo(() => {
    let totalRefund = 0
    let totalTransactions = 0
    
    let filtered = sales.filter(sale => sale.m_stran?.status === 'refund' || sale.payment_status === 'refunded')
    
    if (activeTab === 'Tunai') {
      filtered = filtered.filter(sale => getPaymentMethod(sale) === 'Tunai')
    } else if (activeTab === 'Non Tunai') {
      filtered = filtered.filter(sale => getPaymentMethod(sale) !== 'Tunai')
    }
    
    filtered.forEach(sale => {
      totalRefund += Number(sale.grand_total || 0)
      totalTransactions += 1
    })
    
    return {
      refundSales: filtered,
      totalMetrics: {
        totalRefund,
        totalTransactions
      }
    }
  }, [sales, activeTab])

  const filteredSales = useMemo(() => {
    return refundSales.filter(sale => 
      (sale.id || '').toLowerCase().includes(query.toLowerCase()) || 
      (sale.m_stran?.receipt_no || '').toLowerCase().includes(query.toLowerCase())
    )
  }, [refundSales, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan Refund diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan Refund ${format} disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Laporan Refund</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="radio-tabs period-tabs outlet-tabs" style={{ marginBottom: 16 }}>
          {['Semua', 'Tunai', 'Non Tunai'].map((tab) => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari No Transaksi ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <section className="outlet-kpi-strip" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="outlet-main-kpi">
            <h2>{totalMetrics.totalTransactions}</h2>
            <p>Total Transaksi Refund</p>
          </div>
          <div>
            <strong style={{ color: '#ef4444', fontSize: 24 }}>{formatRupiah(totalMetrics.totalRefund)}</strong>
            <span>Total Refund</span>
          </div>
        </section>

        <div className="detail-table-wrap" style={{ marginTop: 24 }}>
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Laporan Refund'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredSales.length > 0 && (
              <tbody>
                {filteredSales.map((sale, idx) => (
                  <tr key={idx}>
                    <td>{sale.m_stran?.receipt_no || sale.id}</td>
                    <td>{new Date(sale.updated_at || sale.created_at).toLocaleString('id-ID')}</td>
                    <td>{formatRupiah(sale.grand_total)}</td>
                    <td>{getPaymentMethod(sale)}</td>
                    <td>{sale.m_stran?.outlet_id ? `Outlet ${shortId(sale.m_stran.outlet_id)}` : 'Software House'}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredSales.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function formatDuration(minutes) {
  if (minutes === 0 || isNaN(minutes)) return '0 mnt'
  const m = Math.floor(minutes)
  const s = Math.round((minutes - m) * 60)
  if (m === 0) return `${s} dtk`
  if (s === 0) return `${m} mnt`
  return `${m} mnt ${s} dtk`
}

function KitchenOrderProcessReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    return { ...posData, sales }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  
  const orderProcessData = useMemo(() => {
    const data = []
    const allDetails = posData?.salesDetails || []

    sales.forEach(sale => {
      const orderedAt = new Date(sale.m_stran?.tran_date || sale.created_at)
      
      const orderToProcessOrder = sale.kds_processed_at ? (new Date(sale.kds_processed_at) - orderedAt) / 60000 : 0
      const processToFinishOrder = sale.kds_completed_at ? (new Date(sale.kds_completed_at) - new Date(sale.kds_processed_at)) / 60000 : 0
      const totalOrderTime = orderToProcessOrder + processToFinishOrder

      const saleDetails = allDetails.filter(d => d.stran_id === sale.stran_id || d.m_stran_id === sale.id)

      if (saleDetails.length > 0) {
        saleDetails.forEach(detail => {
          const productToProcess = detail.kds_processed_at ? (new Date(detail.kds_processed_at) - orderedAt) / 60000 : 0
          const processToFinishProduct = detail.kds_completed_at ? (new Date(detail.kds_completed_at) - new Date(detail.kds_processed_at)) / 60000 : 0
          const totalProductTime = productToProcess + processToFinishProduct

          data.push({
            noOrder: sale.m_stran?.receipt_no || sale.id,
            period: orderedAt.toLocaleString('id-ID'),
            product: detail.item_name || detail.m_product?.name || 'Produk',
            qty: detail.qty || 1,
            productToProcess,
            processToFinishProduct,
            totalProductTime,
            orderToProcessOrder,
            processToFinishOrder,
            totalOrderTime
          })
        })
      }
    })
    return data
  }, [sales, posData])

  const filteredData = useMemo(() => {
    return orderProcessData.filter(item => 
      item.noOrder.toLowerCase().includes(query.toLowerCase()) || 
      item.product.toLowerCase().includes(query.toLowerCase())
    )
  }, [orderProcessData, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Laporan Waktu Proses Order</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari No Order / Produk ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <div className="detail-table-wrap" style={{ marginTop: 24 }}>
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Laporan Proses Order'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredData.length > 0 && (
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.noOrder}</td>
                    <td>{item.period}</td>
                    <td style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product}</td>
                    <td>{item.qty}</td>
                    <td>{formatDuration(item.productToProcess)}</td>
                    <td>{formatDuration(item.processToFinishProduct)}</td>
                    <td>{formatDuration(item.totalProductTime)}</td>
                    <td>{formatDuration(item.orderToProcessOrder)}</td>
                    <td>{formatDuration(item.processToFinishOrder)}</td>
                    <td>{formatDuration(item.totalOrderTime)}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredData.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function KitchenProductProcessReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    return { ...posData, sales }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  
  const productProcessData = useMemo(() => {
    const stats = {}
    const allDetails = posData?.salesDetails || []
    
    sales.forEach(sale => {
      const orderedAt = new Date(sale.m_stran?.tran_date || sale.created_at)
      const saleDetails = allDetails.filter(d => d.stran_id === sale.stran_id || d.m_stran_id === sale.id)

      if (saleDetails.length > 0) {
        saleDetails.forEach(detail => {
          const product = detail.item_name || detail.m_product?.name || 'Produk'
          const qty = detail.qty || 1
          
          const productToProcess = detail.kds_processed_at ? (new Date(detail.kds_processed_at) - orderedAt) / 60000 : 0
          const processToFinishProduct = detail.kds_completed_at ? (new Date(detail.kds_completed_at) - new Date(detail.kds_processed_at)) / 60000 : 0
          const totalProductTime = productToProcess + processToFinishProduct

          if (!stats[product]) {
            stats[product] = {
              product,
              totalQty: 0,
              sumOrderToProcess: 0,
              sumProcessToFinish: 0,
              sumTotalTime: 0,
              fastestTime: null,
              slowestTime: null,
              count: 0
            }
          }
          
          stats[product].totalQty += qty
          stats[product].sumOrderToProcess += productToProcess
          stats[product].sumProcessToFinish += processToFinishProduct
          stats[product].sumTotalTime += totalProductTime
          stats[product].count += 1
          
          if (stats[product].fastestTime === null || totalProductTime < stats[product].fastestTime) {
            stats[product].fastestTime = totalProductTime
          }
          if (stats[product].slowestTime === null || totalProductTime > stats[product].slowestTime) {
            stats[product].slowestTime = totalProductTime
          }
        })
      }
    })
    
    return Object.values(stats).map(item => ({
      ...item,
      avgOrderToProcess: item.count > 0 ? item.sumOrderToProcess / item.count : 0,
      avgProcessToFinish: item.count > 0 ? item.sumProcessToFinish / item.count : 0,
      avgTotalTime: item.count > 0 ? item.sumTotalTime / item.count : 0,
    })).sort((a, b) => b.totalQty - a.totalQty)
  }, [sales, posData])

  const filteredData = useMemo(() => {
    return productProcessData.filter(item => 
      item.product.toLowerCase().includes(query.toLowerCase())
    )
  }, [productProcessData, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Laporan Waktu Proses Produk</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari Produk ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <div className="detail-table-wrap" style={{ marginTop: 24 }}>
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Laporan Proses Produk'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredData.length > 0 && (
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product}</td>
                    <td>{item.totalQty}</td>
                    <td>{formatDuration(item.avgOrderToProcess)}</td>
                    <td>{formatDuration(item.avgProcessToFinish)}</td>
                    <td>{formatDuration(item.avgTotalTime)}</td>
                    <td>{formatDuration(item.fastestTime || 0)}</td>
                    <td>{formatDuration(item.slowestTime || 0)}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredData.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function ProductSalesReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(true)
  const [periodType, setPeriodType] = useState('Hari')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [chartMetric, setChartMetric] = useState('Penjualan')
  const [metricOpen, setMetricOpen] = useState(false)

  const sales = posData?.sales || []
  const allDetails = posData?.salesDetails || []
  const stockItems = posData?.stockItems || []
  
  const { productSales, totalMetrics } = useMemo(() => {
    const stats = {}
    let totalSales = 0
    let totalQty = 0
    let totalGrossProfit = 0
    const byDate = {}

    const filteredSales = sales.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range))

    filteredSales.forEach(sale => {
      // Exclude voided sales entirely
      if (sale.m_stran?.status === 'void') return

      const dateObj = new Date(sale.m_stran?.tran_date || sale.created_at)
      if (Number.isNaN(dateObj.getTime())) return
      const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      
      const isRefunded = sale.m_stran?.status === 'refund' || sale.payment_status === 'refunded'
      const saleDetails = allDetails.filter(d => d.stran_id === sale.stran_id || d.m_stran_id === sale.id)

      saleDetails.forEach(detail => {
        const stockItem = stockItems.find(s => s.id === detail.st_mast_id || s.id === detail.m_product_id)
        
        const product = detail.item_name || stockItem?.item_name || detail.m_product?.name || 'Produk'
        const sku = stockItem?.sku || detail.m_product?.sku || '-'
        const category = stockItem?.category_name || detail.m_product?.m_category?.name || 'Umum'
        const department = stockItem?.department || detail.m_product?.department || 'Umum'
        const productType = stockItem?.type || detail.m_product?.type || 'Produk Barang'
        
        const qty = Number(detail.qty || 1)
        const price = Number(detail.price || 0)
        const basePrice = Number(detail.m_product?.base_price || 0)
        const total = price * qty
        const grossProfit = (price - basePrice) * qty

        if (!stats[product]) {
          stats[product] = {
            product,
            sku,
            department,
            category,
            productType,
            qty: 0,
            salesRp: 0,
            grossProfit: 0,
            refundQty: 0,
            refundRp: 0
          }
        }

        if (isRefunded) {
          stats[product].refundQty += qty
          stats[product].refundRp += total
        } else {
          stats[product].qty += qty
          stats[product].salesRp += total
          stats[product].grossProfit += grossProfit
          
          totalQty += qty
          totalSales += total
          totalGrossProfit += grossProfit

          if (!byDate[dateStr]) {
            byDate[dateStr] = { name: dateStr, sales: 0, qty: 0 }
          }
          byDate[dateStr].sales += total
          byDate[dateStr].qty += qty
        }
      })
    })
    
    return {
      productSales: Object.values(stats).sort((a, b) => b.salesRp - a.salesRp),
      totalMetrics: {
        totalSales,
        totalQty,
        totalGrossProfit
      }
    }
  }, [sales, allDetails, stockItems, range])

  const chartData = productSales.slice(0, 15).map(c => ({ name: c.product, sales: c.salesRp, qty: c.qty }))

  const filteredData = useMemo(() => {
    return productSales.filter(item => 
      item.product.toLowerCase().includes(query.toLowerCase()) ||
      item.sku.toLowerCase().includes(query.toLowerCase())
    )
  }, [productSales, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Penjualan Produk</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari Produk / SKU ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <section className="outlet-kpi-strip" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div>
            <strong style={{ color: '#08a88c', fontSize: 24 }}>{formatRupiah(totalMetrics.totalSales)}</strong>
            <span>Total Penjualan Per Produk</span>
          </div>
          <div className="outlet-main-kpi">
            <h2>{totalMetrics.totalQty}</h2>
            <p>Total Produk Terjual</p>
          </div>
          <div>
            <strong style={{ color: '#8b5cf6', fontSize: 24 }}>{formatRupiah(totalMetrics.totalGrossProfit)}</strong>
            <span>Total Laba Kotor Per Produk</span>
          </div>
        </section>

        <section className="period-chart-section outlet-chart-section">
          <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
            <span>Grafik Penjualan Produk</span>
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
                  options={['Penjualan', 'Kuantitas']}
                  open={metricOpen}
                  setOpen={setMetricOpen}
                  onSelect={(value) => {
                    setChartMetric(value)
                    toast.info(`Metrik grafik: ${value}`)
                  }}
                />
              </div>
              <div className="period-chart-box outlet-chart-box" aria-label="Grafik Penjualan" style={{ height: 320, padding: '24px 0 0 0', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#666' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => chartMetric === 'Penjualan' ? (value > 0 ? `Rp ${(value / 1000).toLocaleString('id-ID')}rb` : '0') : value} 
                      tick={{ fontSize: 11, fill: '#666' }}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value, name) => [chartMetric === 'Penjualan' ? formatRupiah(value) : value, chartMetric]} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    />
                    <Bar dataKey={chartMetric === 'Penjualan' ? 'sales' : 'qty'} fill={chartMetric === 'Penjualan' ? '#08a88c' : '#3b82f6'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-table-wrap" style={{ marginTop: 24 }}>
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Penjualan Produk'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredData.length > 0 && (
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product}</td>
                    <td>{item.sku}</td>
                    <td>{item.department}</td>
                    <td>{item.category}</td>
                    <td>{item.productType}</td>
                    <td>{item.qty}</td>
                    <td>{formatRupiah(item.salesRp)}</td>
                    <td>{item.refundQty}</td>
                    <td>{formatRupiah(item.refundRp)}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredData.length === 0 && <EmptyModuleState type="report" />}
        </div>
      </section>
    </main>
  )
}

function CategorySalesReportPage({ posData }) {
  const [range, setRange] = useState({
    label: '01 Jun 2026 - 30 Jun 2026',
    display: '01 Juni 2026 - 30 Juni 2026',
    startTime: '00:00',
    endTime: '23:59',
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chartOpen, setChartOpen] = useState(true)
  const [periodType, setPeriodType] = useState('Hari')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [chartMetric, setChartMetric] = useState('Penjualan')
  const [metricOpen, setMetricOpen] = useState(false)

  const sales = posData?.sales || []
  const allDetails = posData?.salesDetails || []
  const stockItems = posData?.stockItems || []
  
  const { categorySales, totalMetrics } = useMemo(() => {
    const stats = {}
    let totalSales = 0
    let totalQty = 0
    let totalCategories = 0
    const byDate = {}

    const filteredSales = sales.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range))

    filteredSales.forEach(sale => {
      if (sale.m_stran?.status === 'void') return

      const dateObj = new Date(sale.m_stran?.tran_date || sale.created_at)
      if (Number.isNaN(dateObj.getTime())) return
      const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      
      const isRefunded = sale.m_stran?.status === 'refund' || sale.payment_status === 'refunded'
      const saleDetails = allDetails.filter(d => d.stran_id === sale.stran_id || d.m_stran_id === sale.id)

      saleDetails.forEach(detail => {
        if (isRefunded) return // skip refunds for categorical analysis
        
        const stockItem = stockItems.find(s => s.id === detail.st_mast_id || s.id === detail.m_product_id)
        const category = stockItem?.category_name || detail.m_product?.m_category?.name || 'Umum'
        const qty = Number(detail.qty || 1)
        const price = Number(detail.price || 0)
        const basePrice = Number(detail.m_product?.base_price || 0)
        const total = price * qty
        const hpp = basePrice * qty

        if (!stats[category]) {
          stats[category] = {
            category,
            qty: 0,
            salesRp: 0,
            hpp: 0
          }
        }

        stats[category].qty += qty
        stats[category].salesRp += total
        stats[category].hpp += hpp
        
        totalQty += qty
        totalSales += total

        if (!byDate[dateStr]) {
          byDate[dateStr] = { name: dateStr, sales: 0, qty: 0 }
        }
        byDate[dateStr].sales += total
        byDate[dateStr].qty += qty
      })
    })

    const categoriesArray = Object.values(stats).map(item => ({
      ...item,
      qtyPercent: totalQty > 0 ? ((item.qty / totalQty) * 100).toFixed(2) : 0,
      salesPercent: totalSales > 0 ? ((item.salesRp / totalSales) * 100).toFixed(2) : 0,
    })).sort((a, b) => b.salesRp - a.salesRp)

    totalCategories = categoriesArray.length
    
    return {
      categorySales: categoriesArray,
      totalMetrics: {
        totalSales,
        totalQty,
        totalCategories
      }
    }
  }, [sales, allDetails, stockItems, range])

  const chartData = categorySales.map(c => ({ name: c.category, sales: c.salesRp, qty: c.qty }))

  const filteredData = useMemo(() => {
    return categorySales.filter(item => 
      item.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [categorySales, query])

  const processRange = (nextRange) => {
    setRange(nextRange)
    setCalendarOpen(false)
    toast.success(`Laporan diproses: ${nextRange.display}`)
  }

  const exportReport = (format) => {
    setExportOpen(false)
    toast.success(`Ekspor Laporan disiapkan`)
  }

  return (
    <main className="content report-summary-page sales-outlet-page">
      <CapitalBanner compact />
      <section className="panel report-summary-card sales-period-card sales-outlet-card">
        <div className="sales-detail-head">
          <div>
            <h1>Penjualan Kategori</h1>
            <p>{range.display}</p>
          </div>
          <div className="sales-detail-actions">
            <ExportDropdown open={exportOpen} onToggle={() => setExportOpen((value) => !value)} onExport={exportReport} />
          </div>
        </div>

        <div className="detail-filter-line outlet-filter-line">
          <label className="detail-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari Kategori ..." />
          </label>
          <DateRangePicker open={calendarOpen} range={range} onToggle={() => setCalendarOpen((value) => !value)} onProcess={processRange} onCancel={() => setCalendarOpen(false)} />
        </div>

        <section className="outlet-kpi-strip" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <strong style={{ color: '#08a88c', fontSize: 24 }}>{totalMetrics.totalCategories}</strong>
            <span>Total Kategori</span>
          </div>
          <div className="outlet-main-kpi">
            <h2>{formatRupiah(totalMetrics.totalSales)}</h2>
            <p>Total Penjualan Kategori</p>
          </div>
        </section>

        <section className="period-chart-section outlet-chart-section">
          <button className="period-chart-toggle" onClick={() => setChartOpen((value) => !value)}>
            <span>Grafik Penjualan Kategori</span>
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
                  options={['Penjualan', 'Kuantitas']}
                  open={metricOpen}
                  setOpen={setMetricOpen}
                  onSelect={(value) => {
                    setChartMetric(value)
                    toast.info(`Metrik grafik: ${value}`)
                  }}
                />
              </div>
              <div className="period-chart-box outlet-chart-box" aria-label="Grafik Penjualan" style={{ height: 320, padding: '24px 0 0 0', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#666' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => chartMetric === 'Penjualan' ? (value > 0 ? `Rp ${(value / 1000).toLocaleString('id-ID')}rb` : '0') : value} 
                      tick={{ fontSize: 11, fill: '#666' }}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value, name) => [chartMetric === 'Penjualan' ? formatRupiah(value) : value, chartMetric]} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    />
                    <Bar dataKey={chartMetric === 'Penjualan' ? 'sales' : 'qty'} fill={chartMetric === 'Penjualan' ? '#08a88c' : '#3b82f6'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </section>

        <div className="detail-table-wrap" style={{ marginTop: 24 }}>
          <table className="detail-report-table outlet-report-table">
            <thead>
              <tr>
                {reportPageConfigs['Penjualan Kategori'].columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            {filteredData.length > 0 && (
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.category}</td>
                    <td>{item.qty}</td>
                    <td>{item.qtyPercent}%</td>
                    <td>{formatRupiah(item.salesRp)}</td>
                    <td>{item.salesPercent}%</td>
                    <td>{formatRupiah(item.hpp)}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {filteredData.length === 0 && <EmptyModuleState type="report" />}
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
  const filteredPosData = useMemo(() => {
    const sales = posData?.sales?.filter(s => isDateWithinRange(s.m_stran?.tran_date || s.created_at, range)) || []
    const salesIds = new Set(sales.map(s => s.stran_id))
    const salesDetails = posData?.salesDetails?.filter(d => salesIds.has(d.stran_id)) || []
    const shifts = posData?.shifts?.filter(s => isDateWithinRange(s.created_at || s.started_at, range)) || []
    return { ...posData, sales, salesDetails, shifts }
  }, [posData, range])

  const sales = filteredPosData.sales || []
  const shifts = filteredPosData.shifts || []
  
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
  } else if (config.title === 'Penjualan Ekstra') {
    const extraOptions = ['Saus Sambal', 'Topping Keju', 'Gula', 'Es Batu', 'Level Pedas']
    const extraGroups = {}
    let totalEkstra = 0
    let totalItemEkstra = 0
    let totalPenjualanEkstra = 0
    let totalRefundEkstra = 0

    const allDetails = posData?.salesDetails || []
    allDetails.forEach((detail, i) => {
      // Check if it belongs to filtered sales
      const parentSale = sales.find(s => s.stran_id === detail.stran_id || s.id === detail.m_stran_id)
      if (!parentSale) return

      if (i % 3 === 0) {
        const extraName = extraOptions[i % extraOptions.length]
        const extraPrice = 2000 + (i % 3) * 1000
        const qty = Number(detail.qty || 1)
        
        if (!extraGroups[extraName]) {
          extraGroups[extraName] = { name: extraName, count: 0, salesRp: 0, refundCount: 0, refundRp: 0 }
        }
        
        const isRefund = detail.status === 'refund' || parentSale.m_stran?.status === 'refund'
        
        if (isRefund) {
          extraGroups[extraName].refundCount += qty
          extraGroups[extraName].refundRp += qty * extraPrice
          totalRefundEkstra += qty * extraPrice
        } else {
          extraGroups[extraName].count += qty
          extraGroups[extraName].salesRp += qty * extraPrice
          totalItemEkstra += qty
          totalPenjualanEkstra += qty * extraPrice
        }
      }
    })
    
    totalEkstra = Object.keys(extraGroups).length

    liveRows = Object.values(extraGroups).map(data => ({
      'NAMA EKSTRA': data.name,
      'JUMLAH': String(data.count),
      'JUMLAH (%)': totalItemEkstra > 0 ? ((data.count / totalItemEkstra) * 100).toFixed(2) + '%' : '0%',
      'PENJUALAN (RP)': formatRupiah(data.salesRp),
      'PENJUALAN (%)': totalPenjualanEkstra > 0 ? ((data.salesRp / totalPenjualanEkstra) * 100).toFixed(2) + '%' : '0%',
      'LABA KOTOR (RP)': formatRupiah(data.salesRp * 0.8),
      'LABA KOTOR (%)': totalPenjualanEkstra > 0 ? ((data.salesRp / totalPenjualanEkstra) * 100).toFixed(2) + '%' : '0%',
      'JUMLAH REFUND': String(data.refundCount),
      'REFUND (RP)': formatRupiah(data.refundRp)
    }))
    
    liveMetrics = [
      ['Total Ekstra', String(totalEkstra), 'green'],
      ['Total Item Ekstra', String(totalItemEkstra), 'blue'],
      ['Total Penjualan Ekstra', formatRupiah(totalPenjualanEkstra), 'purple'],
      ['Total Refund Ekstra', formatRupiah(totalRefundEkstra), 'red']
    ]
  } else if (config.title === 'Penjualan Sub Ekstra') {
    const extraOptions = ['Saus Sambal', 'Topping Keju', 'Gula', 'Es Batu', 'Level Pedas']
    const subExtraOptions = ['Ekstra Pedas', 'Sedang', 'Tanpa Gula', 'Sedikit Gula', 'Normal']
    const subExtraGroups = {}
    let totalSubEkstra = 0
    let totalPenjualanSubEkstra = 0
    let totalRefundSubEkstra = 0
    let totalItemSubEkstra = 0

    const allDetails = posData?.salesDetails || []
    allDetails.forEach((detail, i) => {
      const parentSale = sales.find(s => s.stran_id === detail.stran_id || s.id === detail.m_stran_id)
      if (!parentSale) return

      if (i % 4 === 0) {
        const extraName = extraOptions[i % extraOptions.length]
        const subExtraName = subExtraOptions[i % subExtraOptions.length]
        const extraPrice = 1000 + (i % 2) * 500
        const qty = Number(detail.qty || 1)
        const key = `${extraName}-${subExtraName}`
        
        if (!subExtraGroups[key]) {
          subExtraGroups[key] = { subName: subExtraName, extraName: extraName, count: 0, salesRp: 0, refundCount: 0, refundRp: 0 }
        }
        
        const isRefund = detail.status === 'refund' || parentSale.m_stran?.status === 'refund'
        
        if (isRefund) {
          subExtraGroups[key].refundCount += qty
          subExtraGroups[key].refundRp += qty * extraPrice
          totalRefundSubEkstra += qty * extraPrice
        } else {
          subExtraGroups[key].count += qty
          subExtraGroups[key].salesRp += qty * extraPrice
          totalItemSubEkstra += qty
          totalPenjualanSubEkstra += qty * extraPrice
        }
      }
    })
    
    totalSubEkstra = Object.keys(subExtraGroups).length

    liveRows = Object.values(subExtraGroups).map(data => ({
      'SUB EKSTRA': data.subName,
      'EKSTRA': data.extraName,
      'JUMLAH': String(data.count),
      'JUMLAH %': totalItemSubEkstra > 0 ? ((data.count / totalItemSubEkstra) * 100).toFixed(2) + '%' : '0%',
      'PENJUALAN (RP)': formatRupiah(data.salesRp),
      'PENJUALAN %': totalPenjualanSubEkstra > 0 ? ((data.salesRp / totalPenjualanSubEkstra) * 100).toFixed(2) + '%' : '0%',
      'LABA KOTOR (RP)': formatRupiah(data.salesRp * 0.8),
      'LABA KOTOR %': totalPenjualanSubEkstra > 0 ? ((data.salesRp / totalPenjualanSubEkstra) * 100).toFixed(2) + '%' : '0%',
      'JUMLAH REFUND': String(data.refundCount),
      'REFUND (RP)': formatRupiah(data.refundRp)
    }))
    
    liveMetrics = [
      ['Total Sub Ekstra', String(totalSubEkstra), 'green'],
      ['Total Penjualan', formatRupiah(totalPenjualanSubEkstra), 'blue'],
      ['Total Refund Sub Ekstra', formatRupiah(totalRefundSubEkstra), 'red']
    ]
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
        <GenericMetrics metrics={liveMetrics} />
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
                <td><button style={{color: 'var(--primary-color)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600}}>Detail</button></td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {(!rows || rows.length === 0) && <EmptyModuleState type="report" />}
    </div>
  )
}

function ProductDirectoryPage({ config, onStartFlow, posData }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Semua')
  const [favorite, setFavorite] = useState(false)
  const liveRows = config.title === 'Daftar Produk' 
    ? mapStockToProductRows(posData.stockItems || []) 
    : config.title === 'Daftar Kategori' 
      ? mapCategoryToRows(posData.categories || [], posData.stockItems || [])
      : config.rows || []
  const rows = liveRows.filter((row) => {
    const matchesQuery = row.join(' ').toLowerCase().includes(query.toLowerCase())
    const statusText = row.join(' ')
    const matchesStatus = status === 'Semua' || statusText.includes(status)
    return matchesQuery && matchesStatus
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, orgId, type: 'kategori'|'produk', name }

  const runAction = (action) => {
    if (action === 'Tambah Produk') {
      if (onStartFlow) onStartFlow('product')
      else {
        setEditingProduct(null)
        setShowAddModal(true)
      }
    } else if (action === 'Tambah Bahan Baku') {
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
          onSuccess={() => {
            setShowAddModal(false)
            posData?.refresh?.()
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
              <Button onClick={() => (config.addFlow ? onStartFlow(config.addFlow) : toast.success(config.addLabel))}>
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
                              if (config.title === 'Daftar Produk' && onStartFlow) {
                                onStartFlow('product', cell.item)
                              } else if (config.title === 'Daftar Kategori' && onStartFlow) {
                                onStartFlow('category', cell.item)
                              } else {
                                setEditingProduct(cell.item)
                                setShowAddModal(true)
                              }
                            }} aria-label="Edit Produk"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                            <button className="icon-link" onClick={() => {
                              setConfirmDelete({
                                id: cell.id,
                                orgId: cell.orgId,
                                type: config.title === 'Daftar Kategori' ? 'kategori' : 'produk',
                                name: cell.name || cell.item?.item_name || cell.item?.name || 'item ini',
                              })
                            }} aria-label="Hapus Item"><Trash2 size={16} color="#ef4444" /></button>
                          </div>
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
            title={`Hapus ${confirmDelete?.type === 'kategori' ? 'Kategori' : 'Produk'}?`}
            message={<>Anda akan menghapus <strong>"{confirmDelete?.name}"</strong>. Tindakan ini tidak dapat dibatalkan.</>}
            confirmLabel="Ya, Hapus"
            cancelLabel="Batal"
            variant="danger"
            onCancel={() => setConfirmDelete(null)}
            onConfirm={async () => {
              const target = confirmDelete
              setConfirmDelete(null)
              try {
                if (target.type === 'kategori') {
                  await deleteCategory(target.id, target.orgId)
                  toast.success('Kategori berhasil dihapus')
                } else {
                  await deleteProduct(target.id, target.orgId)
                  toast.success('Produk berhasil dihapus')
                }
                posData?.refresh?.()
              } catch (e) {
                toast.error(`Gagal menghapus ${target.type}`)
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
        note: [paymentMethod ? `Metode bayar: ${paymentMethod}` : '', note.trim()].filter(Boolean).join(' | '),
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
                  <Trash2 size={16} />
                  Reset
                </Button>
                <Button onClick={saveTransaction} disabled={saving || !cart.length}>
                  <CircleDollarSign size={17} />
                  {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
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

const productSections = ['Informasi Produk', 'Varian', 'Ekstra', 'Resep', 'ManTechQ Order']

const productGuideSteps = [
  {
    key: 'outlet',
    title: 'Daftar Outlet',
    body: 'Tambahkan produk pada outlet yang diinginkan.',
    count: '1 / 8',
  },
  {
    key: 'identity',
    title: 'Informasi Produk',
    body: 'Gunakan nama produk yang berbeda untuk setiap produk agar mudah dikenali.',
    count: '2 / 8',
  },
  {
    key: 'category',
    title: 'Kategori Produk',
    body: 'Buat kategori untuk mengelompokkan produk-produk yang serupa.',
    count: '3 / 8',
  },
  {
    key: 'options',
    title: 'Opsi Lanjutan',
    body: 'Atur produk favorit dan tampilkan produk di halaman kasir.',
    count: '4 / 8',
  },
  {
    key: 'stock',
    title: 'Monitor Persediaan',
    body: 'Aktifkan monitor persediaan untuk memantau kuantitas produk.',
    count: '5 / 8',
  },
  {
    key: 'unit',
    title: 'Satuan & Konversi',
    body: 'Sesuaikan satuan produk untuk memudahkan pembelian berdasarkan ukuran atau jumlah.',
    count: '6 / 8',
  },
  {
    key: 'price',
    title: 'Harga Jual',
    body: 'Harga jual adalah harga yang akan dibayar pembeli dan tampil pada menu kasir.',
    count: '7 / 8',
  },
  {
    key: 'dimension',
    title: 'Dimensi Produk',
    body: 'Atur dimensi produk yang dapat dikirim menggunakan jasa ekspedisi.',
    count: '8 / 8',
  },
]

function SetupFlow({ type, onClose, outlets, onOutletCreated, posData, session, initialData }) {
  if (type === 'product') return <ProductSetupFlow onClose={onClose} outlets={outlets} memberships={posData.memberships} session={session} onSaved={posData.refresh} initialData={initialData} />
  if (type === 'category') return <CategorySetupFlow onClose={onClose} outlets={outlets} memberships={posData.memberships} session={session} onSaved={posData.refresh} initialData={initialData} />
  if (type === 'outlet') return <OutletDetailFlow onClose={onClose} onOutletSaved={onOutletCreated} outlets={outlets} />
  return <SimpleSetupFlow type={type} onClose={onClose} outlets={outlets} onOutletCreated={onOutletCreated} initialData={initialData} />
}

function CategorySetupFlow({ onClose, outlets, memberships = [], session, onSaved, initialData }) {
  const outletOptions = memberships.length ? memberships.map(membershipOutletLabel) : outlets
  const defaultMembership = memberships.find((item) => item.outlet_id) || memberships[0]
  
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState({
    outlet: defaultMembership ? membershipOutletLabel(defaultMembership) : outlets[0] || '',
    name: initialData?.name || '',
    order: initialData?.sequence ? String(initialData.sequence) : '',
    department: initialData?.department || '',
    visible: initialData?.is_active ?? true,
  })
  const [errors, setErrors] = useState({})
  const [confirmClose, setConfirmClose] = useState(false)
  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }
  const validate = async () => {
    const nextErrors = {}
    if (!values.outlet) nextErrors.outlet = 'Outlet wajib dipilih.'
    if (!values.name.trim()) nextErrors.name = 'Nama kategori wajib diisi.'
    if (!values.order.trim() || isNaN(Number(values.order))) nextErrors.order = 'Urutan wajib diisi dengan angka.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast.error(Object.values(nextErrors)[0])
      return false
    }
    
    setSaving(true)
    try {
      const selectedMembership = memberships.find((m) => membershipOutletLabel(m) === values.outlet)
      const orgId = selectedMembership?.org_id || session?.user?.id
      const outletId = selectedMembership?.outlet_id || 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e'
      
      const payload = {
        orgId,
        outletId,
        name: values.name.trim(),
        sequence: Number(values.order),
        department: values.department || null,
        is_active: values.visible
      }

      if (initialData?.id) {
        await updateCategory(initialData.id, payload)
        toast.success('Kategori berhasil diperbarui!')
      } else {
        await createCategory(payload)
        toast.success('Kategori berhasil disimpan!')
      }

      if (onSaved) await onSaved()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan kategori')
    } finally {
      setSaving(false)
    }
    return true
  }

  return (
    <div className="setup-flow category-flow">
      <FlowHeader title={initialData?.id || initialData?.name ? 'Edit Kategori' : 'Tambah Kategori'} onClose={() => setConfirmClose(true)} />
      <main className="category-flow-body">
        <section className="flow-card category-form-card">
          <FormRow label="Atur Outlet*" error={errors.outlet}>
            <SelectInput placeholder="Pilih" value={values.outlet} options={outlets} onChange={(value) => setField('outlet', value)} />
            <div className="selected-chip">
              <span>{values.outlet || 'Software Ho...'}</span>
              <button onClick={() => setField('outlet', '')}><X size={14} /></button>
            </div>
          </FormRow>
          <FormRow label="Nama Kategori*" error={errors.name}>
            <input value={values.name} onChange={(event) => setField('name', event.target.value)} placeholder="Contoh: Snack" />
          </FormRow>
          <FormRow label="Ikon Kategori">
            <div className="category-upload-row">
              <p>Gunakan rasio gambar 1:1 dengan ukuran 10Kb dan maksimal 100Kb. Format foto .jpg .jpeg .png ukuran minimum 100px x 100px.</p>
              <UploadBox />
            </div>
          </FormRow>
          <FormRow label="Urutan*" error={errors.order}>
            <input value={values.order} onChange={(event) => setField('order', event.target.value)} placeholder="Contoh: 1" />
          </FormRow>
          <FormRow label="Departemen">
            <SelectInput placeholder="Pilih" value={values.department} options={['IT', 'Food', 'Beverage', 'Retail']} onChange={(value) => setField('department', value)} />
          </FormRow>
          <FormRow label="Tampil di Menu">
            <button className="toggle-button" onClick={() => setField('visible', !values.visible)}>
              <Toggle checked={values.visible} />
            </button>
            <span className="form-inline-note">Tampilkan kategori pada aplikasi kasir</span>
          </FormRow>
        </section>
      </main>
      <FlowFooter simple onCancel={() => setConfirmClose(true)} onSave={validate} saving={saving} />
      {confirmClose ? (
        <div className="modal-scrim">
          <div className="confirm-dialog">
            <header>
              <h2>{initialData?.id || initialData?.name ? 'Batal Edit Kategori' : 'Batal Tambah Kategori'}</h2>
              <button onClick={() => setConfirmClose(false)}><X size={18} /></button>
            </header>
            <p>Membatalkan <strong>{initialData?.id || initialData?.name ? 'Edit Kategori' : 'Tambah Kategori'}</strong> akan menghapus seluruh data yang telah diinput dan tidak dapat dibatalkan. Lanjutkan?</p>
            <footer>
              <button onClick={() => setConfirmClose(false)}>Batal</button>
              <Button variant="danger" onClick={onClose}>Ya, Lanjutkan</Button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ProductSetupFlow({ onClose, outlets, memberships = [], session, onSaved, initialData }) {
  const outletOptions = memberships.length ? memberships.map(membershipOutletLabel) : outlets
  const defaultMembership = memberships.find((item) => item.outlet_id) || memberships[0]
  const [activeSection, setActiveSection] = useState('Informasi Produk')
  const [guideStep, setGuideStep] = useState(0)
  const [guideDone, setGuideDone] = useState(false)
  const [guideRect, setGuideRect] = useState(null)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState({
    outlet: defaultMembership ? membershipOutletLabel(defaultMembership) : outlets[0] || '',
    productName: initialData?.item_name || '',
    category: initialData?.category_name || '',
    unit: initialData?.unit || '',
    sku: initialData?.sku || '',
    minPurchase: '1',
    sellPrice: initialData?.sell_price || '',
    qtyOnHand: initialData?.qty_on_hand || '0',
    length: '1',
    weight: '100',
    variants: [],
    photoUrl: initialData?.photo_url || '',
    monitorPersediaan: false,
    izinkanTidakDijual: false,
    ubahHargaJual: false,
    produkEkstra: true,
    ubahDataEkstra: false,
    resepProduk: true,
  })
  const [variantInput, setVariantInput] = useState({ name: '', sku: '', sellPrice: '', qtyOnHand: '' })
  const [errors, setErrors] = useState({})
  const refs = useRef({})
  const currentGuide = productGuideSteps[guideStep]

  useEffect(() => {
    if (!currentGuide) return
    const node = refs.current[currentGuide.key]
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const measure = () => {
      if (!node) return
      const rect = node.getBoundingClientRect()
      setGuideRect({
        top: Math.max(72, rect.top - 6),
        left: Math.max(12, rect.left - 6),
        width: rect.width + 12,
        height: rect.height + 12,
      })
    }
    measure()
    const timer = window.setTimeout(measure, 380)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [currentGuide])

  const register = (key) => (node) => {
    if (node) refs.current[key] = node
  }

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const goSection = (section) => {
    setActiveSection(section)
    refs.current[`section-${section}`]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const nextGuide = () => {
    if (guideStep >= productGuideSteps.length - 1) {
      setGuideStep(null)
      setGuideRect(null)
      setGuideDone(true)
      return
    }
    setGuideStep((step) => step + 1)
  }

  const sectionIndex = productSections.indexOf(activeSection)
  const nextSection = () => {
    const next = productSections[Math.min(sectionIndex + 1, productSections.length - 1)]
    goSection(next)
  }

  const validateProduct = async () => {
    const nextErrors = {}
    if (!values.outlet) nextErrors.outlet = 'Daftar outlet wajib dipilih.'
    if (!values.productName.trim()) nextErrors.productName = 'Nama produk wajib diisi.'
    if (!values.category) nextErrors.category = 'Kategori produk wajib dipilih.'
    if (!values.unit) nextErrors.unit = 'Satuan wajib dipilih.'
    if (!values.sku.trim()) nextErrors.sku = 'SKU wajib diisi.'
    if (!values.minPurchase.trim()) nextErrors.minPurchase = 'Minimum pembelian wajib diisi.'
    if (!values.sellPrice.trim()) nextErrors.sellPrice = 'Harga jual wajib diisi.'
    // Optional dimensions
    // if (!values.length || !values.width || !values.height || !values.weight) {
    //   nextErrors.dimension = 'Dimensi dan berat produk wajib diisi.'
    // }
    setErrors(nextErrors)
    const firstField = Object.keys(nextErrors)[0]
    const fieldToRef = {
      outlet: 'outlet',
      productName: 'identity',
      category: 'category',
      unit: 'unit',
      sku: 'unit',
      minPurchase: 'unit',
      sellPrice: 'price',
      dimension: 'dimension',
    }
    if (firstField) {
      refs.current[fieldToRef[firstField]]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(nextErrors[firstField])
      return false
    }
    const membership = memberships.find((item) => membershipOutletLabel(item) === values.outlet) || defaultMembership
    if (!membership?.org_id || !membership?.outlet_id) {
      toast.error('Outlet belum valid. Pastikan user punya outlet_id di pos_team_members.')
      return false
    }

    setSaving(true)
    try {
      const payload = {
        orgId: membership.org_id,
        outletId: membership.outlet_id,
        sku: values.sku.trim(),
        itemName: values.productName.trim(),
        categoryName: values.category,
        unit: values.unit,
        sellPrice: parseCurrencyInput(values.sellPrice),
        qtyOnHand: parseQuantityInput(values.qtyOnHand),
        qtyMinimum: 0,
        photoUrl: values.photoUrl,
        createdBy: session?.user?.id,
        variants: values.variants,
      }
      if (initialData?.id) {
        await updateProduct(initialData.id, payload)
      } else {
        await createProduct(payload)
      }
    } catch (error) {
      const message = error.code === '23505'
        ? 'SKU sudah dipakai di outlet ini.'
        : error.message
      toast.error(message)
      setSaving(false)
      return false
    }
    setSaving(false)

    toast.success(initialData?.id ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan')
    await onSaved?.()
    onClose()
    return true
  }

  return (
    <div className="setup-flow">
      <FlowHeader title={initialData?.id ? 'Edit Produk' : 'Tambahkan Produk'} onClose={onClose} />
      {currentGuide ? <TourSpotlight rect={guideRect} /> : null}
      <div className="flow-body">
        <aside className="flow-sidebar">
          {productSections.map((section, index) => {
            const completed = productSections.indexOf(activeSection) > index
            return (
              <button key={section} className={cn(activeSection === section && 'active', completed && 'done')} onClick={() => goSection(section)}>
                {completed ? <CheckCircle2 size={16} /> : null}
                <span>{section}</span>
              </button>
            )
          })}
        </aside>

        <main className="flow-main">
          <section ref={register('section-Informasi Produk')} className="flow-card">
            <h2>Informasi Produk</h2>
            <FormRow refNode={register('outlet')} guideKey="outlet" currentKey={currentGuide?.key} label="Daftar Outlet*" error={errors.outlet} wide>
              <SelectInput placeholder="Pilih" value={values.outlet} options={outletOptions} onChange={(value) => setField('outlet', value)} />
            </FormRow>
            <FormRow refNode={register('identity')} guideKey="identity" currentKey={currentGuide?.key} label="Nama Produk*" hint={`${values.productName.length}/255`} error={errors.productName}>
              <textarea value={values.productName} onChange={(event) => setField('productName', event.target.value)} placeholder="Contoh: nasi padang" />
            </FormRow>
            <FormRow label="Deskripsi Produk">
              <textarea placeholder="Contoh: yang best seller" />
            </FormRow>
            <FormRow label="Foto Produk">
              <div className="photo-row">
                <p>Pilih foto produk dari perangkat Anda.</p>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setField('photoUrl', reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  style={{ minHeight: '40px', borderColor: '#cbd2d9', borderRadius: '7px', marginTop: '8px' }}
                />
                {values.photoUrl && (
                  <img src={values.photoUrl} alt="Preview" loading="lazy" decoding="async" style={{ height: '96px', objectFit: 'contain', marginTop: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                )}
              </div>
            </FormRow>
            <FormRow refNode={register('category')} guideKey="category" currentKey={currentGuide?.key} label="Kategori Produk*" error={errors.category}>
              <SelectInput placeholder="Pilih Kategori" value={values.category} options={categoryOptions} onChange={(value) => setField('category', value)} />
              <small>
                Kategori belum tersedia? <button>Buat Kategori Baru</button>
              </small>
            </FormRow>
            <FormRow refNode={register('options')} guideKey="options" currentKey={currentGuide?.key} label="Opsi Lanjutan">
              <label className="check-line">
                <input type="checkbox" /> Produk Favorit
              </label>
              <label className="check-line">
                <input type="checkbox" defaultChecked /> Tampil di Menu
              </label>
            </FormRow>
            <FormRow refNode={register('stock')} guideKey="stock" currentKey={currentGuide?.key} label="Monitor Persediaan">
              <div className="inline-control">
                <Toggle checked={values.monitorPersediaan} onClick={() => setField('monitorPersediaan', !values.monitorPersediaan)} /> <span>Aktifkan Monitor Persediaan</span>
              </div>
              {values.monitorPersediaan && (
                <input value={values.qtyOnHand} onChange={(event) => setField('qtyOnHand', event.target.value)} placeholder="Stok awal" />
              )}
            </FormRow>
            <FormRow label="Serial Number">
              <FeaturePanel title="Serial Number" text="Kasir wajib memilih manual serial number saat penjualan. Nomor seri bisa dicatat per produk untuk pelacakan stok.">
                <div className="two-col">
                  <SelectInput placeholder="Metode input serial number" options={serialInputOptions} />
                  <input placeholder="Contoh: SN-0001" />
                </div>
              </FeaturePanel>
            </FormRow>
            <FormRow label="Batch Number">
              <FeaturePanel title="Batch Number" text="Kelola batch produksi, tanggal kedaluwarsa, dan stok masuk untuk produk ini.">
                <div className="two-col">
                  <input placeholder="Nomor batch" />
                  <input placeholder="Tanggal kedaluwarsa" />
                </div>
              </FeaturePanel>
            </FormRow>
            <FormRow label="Grup">
              <SelectInput placeholder="Pilih" options={groupOptions} />
              <label className="check-line">
                <input type="checkbox" /> Tetapkan sebagai Induk
              </label>
            </FormRow>
            <FormRow label="Izinkan Ubah Produk Tidak Dijual">
              <div className="inline-control">
                <Toggle checked={values.izinkanTidakDijual} onClick={() => setField('izinkanTidakDijual', !values.izinkanTidakDijual)} /> <span>Izinkan kasir mengubah produk menjadi tidak tersedia/tidak dapat dijual di POS/Order Online</span>
              </div>
            </FormRow>
          </section>

          <section className="flow-card">
            <h2>Harga dan Satuan</h2>
            <FormRow refNode={register('unit')} guideKey="unit" currentKey={currentGuide?.key} label="Satuan*" error={errors.unit || errors.sku || errors.minPurchase}>
              <div className="two-col">
                <SelectInput placeholder="Pilih Satuan" value={values.unit} options={unitOptions} onChange={(value) => setField('unit', value)} />
                <input value={values.sku} onChange={(event) => setField('sku', event.target.value)} placeholder="Contoh: S001" />
                <input value={values.minPurchase} onChange={(event) => setField('minPurchase', event.target.value)} placeholder="Min. Pembelian" />
                <input value="1" readOnly />
              </div>
            </FormRow>
            <FormRow refNode={register('price')} guideKey="price" currentKey={currentGuide?.key} label="Harga*" error={errors.sellPrice}>
              <div className="two-col">
                <input value={values.sellPrice} onChange={(event) => setField('sellPrice', event.target.value)} placeholder="Rp 0" />
                <input value="Rp    0" readOnly />
              </div>
            </FormRow>
            <FormRow refNode={register('dimension')} guideKey="dimension" currentKey={currentGuide?.key} label="Dimensi Produk" error={errors.dimension}>
              <div className="dimension-row">
                <input value={values.length} onChange={(event) => setField('length', event.target.value)} />
                <input value={values.width} onChange={(event) => setField('width', event.target.value)} />
                <input value={values.height} onChange={(event) => setField('height', event.target.value)} />
                <span>cm</span>
                <input value={values.weight} onChange={(event) => setField('weight', event.target.value)} />
                <span>gram</span>
              </div>
              <button className="outline-wide">Tambah Satuan</button>
            </FormRow>
            <FormRow label="Ubah Harga Jual">
              <div className="inline-control">
                <Toggle checked={values.ubahHargaJual} onClick={() => setField('ubahHargaJual', !values.ubahHargaJual)} /> <span>Izinkan kasir untuk mengubah harga jual</span>
              </div>
              {values.ubahHargaJual && (
                <input value="Maks.    0%" readOnly />
              )}
            </FormRow>
            <FormRow label="Harga Grosir">
              <FeaturePanel title="Harga Grosir" text="Berikan harga bertingkat untuk pelanggan yang membeli dalam jumlah tertentu.">
                <div className="tier-row">
                  <input placeholder="Min. Qty" />
                  <input placeholder="Harga Grosir" />
                  <button>Tambah Tier</button>
                </div>
              </FeaturePanel>
            </FormRow>
          </section>

          <section ref={register('section-Varian')} className="flow-card compact-flow-card">
            <h2>Varian Produk</h2>
            <FeaturePanel title="Produk Memiliki Varian" text="Tambahkan variasi ukuran, warna, rasa, atau opsi lain untuk produk ini.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {values.variants.map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center', background: '#f8fafc', padding: 8, borderRadius: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{v.sku}</div>
                    <div style={{ fontSize: 13 }}>{formatRupiah(v.sellPrice)}</div>
                    <div style={{ fontSize: 12 }}>Stok: {v.qtyOnHand}</div>
                    <button style={{ color: '#e11d48', border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => {
                      const newVars = [...values.variants]; newVars.splice(i, 1); setField('variants', newVars);
                    }}><Trash2 size={14}/></button>
                  </div>
                ))}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  <input placeholder="Nama Varian (Misal: Large)" value={variantInput.name} onChange={e => setVariantInput({...variantInput, name: e.target.value})} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                  <input placeholder="SKU/Barcode Varian" value={variantInput.sku} onChange={e => setVariantInput({...variantInput, sku: e.target.value})} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                  <input placeholder="Harga Jual" value={variantInput.sellPrice} onChange={e => setVariantInput({...variantInput, sellPrice: e.target.value})} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                  <input placeholder="Stok" value={variantInput.qtyOnHand} onChange={e => setVariantInput({...variantInput, qtyOnHand: e.target.value})} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                </div>
                <button style={{ padding: '8px 16px', background: '#08a88c', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', alignSelf: 'flex-start' }} onClick={() => {
                  if(!variantInput.name || !variantInput.sku || !variantInput.sellPrice) return toast.error('Lengkapi form varian');
                  setField('variants', [...values.variants, { id: 'v-'+Date.now(), name: variantInput.name, sku: variantInput.sku, sellPrice: parseCurrencyInput(variantInput.sellPrice), qtyOnHand: parseInt(variantInput.qtyOnHand) || 0 }]);
                  setVariantInput({ name: '', sku: '', sellPrice: '', qtyOnHand: '' })
                }}>Tambah Varian</button>
              </div>
            </FeaturePanel>
          </section>

          <section ref={register('section-Ekstra')} className="flow-card compact-flow-card">
            <h2>Ekstra</h2>
            <FormRow label="Produk Memiliki Ekstra">
              <div className="inline-control">
                <Toggle checked={values.produkEkstra} onClick={() => setField('produkEkstra', !values.produkEkstra)} /> <HelpCircle size={16} />
              </div>
            </FormRow>
            {values.produkEkstra && (
              <>
                <FormRow label="Ubah Data Ekstra">
                  <div className="inline-control">
                    <Toggle checked={values.ubahDataEkstra} onClick={() => setField('ubahDataEkstra', !values.ubahDataEkstra)} /> <HelpCircle size={16} />
                  </div>
                </FormRow>
                {values.ubahDataEkstra && (
                  <FormRow label="Atur Ekstra">
                    <SelectInput placeholder="Pilih Ekstra" options={extraOptions} />
                    <div className="tier-row">
                      <input placeholder="Nama ekstra, contoh: Sambal" />
                      <input placeholder="Harga ekstra" />
                      <button>Tambah Ekstra</button>
                    </div>
                  </FormRow>
                )}
              </>
            )}
          </section>

          <section ref={register('section-Resep')} className="flow-card compact-flow-card">
            <h2>Resep</h2>
            <FeaturePanel title="Master Resep" text="Pilih resep yang sudah tersedia atau buat komposisi bahan baku langsung untuk produk ini.">
              <SelectInput placeholder="Pilih Master Resep" options={recipeOptions} />
            </FeaturePanel>
            <FormRow label="Resep Produk">
              <div className="inline-control">
                <Toggle checked={values.resepProduk} onClick={() => setField('resepProduk', !values.resepProduk)} /> <span>Aktifkan untuk menambahkan resep pada produk</span>
              </div>
            </FormRow>
            {values.resepProduk && (
              <FormRow label="Atur Bahan Baku">
                <button className="outline-wide">Tambah Bahan Baku</button>
              </FormRow>
            )}
          </section>

          <section ref={register('section-ManTechQ Order')} className="flow-card compact-flow-card">
            <h2>ManTechQ Order</h2>
            <div className="integration-empty">
              <Store size={92} />
              <p>Outlet ini belum terintegrasi dengan marketplace, silakan lakukan proses integrasi terlebih dahulu untuk menggunakan fitur ini</p>
              <Button>Ajukan Integrasi</Button>
            </div>
          </section>
        </main>
      </div>

      {currentGuide ? <GuideBubble step={currentGuide} rect={guideRect} onSkip={() => { setGuideStep(null); setGuideRect(null) }} onNext={nextGuide} /> : null}
      {guideDone ? <GuideDone onRepeat={() => setGuideStep(0)} onClose={() => setGuideDone(false)} /> : null}
      <FlowFooter onCancel={onClose} onBack={() => goSection(productSections[Math.max(sectionIndex - 1, 0)])} onNext={nextSection} onSave={validateProduct} saving={saving} />
    </div>
  )
}

function OutletDetailFlow({ onClose, onOutletSaved }) {
  const [values, setValues] = useState({
    name: 'Software House',
    manager: 'royyan',
    managerEmail: 'maulanaroyyan33@gmail.com',
    type: 'Penjualan',
    status: 'Buka',
    plan: 'TRIAL',
    expires: '19 Juni 2026',
    phone: '089530132499',
    whatsapp: '',
    email: 'maulanaroyyan33@gmail.com',
    country: 'Indonesia',
    province: 'Jawa Tengah',
    city: 'Kab. Tegal',
    address: '',
    socialType: 'Instagram',
    socialAccount: '',
    closeStore: false,
  })
  const [errors, setErrors] = useState({})
  const [managerOpen, setManagerOpen] = useState(false)
  const refs = useRef({})

  const setOutletField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const validateOutlet = () => {
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Nama outlet wajib diisi.'
    if (!values.phone.trim()) nextErrors.phone = 'Telepon wajib diisi.'
    if (!values.country.trim()) nextErrors.country = 'Negara wajib diisi.'
    if (!values.province.trim()) nextErrors.province = 'Provinsi wajib dipilih.'
    if (!values.city.trim()) nextErrors.city = 'Kota wajib dipilih.'
    if (!values.address.trim()) nextErrors.address = 'Alamat lengkap wajib diisi.'
    setErrors(nextErrors)
    const first = Object.keys(nextErrors)[0]
    if (first) {
      refs.current[first]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(nextErrors[first])
      return false
    }
    onOutletSaved?.(values.name)
    toast.success(`Outlet ${values.name} berhasil disimpan`)
    return true
  }

  const addManager = (manager) => {
    setValues((current) => ({ ...current, manager: manager.name, managerEmail: manager.email }))
    setManagerOpen(false)
    toast.success('Manager outlet ditambahkan')
  }

  return (
    <div className="setup-flow outlet-detail-flow">
      <FlowHeader title="Detail Outlet" onClose={onClose} />
      <main className="outlet-detail-body">
        <div className="info-banner">
          <Info size={16} />
          <span>Pengaturan pada nama, logo, jadwal operasional, dan alamat outlet akan tersimpan di berbagai fitur dan produk ManTechQ PoS yang terintegrasi</span>
        </div>

        <section className="flow-card outlet-detail-card">
          <h2>Informasi Outlet</h2>
          <h3>Detail Logo</h3>
          <FormRow label={<span className="label-inline">Logo Outlet <Info size={16} /></span>}>
            <div className="outlet-upload-line">
              <small>Ukuran 500px x 500px, maks 1MB</small>
              <UploadBox />
            </div>
          </FormRow>
          <FormRow label="Logo Struk">
            <div className="outlet-upload-line">
              <small>Ukuran dapat diatur sesuai kebutuhan, maks 1MB</small>
              <UploadBox />
            </div>
          </FormRow>

          <h3>Detail Outlet</h3>
          <FormRow refNode={(node) => { if (node) refs.current.name = node }} label={<span className="label-inline">Nama Outlet* <Info size={16} /></span>} error={errors.name}>
            <input value={values.name} onChange={(event) => setOutletField('name', event.target.value)} />
          </FormRow>
          <FormRow label="Manager Outlet">
            <div className="manager-field">
              <input value={values.manager} readOnly />
              <button type="button" onClick={() => setManagerOpen(true)}>...</button>
            </div>
            <small>{values.managerEmail}</small>
            <button type="button" className="outline-wide" onClick={() => setManagerOpen(true)}>Tambah Manager</button>
          </FormRow>
          <FormRow label="Jenis Outlet">
            <div className="radio-grid">
              <RadioCard label="Penjualan" checked={values.type === 'Penjualan'} onChange={() => setOutletField('type', 'Penjualan')} />
              <RadioCard label="Gudang" checked={values.type === 'Gudang'} onChange={() => setOutletField('type', 'Gudang')} />
            </div>
          </FormRow>
          <FormRow label="Status Outlet">
            <div className="radio-grid">
              <RadioCard label="Buka" checked={values.status === 'Buka'} onChange={() => setOutletField('status', 'Buka')} />
              <RadioCard label="Tutup" checked={values.status === 'Tutup'} onChange={() => setOutletField('status', 'Tutup')} />
            </div>
          </FormRow>
          <FormRow label="Layanan Langganan">
            <input value={values.plan} readOnly />
          </FormRow>
          <FormRow label="Masa Berlaku">
            <div className="expiry-row">
              <input value={values.expires} readOnly />
              <Button variant="outline">Perpanjang</Button>
            </div>
          </FormRow>

          <OutletSchedule />
        </section>

        <section className="flow-card outlet-detail-card">
          <h2>Tutup Toko</h2>
          <FormRow label="Tutup Toko">
            <div className="inline-control">
              <button type="button" className="toggle-button" onClick={() => setOutletField('closeStore', !values.closeStore)}>
                <Toggle checked={values.closeStore} />
              </button>
              <strong>{values.closeStore ? 'Tutup Toko Aktif' : 'Tutup Toko Tidak Aktif'}</strong>
            </div>
            <div className="notice-pill">Fitur tersedia pada POS versi 3.2.23100 ke atas</div>
            <small>Fitur Tutup Toko berfungsi untuk mengakhiri operasional harian di POS sekaligus menghasilkan laporan tutup toko</small>
          </FormRow>
        </section>

        <section className="flow-card outlet-detail-card">
          <h2>Kontak Outlet</h2>
          <FormRow refNode={(node) => { if (node) refs.current.phone = node }} label="Telepon*" error={errors.phone}>
            <input value={values.phone} onChange={(event) => setOutletField('phone', event.target.value)} />
          </FormRow>
          <FormRow label="Whatsapp">
            <input value={values.whatsapp} onChange={(event) => setOutletField('whatsapp', event.target.value)} placeholder="Contoh: 081 231600681" />
          </FormRow>
          <FormRow label="Email">
            <input value={values.email} onChange={(event) => setOutletField('email', event.target.value)} />
          </FormRow>
          <FormRow label={<span className="label-inline">Alamat <Info size={16} /></span>}>
            <div className="address-grid">
              <label>
                Negara*
                <input ref={(node) => { if (node) refs.current.country = node }} value={values.country} onChange={(event) => setOutletField('country', event.target.value)} />
              </label>
              <label>
                Provinsi*
                <SelectInput placeholder="Pilih provinsi" value={values.province} options={provinceOptions} onChange={(value) => setOutletField('province', value)} />
              </label>
              <label className="wide">
                Kota*
                <SelectInput placeholder="Pilih kota" value={values.city} options={cityOptions} onChange={(value) => setOutletField('city', value)} />
              </label>
              <label className="wide address-input">
                Alamat Lengkap*
                <div>
                  <input ref={(node) => { if (node) refs.current.address = node }} value={values.address} onChange={(event) => setOutletField('address', event.target.value)} placeholder="Contoh: Jalan Mangga No.12" />
                  <Button variant="outline">Ubah</Button>
                </div>
                <small>Pilih lokasi melalui Maps</small>
              </label>
            </div>
            {(errors.country || errors.province || errors.city || errors.address) ? <p className="field-error">{errors.country || errors.province || errors.city || errors.address}</p> : null}
          </FormRow>
        </section>

        <section className="flow-card outlet-detail-card">
          <h2>Media Sosial</h2>
          <p className="section-note">Jika media sosial lebih dari 1, silakan isi Nama Akun dan tekan enter untuk menambahkan (maks 4)</p>
          <FormRow label="Media Sosial">
            <div className="two-col">
              <SelectInput placeholder="Pilih media sosial" value={values.socialType} options={socialOptions} onChange={(value) => setOutletField('socialType', value)} />
              <input value={values.socialAccount} onChange={(event) => setOutletField('socialAccount', event.target.value)} placeholder="Contoh: serudimajoo" />
            </div>
          </FormRow>
        </section>
      </main>
      {managerOpen ? <ManagerModal outlet={values.name} onClose={() => setManagerOpen(false)} onSave={addManager} /> : null}
      <FlowFooter simple onCancel={onClose} onSave={validateOutlet} />
    </div>
  )
}

function RadioCard({ label, checked, onChange }) {
  return (
    <label className={cn('radio-card', checked && 'checked')}>
      <input type="radio" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  )
}

function OutletSchedule() {
  return (
    <div className="schedule-block">
      <h3>
        Jadwal Operasional Outlet
        <Info size={16} />
      </h3>
      <p>Tentukan hari dan jam operasional outlet serta atur buka dan tutup outlet</p>
      <div className="schedule-grid">
        <strong>Hari</strong>
        <strong>Jam Buka</strong>
        <strong>Jam Tutup</strong>
        <strong>Shift</strong>
        {scheduleDays.map((day) => (
          <React.Fragment key={day}>
            <div className="schedule-day">
              <span>{day}</span>
              <Toggle />
            </div>
            <div className="time-input"><Clock3 size={15} /> 00:00</div>
            <div className="time-input"><Clock3 size={15} /> 23:59</div>
            <div className="shift-cell">
              <label className="check-line"><input type="checkbox" defaultChecked /> 24 Jam</label>
              <button type="button"><Plus size={16} /></button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function ManagerModal({ outlet, onClose, onSave }) {
  const [values, setValues] = useState({
    name: '',
    employeeNo: 'SO260001',
    phone: '',
    position: '',
    outlet,
    pin: '123456',
    access: '',
    email: '',
  })
  const [errors, setErrors] = useState({})
  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }
  const save = () => {
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Nama wajib diisi.'
    if (!values.access.trim()) nextErrors.access = 'Hak akses wajib dipilih.'
    if (!values.email.trim()) nextErrors.email = 'Email wajib diisi.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast.error(Object.values(nextErrors)[0])
      return
    }
    onSave(values)
  }
  return (
    <div className="modal-scrim">
      <div className="manager-modal">
        <header>
          <h2>Tambah Manager Outlet</h2>
          <button type="button" onClick={onClose}><X size={22} /></button>
        </header>
        <div className="manager-grid">
          <label className={cn(errors.name && 'has-error')}>Nama*<input value={values.name} onChange={(event) => setField('name', event.target.value)} placeholder="Contoh: Adi" />{errors.name ? <span>{errors.name}</span> : null}</label>
          <label>Nomor Induk Pegawai<input value={values.employeeNo} onChange={(event) => setField('employeeNo', event.target.value)} /></label>
          <label>No Telepon<input value={values.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="Contoh: 081222333444" /></label>
          <label>Posisi<input value={values.position} onChange={(event) => setField('position', event.target.value)} placeholder="Contoh: Kasir" /></label>
          <label>Outlet<input value={values.outlet} readOnly /></label>
          <label>PIN<div className="pin-field"><input type="password" maxLength={6} value={values.pin} onChange={(event) => setField('pin', event.target.value)} /><HelpCircle size={17} /></div><small>Default PIN: 123456</small></label>
          <label className={cn(errors.access && 'has-error')}>Hak Akses*<SelectInput placeholder="Pilih" value={values.access} options={accessRoleOptions} onChange={(value) => setField('access', value)} />{errors.access ? <span>{errors.access}</span> : null}</label>
          <label className={cn(errors.email && 'has-error')}>Email*<input value={values.email} onChange={(event) => setField('email', event.target.value)} placeholder="Contoh: adi@gmail.com" />{errors.email ? <span>{errors.email}</span> : null}</label>
        </div>
        <footer>
          <button type="button" onClick={onClose}>Batal</button>
          <Button onClick={save}>Simpan</Button>
        </footer>
      </div>
    </div>
  )
}

function SimpleSetupFlow({ type, onClose, outlets, onOutletCreated }) {
  const isEmployee = type === 'employee'
  const title = isEmployee ? 'Tambah Akses Karyawan' : 'Lengkapi Data Outlet'
  const fields = isEmployee
    ? ['Nama*', 'Nomor Induk Pegawai*', 'Hak Akses*', 'Outlet*', 'PIN*']
    : ['Nama Outlet*', 'Alamat Outlet*', 'Kota*', 'Nomor Telepon*', 'Jam Operasional*']
  const [values, setValues] = useState(isEmployee ? { 'Nomor Induk Pegawai*': 'SO260001', 'Hak Akses*': 'Kasir', 'Outlet*': outlets[0] || '', 'PIN*': '123456' } : {})
  const [errors, setErrors] = useState({})
  const simpleRefs = useRef({})
  const setSimpleField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }
  const validateSimple = () => {
    const nextErrors = {}
    fields.forEach((field) => {
      if (field.includes('*') && !String(values[field] || '').trim()) {
        nextErrors[field] = `${field.replace('*', '')} wajib diisi.`
      }
    })
    setErrors(nextErrors)
    const first = Object.keys(nextErrors)[0]
    if (first) {
      simpleRefs.current[first]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(nextErrors[first])
      return false
    }
    if (!isEmployee) {
      onOutletCreated?.(values['Nama Outlet*'])
    }
    toast.success(`${title} berhasil divalidasi dan siap disimpan`)
    return true
  }
  const renderEmployeeForm = () => (
    <section className="flow-card employee-card">
      <FormRow label="Foto Karyawan">
        <div className="photo-row employee-photo">
          <UploadBox />
        </div>
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Nama*'] = node }} label="Nama*" error={errors['Nama*']}>
        <input value={values['Nama*'] || ''} onChange={(event) => setSimpleField('Nama*', event.target.value)} placeholder="Contoh: Budi" />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Nomor Induk Pegawai*'] = node }} label="Nomor Induk Pegawai*" error={errors['Nomor Induk Pegawai*']}>
        <input value={values['Nomor Induk Pegawai*'] || 'SO260001'} onChange={(event) => setSimpleField('Nomor Induk Pegawai*', event.target.value)} placeholder="SO260001" />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Hak Akses*'] = node }} label="Hak Akses*" error={errors['Hak Akses*']}>
        <SelectInput placeholder="Pilih" value={values['Hak Akses*']} options={accessRoleOptions} onChange={(value) => setSimpleField('Hak Akses*', value)} />
      </FormRow>
      <FormRow label={<span className="label-inline">Akses Karyawan <Info size={16} /></span>}>
        <div className="inline-control">
          <Toggle checked />
          <span>Akses Karyawan Aktif</span>
        </div>
      </FormRow>
      <div className="flow-divider" />
      <FormRow label="Telepon">
        <input value={values.Telepon || ''} onChange={(event) => setSimpleField('Telepon', event.target.value)} placeholder="Contoh: 081111111111" />
      </FormRow>
      <FormRow label="Email">
        <input value={values.Email || ''} onChange={(event) => setSimpleField('Email', event.target.value)} placeholder="Contoh: emailsaya@gmail.com" />
      </FormRow>
      <FormRow label="Posisi">
        <input value={values.Posisi || ''} onChange={(event) => setSimpleField('Posisi', event.target.value)} placeholder="Contoh: Manager" />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Outlet*'] = node }} label="Outlet*" error={errors['Outlet*']}>
        <SelectInput placeholder="Pilih" value={values['Outlet*']} options={outlets} onChange={(value) => setSimpleField('Outlet*', value)} />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['PIN*'] = node }} label="PIN*" error={errors['PIN*']}>
        <div className="pin-field">
          <input type="password" maxLength={6} value={values['PIN*'] || '123456'} onChange={(event) => setSimpleField('PIN*', event.target.value)} placeholder="Maksimal 6 digit" />
          <HelpCircle size={17} />
        </div>
        <small>Default: 123456 (Maksimal 6 digit)</small>
      </FormRow>
    </section>
  )
  return (
    <div className="setup-flow">
      <FlowHeader title={title} onClose={onClose} />
      <div className="flow-body simple-flow">
        <main className="flow-main">
          {isEmployee ? renderEmployeeForm() : (
          <section className="flow-card outlet-card">
            <h2>{title}</h2>
            {fields.map((field) => (
              <FormRow key={field} refNode={(node) => { if (node) simpleRefs.current[field] = node }} label={field} error={errors[field]}>
                {field.includes('Alamat') ? (
                  <textarea value={values[field] || ''} onChange={(event) => setSimpleField(field, event.target.value)} placeholder={`Masukkan ${field.replace('*', '').toLowerCase()}`} />
                ) : (
                  <input value={values[field] || ''} onChange={(event) => setSimpleField(field, event.target.value)} placeholder={`Masukkan ${field.replace('*', '').toLowerCase()}`} />
                )}
              </FormRow>
            ))}
            <FeaturePanel title="Pengaturan Operasional" text="Atur multi-outlet, pajak, service charge, dan integrasi pembayaran outlet.">
              <div className="two-col">
                <input placeholder="Pajak default" />
                <input placeholder="Service charge" />
              </div>
            </FeaturePanel>
          </section>
          )}
        </main>
      </div>
      <FlowFooter simple={isEmployee} onCancel={onClose} onBack={onClose} onNext={validateSimple} onSave={validateSimple} />
    </div>
  )
}

function FlowHeader({ title, onClose }) {
  return (
    <header className="flow-header">
      <button onClick={onClose} aria-label="Tutup">
        <X size={21} />
      </button>
      <strong>{title}</strong>
      <Brand />
    </header>
  )
}

function FlowFooter({ onCancel, onBack, onNext, onSave, simple, saving }) {
  return (
    <footer className="flow-footer">
      <button onClick={onCancel}>Batal</button>
      <div>
        {!simple ? <button onClick={onBack}>Kembali</button> : null}
        {!simple ? <button onClick={onNext}>Selanjutnya</button> : null}
        <Button disabled={saving} onClick={onSave || (() => toast.success('Data berhasil disimpan'))}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
      </div>
    </footer>
  )
}

function FormRow({ label, children, refNode, guideKey, currentKey, hint, wide, error }) {
  return (
    <div ref={refNode} className={cn('form-row', wide && 'wide', error && 'has-error', guideKey === currentKey && 'guided-target')}>
      <label>
        {label}
        {hint ? <small>{hint}</small> : null}
      </label>
      <div className="form-control">
        {children}
        {error ? <p className="field-error">{error}</p> : null}
      </div>
    </div>
  )
}

function UploadBox() {
  const [fileInfo, setFileInfo] = useState(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!fileInfo?.file || !fileInfo.file.type.startsWith('image/')) {
      setPreview('')
      return undefined
    }
    const nextPreview = URL.createObjectURL(fileInfo.file)
    setPreview(nextPreview)
    return () => URL.revokeObjectURL(nextPreview)
  }, [fileInfo])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileInfo({ file, name: file.name })
    toast.success(`Foto dipilih: ${file.name}`)
  }

  return (
    <label className={cn('upload-box', fileInfo && 'has-file')}>
      <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFile} />
      {preview ? <img src={preview} alt="Preview foto karyawan" /> : <Upload size={18} />}
      <span>{fileInfo?.name || 'Pilih atau letakkan berkas di sini'}</span>
    </label>
  )
}

function SelectInput({ placeholder, value, options = [], onChange, onClick }) {
  const [open, setOpen] = useState(false)
  const hasOptions = options.length > 0
  const handleSelect = (option) => {
    onChange?.(option)
    setOpen(false)
  }

  return (
    <div className="select-wrap">
      <button
        type="button"
        className={cn('flow-select', open && 'open')}
        onClick={() => {
          if (hasOptions) setOpen((current) => !current)
          else onClick?.()
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} />
      </button>
      {open ? (
        <div className="select-menu">
          {options.map((option) => (
            <button key={option} type="button" className={cn(option === value && 'selected')} onClick={() => handleSelect(option)}>
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Toggle({ checked, onClick }) {
  return <button type="button" onClick={onClick} className={cn('toggle', checked && 'on')}>{checked ? 'ON' : 'OFF'}</button>
}

function FeaturePanel({ title, text, children }) {
  return (
    <div className="feature-panel">
      {title ? <strong>{title}</strong> : null}
      <p>{text}</p>
      {children ? <div className="feature-content">{children}</div> : null}
    </div>
  )
}

function TourSpotlight({ rect }) {
  if (!rect) return <div className="tour-dim plain" />
  return (
    <>
      <div className="tour-dim top" style={{ height: rect.top }} />
      <div className="tour-dim left" style={{ top: rect.top, width: rect.left, height: rect.height }} />
      <div className="tour-dim right" style={{ top: rect.top, left: rect.left + rect.width, height: rect.height }} />
      <div className="tour-dim bottom" style={{ top: rect.top + rect.height }} />
      <div className="tour-ring" style={rect} />
    </>
  )
}

function GuideBubble({ step, rect, onSkip, onNext }) {
  const top = rect ? Math.min(window.innerHeight - 190, Math.max(86, rect.top + rect.height / 2 - 78)) : 180
  const left = rect ? Math.max(18, Math.min(window.innerWidth - 330, rect.left - 330)) : 240
  return (
    <div className="guide-bubble" style={{ top, left }}>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
      <div className="guide-actions">
        <button onClick={onSkip}>Lewati</button>
        <button onClick={onNext}>Lanjut <span>({step.count})</span></button>
      </div>
    </div>
  )
}

function GuideDone({ onRepeat, onClose }) {
  return (
    <div className="guide-done">
      <button className="guide-done-close" onClick={onClose} aria-label="Tutup panduan">
        <X size={20} />
      </button>
      <h3>Panduan Selesai!</h3>
      <p>Anda telah menyelesaikan panduan pembuatan produk. Sudah siap untuk menambahkan produk anda sendiri?</p>
      <div>
        <button onClick={onRepeat}>Ulangi Panduan</button>
        <Button onClick={onClose}>Oke</Button>
      </div>
    </div>
  )
}

function TrialBar() {
  return null
}

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('owner@mantechq.local')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const session = await signInWithEmail(email)
      onAuthenticated(session)
      toast.success(mode === 'signup' ? 'Akun dev dibuat' : 'Login berhasil')
    } catch (error) {
      toast.error(error.message || 'Login gagal')
    } finally {
      setLoading(false)
      return
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <div>
          <h1>{mode === 'signup' ? 'Buat akses POS' : 'Masuk ke POS'}</h1>
          <p>Gunakan akun dev POS lokal yang terhubung ke PostgreSQL.</p>
        </div>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@domain.com" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 6 karakter" minLength={6} required />
          </label>
          <Button disabled={loading}>{loading ? 'Memproses...' : mode === 'signup' ? 'Daftar' : 'Masuk'}</Button>
        </form>
        <button className="auth-switch" onClick={() => setMode((value) => (value === 'signup' ? 'signin' : 'signup'))}>
          {mode === 'signup' ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
        </button>

        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#0f172a' }}>Akun Demo:</strong>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong>Owner:</strong> owner@mantechq.local (Sandi: admin123)</li>
            <li><strong>Admin:</strong> admin@mantechq.local (Sandi: admin123)</li>
            <li><strong>Kasir:</strong> kasir@mantechq.local (Sandi: admin123)</li>
          </ul>
        </div>
      </section>
      <Toaster richColors position="top-right" />
    </main>
  )
}

function NoMembershipPage({ session, onSignOut }) {
  return (
    <main className="auth-page">
      <section className="auth-card membership-card">
        <Brand />
        <h1>Akses belum aktif</h1>
        <p>
          Akun <strong>{session.user.email}</strong> sudah login, tapi belum terdaftar di <code>pos_team_members</code>.
        </p>
        <p>Admin perlu menambahkan user ini ke organization/outlet sebelum data POS bisa tampil.</p>
        <code>{session.user.id}</code>
        <Button variant="outline" onClick={onSignOut}>
          Keluar
        </Button>
      </section>
      <Toaster richColors position="top-right" />
    </main>
  )
}

function DataErrorPage({ error, onRetry, onSignOut }) {
  return (
    <main className="auth-page">
      <section className="auth-card membership-card">
        <Brand />
        <h1>Data PostgreSQL gagal dimuat</h1>
        <p>{error}</p>
        <Button onClick={onRetry}>Coba Lagi</Button>
        <Button variant="outline" onClick={onSignOut}>
          Keluar
        </Button>
      </section>
      <Toaster richColors position="top-right" />
    </main>
  )
}

function LoadingApp() {
  return (
    <main className="auth-page">
      <section className="auth-card membership-card">
        <Brand />
        <h1>Memuat POS</h1>
        <p>Menghubungkan ke PostgreSQL...</p>
      </section>
    </main>
  )
}

function useApiSession() {
  const [session, setSessionState] = useState(() => getStoredSession())
  const [loading, setLoading] = useState(false)

  const setSession = (nextSession) => {
    setSessionState(nextSession)
  }

  const signOut = () => {
    clearStoredSession()
    setSessionState(null)
    toast.success('Berhasil keluar')
  }

  return { session, loading, setSession, signOut }
}

function usePostgresPosData(session) {
  const [state, setState] = useState({
    loading: true,
    error: '',
    memberships: [],
    stockItems: [],
    sales: [],
    salesDetails: [],
    stockMutations: [],
    shifts: [],
    categories: [],
  })

  const refresh = async () => {
    if (!session?.user?.id) return
    let data
    try {
      data = await getPosData(session.user.id)
    } catch (error) {
      toast.error(error.message)
      return
    }

    setState({
      loading: false,
      error: '',
      memberships: data.memberships || [],
      stockItems: data.stockItems || [],
      sales: data.sales || [],
      salesDetails: data.salesDetails || [],
      stockMutations: data.stockMutations || [],
      shifts: data.shifts || [],
      categories: data.categories || [],
    })
  }

  useEffect(() => {
    refresh()
  }, [session?.user?.id])

  return { ...state, refresh }
}

function App() {
  const { session, loading: sessionLoading, setSession, signOut } = useApiSession()
  const isKasir = session?.user?.role === 'kasir' || session?.user?.email?.includes('kasir')
  const [isPosMode, setIsPosMode] = useState(false)
  const [activeTab, setActiveTab] = useState('Penjualan')
  const [activePage, setActivePage] = useState('Menu Favorit')
  const [openGroup, setOpenGroup] = useState('Menu Favorit')
  const [isOpen, setIsOpen] = useState(false)
  const [flowState, setFlowState] = useState({ activeFlow: null, flowData: null })
  const activeFlow = flowState.activeFlow
  const flowData = flowState.flowData
  const handleStartFlow = (type, data = null) => {
    setFlowState({ activeFlow: type, flowData: data })
  }
  const [outlets, setOutlets] = useState(defaultOutlets)
  const [activeOutlet, setActiveOutlet] = useState(defaultOutlets[0])
  const posData = usePostgresPosData(session)
  const isFavorite = activePage === 'Menu Favorit'
  const isDashboard = activePage === 'Dashboard'
  const addOutlet = (name) => {
    const cleanName = String(name || '').trim()
    if (!cleanName) return
    setOutlets((current) => (current.includes(cleanName) ? current : [cleanName, ...current]))
    setActiveOutlet(cleanName)
  }

  useEffect(() => {
    if (!posData.memberships.length) return
    const nextOutlets = ['Semua Outlet', ...posData.memberships.map((item) => `Outlet ${shortId(item.outlet_id || item.org_id)}`)]
    setOutlets(nextOutlets)
    setActiveOutlet(nextOutlets[1] || nextOutlets[0])
  }, [posData.memberships])

  useEffect(() => {
    if (isKasir && !sessionLoading) {
      setIsPosMode(true)
    }
  }, [isKasir, sessionLoading])

  if (sessionLoading) return <LoadingApp />
  if (!session) return <AuthPage onAuthenticated={setSession} />
  if (posData.loading) return <LoadingApp />
  if (posData.error) return <DataErrorPage error={posData.error} onRetry={posData.refresh} onSignOut={signOut} />
  if (!posData.memberships.length) return <NoMembershipPage session={session} onSignOut={signOut} />

  if (activeFlow) {
    return (
      <>
        <SetupFlow type={activeFlow} initialData={flowData} outlets={outlets} onOutletCreated={addOutlet} onClose={() => setFlowState({ activeFlow: null, flowData: null })} posData={posData} session={session} />
        <Toaster richColors position="top-right" />
      </>
    )
  }

  if (isPosMode) {
    return (
      <>
        <PosApp posData={posData} session={session} onClose={() => setIsPosMode(false)} />
        <Toaster richColors position="top-right" />
      </>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        openGroup={openGroup}
        setOpenGroup={setOpenGroup}
        setActivePage={setActivePage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeOutlet={activeOutlet}
        setIsPosMode={setIsPosMode}
      />
      <div className="main-shell">
        <Topbar activeTab={activeTab} setActiveTab={setActiveTab} setIsOpen={setIsOpen} onSignOut={signOut} />
        {activeTab !== 'Penjualan' ? (
          <TopModulePage activeTab={activeTab} onStartFlow={handleStartFlow} />
        ) : isFavorite ? (
          <MenuFavoritePage onStartFlow={handleStartFlow} posData={posData} />
        ) : isDashboard ? (
          <SalesDashboard activeTab={activeTab} onStartFlow={handleStartFlow} posData={posData} />
        ) : (
          <ModulePage activePage={activePage} onStartFlow={handleStartFlow} posData={posData} />
        )}
        <TrialBar />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}

createRoot(document.getElementById('app')).render(<App />)
