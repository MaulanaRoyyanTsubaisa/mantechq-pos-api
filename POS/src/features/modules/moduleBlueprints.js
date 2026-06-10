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
        children: ['Penjualan Produk', 'Penjualan Departemen', 'Penjualan Kategori', 'Penjualan Ekstra', 'Penjualan Sub Ekstra'],
      },
      {
        label: 'Laporan Jasa',
        children: ['Laporan Jasa', 'Laporan Reservasi', 'Laporan Reservasi & Utilisasi'],
      },
      'Laporan Fasilitas',
      'Laporan Promo & Loyalti',
      'Laporan Pajak',
      {
        label: 'Laporan Kasir',
        children: ['Laporan Kas Kasir', 'Penjualan Per Kasir', 'Penjualan Per Terminal', 'Laporan Tutup Kasir', 'Laporan Tutup Toko'],
      },
      {
        label: 'Laporan Deposit',
        children: ['Penjualan Deposit', 'Deposit Kedaluwarsa', 'Sisa Deposit'],
      },
      'Laporan Pelanggan',
      'Laporan Karyawan',
      {
        label: 'Laporan Persediaan',
        children: ['Lap. Ringkasan Persediaan', 'Lap. Detail Persediaan', 'Laporan Stok Kedaluwarsa', 'Laporan Serial Number', 'Laporan Batch Number'],
      },
      {
        label: 'Laporan Settlement',
        children: ['QRIS', 'Order Online'],
      },
    ],
  },
  {
    label: 'Produk',
    icon: Package,
    children: [
      'Daftar Kategori',
      'Daftar Produk',
      'Penjadwalan Harga',
      'Harga Berdasarkan Waktu',
      'Cetak Barcode',
      'Daftar Kategori Catatan',
      'Master Resep',
    ],
  },
  {
    label: 'Inventori',
    icon: Boxes,
    children: [
      'Daftar Bahan Baku',
      {
        label: 'Pembelian Stok',
        children: ['Permintaan Barang', 'Pemesanan Stok', 'Pengiriman Pembelian', 'Faktur Pembelian', 'Pembayaran Faktur', 'Retur'],
      },
      {
        label: 'Kelola Stok',
        children: ['Daftar Stok', 'Stok Opname', 'Stok Terbuang', 'Riwayat Stok'],
      },
      'Produksi Stok',
      'Mutasi Antar Outlet',
      'Daftar Pemasok'
    ],
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
    rows: [['IT', '1', '0 item', 'IT', 'Tampil di Menu', '']],
    pagination: 'Ditampilkan 1 - 1 dari 1 data',
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
  'Lap. Detail Persediaan': {
    title: 'Laporan Detail Persediaan',
    type: 'report',
    filters: ['Semua Outlet', 'Semua Kategori', 'Semua Gudang'],
    columns: ['PRODUK', 'SKU', 'STOK AWAL', 'STOK MASUK', 'STOK KELUAR', 'STOK AKHIR'],
    rows: [],
  },
  'Riwayat Stok': {
    title: 'Riwayat Stok (Stock Movement)',
    type: 'report',
    actions: ['Ekspor Data'],
    filters: ['Semua Outlet', 'Semua Gudang', 'Semua Transaksi'],
    columns: ['TANGGAL', 'PRODUK', 'SKU', 'REFERENSI', 'KETERANGAN', 'QTY BERUBAH', 'SISA STOK'],
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

function mapStockToProductRows(stockItems) {
  return stockItems.map((item) => [
    item.item_name,
    item.sku,
    item.category_name || '-',
    formatRupiah(0),
    formatRupiah(0),
    formatRupiah(item.sell_price),
    item.is_active ? 'Tampil di Menu' : 'Tidak Tampil di Menu',
    '',
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

function mapStockMovementRows(mutations) {
  return mutations.map((row) => [
    new Date(row.created_at || Date.now()).toLocaleDateString('id-ID'),
    row.item_name,
    row.sku,
    row.ref_id || '-',
    row.type === 'SALE' ? 'Penjualan' : row.type === 'RESTOCK' ? 'Pembelian Stok' : 'Penyesuaian',
    row.qty_change > 0 ? `+${formatQty(row.qty_change)}` : formatQty(row.qty_change),
    formatQty(row.qty_after),
  ])
}

function buildSalesSummary(posData) {
  const sales = posData.sales || []
  const details = posData.salesDetails || []
  const paidSales = sales.filter((sale) => sale.payment_status === 'paid')
  const grandTotal = sales.reduce((sum, sale) => sum + Number(sale.grand_total || 0), 0)
  const paidTotal = paidSales.reduce((sum, sale) => sum + Number(sale.paid_total || 0), 0)
  const productQty = details.reduce((sum, row) => sum + Number(row.qty || 0), 0)

  return {
    grandTotal,
    paidTotal,
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
      : ['08', '10', '12', '14', '16', '18', '20']
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
    const index = Math.min(Math.max(Math.floor((hour - 8) / 2), 0), buckets.length - 1)
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
  if (!buckets.length || !maxValue || buckets.filter((item) => item.current > 0).length < 2) return ''
  const width = 100
  const height = 100
  return buckets.map((item, index) => {
    const x = buckets.length === 1 ? 50 : (index / (buckets.length - 1)) * width
    const y = height - ((item.current / maxValue) * 76 + 10)
    return `${index ? 'L' : 'M'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
}

function getRowsForPage(page, posData) {
  const stockItems = posData.stockItems || []
  const salesDetails = posData.salesDetails || []
  const stockMutations = posData.stockMutations || []

  if (page === 'Daftar Produk') return mapStockToProductRows(stockItems)
  if (page === 'Cetak Barcode') return mapStockToBarcodeRows(stockItems)
  if (['Kelola Stok', 'Daftar Bahan Baku', 'Lap. Ringkasan Persediaan', 'Lap. Detail Persediaan'].includes(page)) {
    return mapStockToInventoryRows(stockItems)
  }
  if (page === 'Detail Penjualan') return mapSalesDetailRows(salesDetails)
  if (page === 'Riwayat Stok') return mapStockMovementRows(stockMutations)
  return []
}

function downloadCSV(title, columns, rows) {
  const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`
  const csvContent = [
    columns.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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


export {
  sidebarGroups,
  defaultOutlets,
  accessRoleOptions,
  categoryOptions,
  unitOptions,
  serialInputOptions,
  groupOptions,
  extraOptions,
  recipeOptions,
  paymentMethodOptions,
  provinceOptions,
  cityOptions,
  socialOptions,
  scheduleDays,
  topTabs,
  moreMenu,
  reportCards,
  quickFavorites,
  moduleBlueprints,
  reportPageConfigs,
  productPageConfigs,
  cn,
  formatRupiah,
  formatQty,
  shortId,
  membershipOutletLabel,
  parseCurrencyInput,
  parseQuantityInput,
  mapStockToProductRows,
  mapStockToBarcodeRows,
  mapStockToInventoryRows,
  mapSalesDetailRows,
  mapStockMovementRows,
  buildSalesSummary,
  buildDashboardChartData,
  buildChartPath,
  getRowsForPage,
  downloadCSV,
  itemLabel,
  itemChildren,
  flattenItems,
}
