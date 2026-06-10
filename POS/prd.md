# Product Requirements Document (PRD)

## Sistem Point of Sale Berbasis Web untuk UMKM Retail dan F\&B

**Nama Produk:** ManTechQ PoS  
**Versi Dokumen:** 1.0  
**Tanggal:** 09 Juni 2026  
**Frontend:** React, shadcn/ui, Tailwind CSS  
**Backend:** Laravel REST API  
**Database:** PostgreSQL

\---

## 1\. Ringkasan Produk

Sistem Point of Sale ini adalah aplikasi kasir berbasis web yang dirancang untuk membantu UMKM, toko retail, cafe, restoran kecil, booth makanan, dan bisnis multi-outlet dalam mengelola transaksi penjualan, produk, stok barang, laporan penjualan, pembayaran, serta operasional kasir harian.

Produk ini dikembangkan sebagai platform POS modern dengan pendekatan modular. Pada tahap awal, sistem akan berfokus pada fitur inti seperti transaksi kasir, manajemen produk, manajemen stok dasar, role user, buka/tutup kasir, cetak struk, dan laporan penjualan harian.

Setelah MVP stabil, sistem dapat dikembangkan ke fitur inventory lanjutan, CRM, loyalty, mode meja, kitchen display, akuntansi, omnichannel, dan integrasi payment gateway.

\---

## 2\. Tujuan Produk

Tujuan utama dari sistem ini adalah menyediakan aplikasi POS yang mudah digunakan, cepat, ringan, dan sesuai kebutuhan UMKM Indonesia.

### Tujuan Bisnis

1. Membantu pemilik usaha mencatat transaksi penjualan secara digital.
2. Mengurangi kesalahan pencatatan manual.
3. Mempermudah pengelolaan produk, stok, dan laporan.
4. Menyediakan sistem kasir yang dapat digunakan oleh kasir, admin, dan owner.
5. Menjadi pondasi awal untuk produk SaaS POS berbayar.
6. Mendukung pengembangan fitur lanjutan seperti multi-outlet, QRIS dinamis, loyalty, inventory advanced, dan omnichannel.

\---

## 3\. Target Pengguna

### 3.1 Owner / Pemilik Usaha

Owner adalah pengguna utama yang memiliki akses penuh ke sistem. Owner dapat melihat dashboard, laporan penjualan, mengelola outlet, produk, kasir, stok, metode pembayaran, dan pengaturan bisnis.

#### Kebutuhan Owner

1. Melihat total penjualan harian.
2. Melihat produk terlaris.
3. Melihat performa kasir.
4. Mengontrol stok barang.
5. Melihat metode pembayaran yang digunakan pelanggan.
6. Mengekspor laporan ke Excel.
7. Mengatur user dan hak akses.

### 3.2 Admin

Admin bertugas membantu owner mengelola data operasional seperti produk, kategori, stok, supplier, dan laporan tertentu.

#### Kebutuhan Admin

1. Menambah dan mengubah produk.
2. Mengatur kategori produk.
3. Mengelola stok barang.
4. Melihat transaksi.
5. Mengekspor data.
6. Membantu konfigurasi outlet dan metode pembayaran.

### 3.3 Kasir

Kasir bertugas melakukan transaksi penjualan harian di toko/outlet.

#### Kebutuhan Kasir

1. Login ke aplikasi kasir.
2. Membuka kasir dengan modal awal.
3. Memilih produk ke keranjang.
4. Memberikan diskon jika diizinkan.
5. Memilih metode pembayaran.
6. Menyelesaikan transaksi.
7. Mencetak atau mengirim struk.
8. Menutup kasir di akhir shift.

\---

## 4\. Masalah yang Ingin Diselesaikan

Banyak UMKM masih mengelola transaksi secara manual menggunakan buku catatan, kalkulator, spreadsheet, atau aplikasi kasir sederhana yang tidak terhubung dengan stok dan laporan. Akibatnya, pemilik usaha sering mengalami kendala seperti:

1. Kesalahan pencatatan transaksi.
2. Sulit mengetahui stok aktual.
3. Tidak tahu produk paling laku.
4. Sulit mengecek performa kasir.
5. Laporan penjualan tidak rapi.
6. Tidak ada histori transaksi yang mudah dicari.
7. Sulit menghitung profit karena tidak ada data HPP.
8. Tidak ada kontrol hak akses antara owner, admin, dan kasir.
9. Sulit melakukan tutup kasir dan pencocokan uang fisik.
10. Tidak ada data yang cukup untuk mengambil keputusan bisnis.

Sistem ini dibuat untuk menjawab masalah tersebut dengan menyediakan aplikasi POS yang terstruktur, mudah digunakan, dan dapat dikembangkan menjadi platform bisnis lengkap.

\---

## 5\. Ruang Lingkup Produk

### 5.1 Scope MVP

Pada versi MVP, sistem akan mencakup fitur berikut:

1. Authentication dan login user.
2. Role user: owner, admin, kasir.
3. Manajemen outlet/store.
4. Manajemen produk.
5. Manajemen kategori produk.
6. Varian produk sederhana.
7. SKU/barcode produk.
8. Transaksi kasir.
9. Diskon transaksi.
10. Pajak transaksi.
11. Metode pembayaran: cash, transfer, QRIS manual.
12. Split payment sederhana.
13. Cetak atau download struk.
14. Digital receipt via WhatsApp link.
15. Buka kasir.
16. Tutup kasir.
17. Laporan penjualan harian.
18. Stok otomatis berkurang saat transaksi.
19. Stock movement basic.
20. Export laporan ke Excel.

### 5.2 Out of Scope MVP

Fitur berikut tidak masuk versi MVP dan akan dikembangkan pada fase berikutnya:

1. Payment gateway QRIS dinamis.
2. Integrasi EDC.
3. WhatsApp API resmi.
4. Marketplace integration.
5. Mode meja restoran.
6. Kitchen display.
7. Akuntansi lengkap.
8. Payroll.
9. Absensi karyawan.
10. Multi warehouse advanced.
11. Offline mode penuh.
12. Mobile app native.
13. AI product description.
14. Loyalty point advanced.
15. Omnichannel marketplace.

\---

## 6\. Tech Stack

### 6.1 Frontend

Frontend menggunakan:

1. React.
2. shadcn/ui.
3. Tailwind CSS.
4. React Router.
5. TanStack Query.
6. React Hook Form.
7. Zod validation.
8. Zustand atau Context API untuk state management.
9. Recharts untuk grafik dashboard.
10. Axios atau Fetch API untuk komunikasi ke backend.

Frontend akan berbentuk web app responsive yang dapat digunakan di desktop, laptop, tablet, dan browser kasir.

### 6.2 Backend

Backend menggunakan:

1. Laravel.
2. Laravel Sanctum untuk authentication API.
3. PostgreSQL sebagai database utama.
4. Laravel Policy/Gate untuk authorization.
5. Laravel Queue untuk proses background seperti export laporan.
6. Laravel Storage untuk menyimpan gambar produk.
7. Laravel Excel untuk export data.
8. REST API sebagai komunikasi utama dengan frontend.

### 6.3 Database

Database menggunakan PostgreSQL karena stabil, kuat untuk relasi data, mendukung transaksi kompleks, dan cocok untuk sistem POS yang membutuhkan konsistensi data.

### 6.4 Deployment

Rekomendasi deployment:

1. Frontend: Netlify, Vercel, atau VPS dengan Nginx.
2. Backend: VPS dengan Nginx, PHP-FPM, Laravel, dan Supervisor.
3. Database: PostgreSQL di VPS atau managed database.
4. File storage: local storage di awal, lalu bisa dikembangkan ke S3-compatible storage.

\---

## 7\. Role dan Hak Akses

### 7.1 Owner

Owner memiliki akses penuh ke seluruh fitur.

Hak akses:

1. Dashboard.
2. Kelola outlet.
3. Kelola user.
4. Kelola role.
5. Kelola produk.
6. Kelola kategori.
7. Kelola stok.
8. Kelola transaksi.
9. Melihat semua laporan.
10. Export laporan.
11. Konfigurasi pajak.
12. Konfigurasi metode pembayaran.
13. Konfigurasi struk.
14. Melihat aktivitas kasir.

### 7.2 Admin

Admin memiliki akses operasional, tetapi tidak bisa menghapus data penting tanpa izin owner.

Hak akses:

1. Kelola produk.
2. Kelola kategori.
3. Kelola stok.
4. Melihat transaksi.
5. Melihat laporan tertentu.
6. Export laporan tertentu.
7. Kelola customer jika fitur CRM sudah tersedia.
8. Tidak bisa menghapus outlet.
9. Tidak bisa menghapus owner.
10. Tidak bisa mengubah pengaturan billing SaaS.

### 7.3 Kasir

Kasir hanya memiliki akses ke fitur transaksi.

Hak akses:

1. Login ke POS.
2. Buka kasir.
3. Melakukan transaksi.
4. Menerapkan diskon jika diizinkan.
5. Menerima pembayaran.
6. Cetak struk.
7. Mengirim struk via WhatsApp link.
8. Tutup kasir.
9. Melihat transaksi miliknya sendiri.
10. Tidak bisa menghapus produk.
11. Tidak bisa mengubah stok secara manual.
12. Tidak bisa melihat laporan owner secara penuh.

\---

## 8\. Struktur Menu Aplikasi

Struktur menu MVP:

```text
Dashboard
├── Kasir / POS
├── Transaksi
│   ├── Daftar Transaksi
│   ├── Detail Transaksi
│   └── Refund / Void
├── Produk
│   ├── Daftar Produk
│   ├── Kategori
│   ├── Varian
│   └── Barcode / SKU
├── Inventory
│   ├── Stok Barang
│   └── Stock Movement
├── Kasir Shift
│   ├── Buka Kasir
│   ├── Tutup Kasir
│   └── Riwayat Shift
├── Laporan
│   ├── Penjualan Harian
│   ├── Produk Terlaris
│   ├── Metode Pembayaran
│   └── Stok
├── User \& Role
│   ├── User
│   └── Role Permission
└── Pengaturan
    ├── Outlet
    ├── Pajak
    ├── Metode Pembayaran
    └── Template Struk
```

\---

## 9\. Fitur MVP Detail

### 9.1 Authentication

#### Deskripsi

Sistem menyediakan fitur login untuk owner, admin, dan kasir. User harus login sebelum mengakses aplikasi.

#### Functional Requirement

1. User dapat login menggunakan email dan password.
2. User dapat logout.
3. Sistem menyimpan session/token menggunakan Laravel Sanctum.
4. User hanya bisa mengakses menu sesuai role.
5. Password disimpan dalam bentuk hash.
6. User nonaktif tidak bisa login.

#### Acceptance Criteria

1. User berhasil login jika email dan password benar.
2. User gagal login jika akun tidak ditemukan.
3. User gagal login jika password salah.
4. User gagal login jika akun berstatus nonaktif.
5. Setelah login, user diarahkan ke dashboard sesuai role.
6. Kasir diarahkan langsung ke halaman POS atau buka kasir.

### 9.2 Role dan Permission

#### Deskripsi

Sistem memiliki role dasar: owner, admin, dan kasir. Setiap role memiliki batasan akses.

#### Functional Requirement

1. Owner dapat membuat user baru.
2. Owner dapat mengubah role user.
3. Owner dapat menonaktifkan user.
4. Admin dapat melihat daftar user jika diberi akses.
5. Kasir tidak dapat mengakses menu user management.
6. Sistem membatasi endpoint API berdasarkan permission.

#### Acceptance Criteria

1. Kasir tidak bisa membuka halaman produk management.
2. Admin tidak bisa menghapus owner.
3. Owner bisa mengakses semua menu.
4. API mengembalikan response `403` jika user tidak memiliki akses.

### 9.3 Manajemen Outlet

#### Deskripsi

Outlet digunakan untuk membedakan lokasi toko atau cabang. Pada MVP, sistem minimal mendukung satu outlet, tetapi struktur database harus disiapkan untuk multi-outlet.

#### Functional Requirement

1. Owner dapat membuat outlet.
2. Owner dapat mengubah data outlet.
3. Outlet memiliki nama, alamat, nomor telepon, dan status.
4. Produk dan transaksi dapat dikaitkan dengan outlet.
5. User dapat ditugaskan ke outlet tertentu.

#### Acceptance Criteria

1. Setiap transaksi wajib memiliki outlet.
2. Kasir hanya bisa transaksi di outlet yang ditugaskan.
3. Owner bisa melihat data semua outlet.
4. Admin hanya bisa melihat outlet yang diberikan akses.

### 9.4 Manajemen Produk

#### Deskripsi

Produk adalah barang atau jasa yang dijual di POS.

#### Functional Requirement

1. Admin/owner dapat membuat produk baru.
2. Produk memiliki nama, SKU, barcode, kategori, harga jual, harga modal, stok, gambar, dan status.
3. Produk dapat memiliki varian sederhana.
4. Produk dapat dinonaktifkan.
5. Produk dapat dicari berdasarkan nama, SKU, atau barcode.
6. Produk dapat difilter berdasarkan kategori.
7. Produk yang nonaktif tidak muncul di halaman kasir.
8. Produk dapat diatur sebagai produk stok atau non-stok.

#### Acceptance Criteria

1. Produk baru berhasil disimpan jika data wajib lengkap.
2. SKU tidak boleh duplikat dalam outlet yang sama.
3. Produk aktif muncul di halaman POS.
4. Produk nonaktif tidak muncul di halaman POS.
5. Harga jual tidak boleh negatif.
6. Stok tidak boleh negatif kecuali sistem mengizinkan overselling.

### 9.5 Kategori Produk

#### Deskripsi

Kategori digunakan untuk mengelompokkan produk agar lebih mudah dicari di halaman kasir.

#### Functional Requirement

1. Admin/owner dapat membuat kategori.
2. Admin/owner dapat mengubah kategori.
3. Admin/owner dapat menonaktifkan kategori.
4. Produk dapat dikaitkan dengan satu kategori.
5. Kategori aktif tampil sebagai filter di POS.

#### Acceptance Criteria

1. Kategori berhasil dibuat jika nama kategori diisi.
2. Kategori nonaktif tidak tampil di filter POS.
3. Produk tetap tersimpan meskipun kategori dinonaktifkan.

### 9.6 Varian Produk Sederhana

#### Deskripsi

Varian digunakan untuk produk yang memiliki perbedaan ukuran, warna, rasa, atau tipe.

Contoh:

1. Kopi Susu - Small.
2. Kopi Susu - Medium.
3. Kopi Susu - Large.

#### Functional Requirement

1. Produk dapat memiliki beberapa varian.
2. Setiap varian memiliki SKU, barcode, harga jual, harga modal, dan stok sendiri.
3. Varian dapat diaktifkan atau dinonaktifkan.
4. Varian tampil di halaman POS saat produk dipilih.

#### Acceptance Criteria

1. Produk tanpa varian tetap bisa dijual.
2. Produk dengan varian harus memilih salah satu varian sebelum masuk keranjang.
3. Stok yang berkurang adalah stok varian yang dipilih.
4. SKU varian tidak boleh duplikat.

### 9.7 Halaman POS / Kasir

#### Deskripsi

Halaman POS adalah halaman utama yang digunakan kasir untuk melakukan transaksi.

#### Functional Requirement

1. Kasir dapat melihat daftar produk.
2. Kasir dapat mencari produk.
3. Kasir dapat filter produk berdasarkan kategori.
4. Kasir dapat menambahkan produk ke keranjang.
5. Kasir dapat mengubah quantity.
6. Kasir dapat menghapus item dari keranjang.
7. Kasir dapat menambahkan diskon transaksi.
8. Kasir dapat melihat subtotal, diskon, pajak, dan total.
9. Kasir dapat memilih metode pembayaran.
10. Kasir dapat menyelesaikan transaksi.
11. Sistem otomatis mengurangi stok setelah transaksi sukses.
12. Sistem membuat invoice/nomor transaksi otomatis.
13. Sistem dapat mencetak atau mengunduh struk.
14. Sistem dapat membuat link WhatsApp untuk mengirim struk ke pelanggan.

#### Acceptance Criteria

1. Produk berhasil masuk ke keranjang.
2. Quantity tidak boleh melebihi stok jika overselling dinonaktifkan.
3. Total transaksi dihitung otomatis.
4. Transaksi tidak bisa diproses jika keranjang kosong.
5. Transaksi tidak bisa diproses jika pembayaran kurang dari total.
6. Setelah transaksi sukses, stok produk berkurang.
7. Setelah transaksi sukses, data transaksi masuk ke laporan.

### 9.8 Diskon

#### Deskripsi

Diskon dapat diberikan pada transaksi secara nominal atau persentase.

#### Functional Requirement

1. Kasir dapat memberikan diskon nominal.
2. Kasir dapat memberikan diskon persentase.
3. Sistem menghitung total setelah diskon.
4. Owner dapat mengatur apakah kasir boleh memberikan diskon.
5. Diskon tidak boleh melebihi subtotal.

#### Acceptance Criteria

1. Diskon nominal mengurangi subtotal sesuai nilai.
2. Diskon persen mengurangi subtotal sesuai persentase.
3. Diskon lebih besar dari subtotal ditolak.
4. Diskon tercatat pada detail transaksi.

### 9.9 Pajak

#### Deskripsi

Pajak digunakan untuk menghitung tambahan biaya pada transaksi.

#### Functional Requirement

1. Owner dapat mengatur nama pajak.
2. Owner dapat mengatur persentase pajak.
3. Pajak dapat diaktifkan atau dinonaktifkan.
4. Sistem menghitung pajak otomatis setelah diskon.
5. Nilai pajak tercatat pada transaksi.

#### Acceptance Criteria

1. Jika pajak aktif, total transaksi ditambah pajak.
2. Jika pajak nonaktif, total transaksi tidak ditambah pajak.
3. Pajak muncul pada struk transaksi.

### 9.10 Metode Pembayaran

#### Deskripsi

Sistem mendukung beberapa metode pembayaran dasar.

#### Functional Requirement

1. Owner dapat membuat metode pembayaran.
2. Metode pembayaran default: cash, transfer, QRIS manual.
3. Kasir dapat memilih metode pembayaran saat checkout.
4. Sistem mendukung split payment sederhana.
5. Pembayaran cash dapat menghitung kembalian.
6. Pembayaran transfer dan QRIS manual dapat ditandai sebagai paid.

#### Acceptance Criteria

1. Transaksi cash menampilkan kembalian jika uang diterima lebih besar dari total.
2. Transaksi tidak bisa selesai jika pembayaran kurang dari total.
3. Split payment dapat menggunakan lebih dari satu metode.
4. Total pembayaran split harus sama atau lebih besar dari total transaksi.

### 9.11 Buka Kasir

#### Deskripsi

Buka kasir digunakan untuk memulai shift kasir dengan mencatat modal awal.

#### Functional Requirement

1. Kasir wajib membuka kasir sebelum transaksi.
2. Kasir menginput modal awal.
3. Sistem mencatat waktu buka kasir.
4. Satu kasir hanya boleh memiliki satu shift aktif.
5. Kasir tidak bisa transaksi jika belum buka kasir.

#### Acceptance Criteria

1. Kasir berhasil membuka shift dengan modal awal valid.
2. Kasir tidak bisa membuka shift baru jika masih ada shift aktif.
3. Halaman POS terkunci jika kasir belum membuka shift.

### 9.12 Tutup Kasir

#### Deskripsi

Tutup kasir digunakan untuk mengakhiri shift dan mencocokkan uang fisik dengan data sistem.

#### Functional Requirement

1. Kasir dapat menutup shift aktif.
2. Sistem menampilkan total transaksi selama shift.
3. Sistem menampilkan total pembayaran cash, transfer, dan QRIS.
4. Kasir menginput kas aktual.
5. Sistem menghitung selisih kas.
6. Sistem mencatat waktu tutup kasir.
7. Owner/admin dapat melihat riwayat shift.

#### Acceptance Criteria

1. Shift berhasil ditutup jika kas aktual diinput.
2. Setelah shift ditutup, kasir tidak bisa transaksi sampai membuka shift baru.
3. Selisih kas dihitung otomatis.
4. Riwayat shift dapat dilihat oleh owner/admin.

### 9.13 Struk Transaksi

#### Deskripsi

Struk digunakan sebagai bukti pembayaran untuk pelanggan.

#### Functional Requirement

1. Sistem menghasilkan struk setelah transaksi sukses.
2. Struk berisi nama outlet, alamat, nomor transaksi, tanggal, kasir, item, subtotal, diskon, pajak, total, pembayaran, dan kembalian.
3. Struk dapat dicetak melalui browser print.
4. Struk dapat diunduh sebagai PDF.
5. Sistem dapat membuat link WhatsApp berisi ringkasan transaksi.

#### Acceptance Criteria

1. Struk muncul setelah transaksi berhasil.
2. Data struk sesuai dengan data transaksi.
3. Struk dapat dicetak.
4. Link WhatsApp terbuka dengan format pesan yang benar.

### 9.14 Stok Otomatis dan Stock Movement

#### Deskripsi

Stok produk otomatis berkurang ketika transaksi berhasil. Semua perubahan stok dicatat dalam stock movement.

#### Functional Requirement

1. Stok berkurang saat transaksi sukses.
2. Sistem mencatat stock movement dengan tipe `sale`.
3. Stock movement menyimpan produk, outlet, quantity, tipe transaksi, referensi transaksi, dan user.
4. Admin/owner dapat melihat histori pergerakan stok.
5. Transaksi dibatalkan/refund harus mengembalikan stok jika fitur refund aktif.

#### Acceptance Criteria

1. Stok produk berkurang sesuai quantity terjual.
2. Stock movement tercatat setelah transaksi sukses.
3. Owner dapat melihat riwayat stok produk.
4. Stok tidak boleh negatif jika overselling tidak diizinkan.

### 9.15 Laporan Penjualan Harian

#### Deskripsi

Laporan penjualan membantu owner melihat performa usaha harian.

#### Functional Requirement

1. Owner/admin dapat melihat total penjualan harian.
2. Laporan dapat difilter berdasarkan tanggal.
3. Laporan dapat difilter berdasarkan outlet.
4. Laporan menampilkan total transaksi, omzet, diskon, pajak, refund, dan net sales.
5. Laporan menampilkan metode pembayaran.
6. Laporan menampilkan produk terlaris.
7. Laporan dapat diekspor ke Excel.

#### Acceptance Criteria

1. Data laporan sesuai dengan transaksi sukses.
2. Filter tanggal bekerja dengan benar.
3. Export Excel berhasil diunduh.
4. Kasir tidak dapat melihat laporan seluruh toko kecuali diberi akses.

\---

## 10\. User Stories

### Owner

* Sebagai owner, saya ingin melihat dashboard penjualan agar saya dapat mengetahui kondisi bisnis hari ini.
* Sebagai owner, saya ingin mengelola produk agar daftar produk yang dijual selalu update.
* Sebagai owner, saya ingin melihat laporan produk terlaris agar saya bisa menentukan stok dan strategi promo.
* Sebagai owner, saya ingin melihat performa kasir agar saya dapat memantau aktivitas transaksi di outlet.
* Sebagai owner, saya ingin mengatur role user agar setiap karyawan hanya mengakses fitur yang sesuai pekerjaannya.

### Admin

* Sebagai admin, saya ingin menambahkan produk baru agar produk tersebut bisa dijual oleh kasir.
* Sebagai admin, saya ingin melihat stok barang agar saya tahu produk mana yang hampir habis.
* Sebagai admin, saya ingin mengubah kategori produk agar tampilan kasir lebih rapi.
* Sebagai admin, saya ingin mengekspor laporan agar data bisa dikirim ke owner.

### Kasir

* Sebagai kasir, saya ingin membuka kasir dengan modal awal agar transaksi shift saya tercatat dengan jelas.
* Sebagai kasir, saya ingin mencari produk dengan cepat agar proses pembayaran pelanggan lebih efisien.
* Sebagai kasir, saya ingin memilih metode pembayaran agar transaksi sesuai dengan cara bayar pelanggan.
* Sebagai kasir, saya ingin mencetak struk agar pelanggan mendapat bukti pembayaran.
* Sebagai kasir, saya ingin menutup kasir agar total uang fisik dan sistem bisa dicocokkan.

\---

## 11\. Alur Utama Sistem

### 11.1 Alur Login

1. User membuka aplikasi.
2. User mengisi email dan password.
3. Frontend mengirim request login ke Laravel API.
4. Backend memvalidasi akun.
5. Backend mengembalikan token.
6. Frontend menyimpan token.
7. User diarahkan ke halaman sesuai role.

### 11.2 Alur Buka Kasir

1. Kasir login.
2. Sistem mengecek apakah kasir memiliki shift aktif.
3. Jika belum ada shift aktif, kasir diarahkan ke halaman buka kasir.
4. Kasir menginput modal awal.
5. Sistem membuat shift baru.
6. Kasir masuk ke halaman POS.

### 11.3 Alur Transaksi

1. Kasir memilih produk.
2. Produk masuk ke keranjang.
3. Kasir mengatur quantity.
4. Sistem menghitung subtotal.
5. Kasir menambahkan diskon jika ada.
6. Sistem menghitung pajak.
7. Sistem menghitung total.
8. Kasir memilih metode pembayaran.
9. Kasir menyelesaikan transaksi.
10. Sistem menyimpan transaksi.
11. Sistem mengurangi stok.
12. Sistem mencatat stock movement.
13. Sistem menampilkan struk.

### 11.4 Alur Tutup Kasir

1. Kasir membuka menu tutup kasir.
2. Sistem menampilkan ringkasan transaksi shift.
3. Kasir menginput kas aktual.
4. Sistem menghitung selisih kas.
5. Kasir submit tutup kasir.
6. Sistem mengubah status shift menjadi closed.
7. Owner/admin dapat melihat riwayat shift.

\---

## 12\. Rancangan Halaman Frontend

### 12.1 Login Page

Komponen:

1. Logo aplikasi.
2. Form email.
3. Form password.
4. Tombol login.
5. Pesan error login.
6. Loading state.

### 12.2 Dashboard Owner

Komponen:

1. Card total omzet hari ini.
2. Card jumlah transaksi.
3. Card produk terjual.
4. Card metode pembayaran dominan.
5. Grafik penjualan harian.
6. Tabel produk terlaris.
7. Tabel transaksi terbaru.
8. Filter tanggal dan outlet.

### 12.3 POS Page

Komponen:

1. Search produk.
2. Filter kategori.
3. Grid produk.
4. Keranjang transaksi.
5. Quantity controller.
6. Diskon.
7. Pajak.
8. Total pembayaran.
9. Pilihan metode pembayaran.
10. Input uang diterima.
11. Tombol bayar.
12. Tombol cetak struk.
13. Tombol kirim WhatsApp.

### 12.4 Product Management Page

Komponen:

1. Tabel produk.
2. Search produk.
3. Filter kategori.
4. Tombol tambah produk.
5. Form produk.
6. Upload gambar.
7. Input SKU/barcode.
8. Input harga jual.
9. Input harga modal.
10. Input stok.
11. Toggle status aktif/nonaktif.

### 12.5 Transaction Page

Komponen:

1. Tabel transaksi.
2. Filter tanggal.
3. Filter outlet.
4. Filter kasir.
5. Filter metode pembayaran.
6. Detail transaksi.
7. Tombol cetak ulang struk.
8. Tombol refund/void jika memiliki izin.

### 12.6 Shift Page

Komponen:

1. Form buka kasir.
2. Input modal awal.
3. Ringkasan shift aktif.
4. Form tutup kasir.
5. Input kas aktual.
6. Ringkasan selisih kas.
7. Tabel riwayat shift.

### 12.7 Report Page

Komponen:

1. Filter tanggal.
2. Filter outlet.
3. Card total omzet.
4. Card total transaksi.
5. Card total diskon.
6. Card total pajak.
7. Grafik penjualan.
8. Produk terlaris.
9. Metode pembayaran.
10. Tombol export Excel.

\---

## 13\. Rancangan Database Awal

### 13.1 Tabel `users`

Field utama:

1. `id`
2. `name`
3. `email`
4. `password`
5. `role\_id`
6. `outlet\_id`
7. `status`
8. `created\_at`
9. `updated\_at`

### 13.2 Tabel `roles`

Field utama:

1. `id`
2. `name`
3. `description`
4. `created\_at`
5. `updated\_at`

### 13.3 Tabel `outlets`

Field utama:

1. `id`
2. `name`
3. `address`
4. `phone`
5. `status`
6. `created\_at`
7. `updated\_at`

### 13.4 Tabel `categories`

Field utama:

1. `id`
2. `outlet\_id`
3. `name`
4. `description`
5. `status`
6. `created\_at`
7. `updated\_at`

### 13.5 Tabel `products`

Field utama:

1. `id`
2. `outlet\_id`
3. `category\_id`
4. `name`
5. `sku`
6. `barcode`
7. `description`
8. `image`
9. `cost\_price`
10. `selling\_price`
11. `stock`
12. `track\_stock`
13. `status`
14. `created\_at`
15. `updated\_at`

### 13.6 Tabel `product\_variants`

Field utama:

1. `id`
2. `product\_id`
3. `name`
4. `sku`
5. `barcode`
6. `cost\_price`
7. `selling\_price`
8. `stock`
9. `status`
10. `created\_at`
11. `updated\_at`

### 13.7 Tabel `cashier\_shifts`

Field utama:

1. `id`
2. `outlet\_id`
3. `user\_id`
4. `opening\_balance`
5. `closing\_balance`
6. `expected\_cash`
7. `cash\_difference`
8. `opened\_at`
9. `closed\_at`
10. `status`
11. `created\_at`
12. `updated\_at`

### 13.8 Tabel `transactions`

Field utama:

1. `id`
2. `outlet\_id`
3. `cashier\_shift\_id`
4. `user\_id`
5. `invoice\_number`
6. `customer\_name`
7. `subtotal`
8. `discount\_type`
9. `discount\_value`
10. `discount\_amount`
11. `tax\_rate`
12. `tax\_amount`
13. `total`
14. `paid\_amount`
15. `change\_amount`
16. `status`
17. `transaction\_date`
18. `created\_at`
19. `updated\_at`

### 13.9 Tabel `transaction\_items`

Field utama:

1. `id`
2. `transaction\_id`
3. `product\_id`
4. `product\_variant\_id`
5. `product\_name`
6. `sku`
7. `quantity`
8. `price`
9. `discount\_amount`
10. `subtotal`
11. `created\_at`
12. `updated\_at`

### 13.10 Tabel `payment\_methods`

Field utama:

1. `id`
2. `outlet\_id`
3. `name`
4. `type`
5. `status`
6. `created\_at`
7. `updated\_at`

### 13.11 Tabel `transaction\_payments`

Field utama:

1. `id`
2. `transaction\_id`
3. `payment\_method\_id`
4. `amount`
5. `reference\_number`
6. `created\_at`
7. `updated\_at`

### 13.12 Tabel `stock\_movements`

Field utama:

1. `id`
2. `outlet\_id`
3. `product\_id`
4. `product\_variant\_id`
5. `type`
6. `quantity`
7. `previous\_stock`
8. `current\_stock`
9. `reference\_type`
10. `reference\_id`
11. `note`
12. `user\_id`
13. `created\_at`
14. `updated\_at`

### 13.13 Tabel `taxes`

Field utama:

1. `id`
2. `outlet\_id`
3. `name`
4. `rate`
5. `status`
6. `created\_at`
7. `updated\_at`

\---

## 14\. API Endpoint MVP

### 14.1 Auth

```http
POST /api/login
POST /api/logout
GET  /api/me
```

### 14.2 User

```http
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
```

### 14.3 Outlet

```http
GET    /api/outlets
POST   /api/outlets
GET    /api/outlets/{id}
PUT    /api/outlets/{id}
DELETE /api/outlets/{id}
```

### 14.4 Category

```http
GET    /api/categories
POST   /api/categories
GET    /api/categories/{id}
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

### 14.5 Product

```http
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/products/search
```

### 14.6 POS Transaction

```http
POST /api/transactions
GET  /api/transactions
GET  /api/transactions/{id}
POST /api/transactions/{id}/void
POST /api/transactions/{id}/refund
```

### 14.7 Shift

```http
POST /api/shifts/open
POST /api/shifts/close
GET  /api/shifts/active
GET  /api/shifts
GET  /api/shifts/{id}
```

### 14.8 Report

```http
GET /api/reports/sales-daily
GET /api/reports/best-selling-products
GET /api/reports/payment-methods
GET /api/reports/stock
GET /api/reports/export-sales
```

### 14.9 Stock Movement

```http
GET /api/stock-movements
GET /api/products/{id}/stock-movements
```

\---

## 15\. Business Rules

1. User harus login untuk mengakses aplikasi.
2. Kasir wajib membuka kasir sebelum melakukan transaksi.
3. Satu kasir hanya boleh memiliki satu shift aktif dalam satu waktu.
4. Produk nonaktif tidak boleh dijual.
5. Produk dengan stok kosong tidak boleh dijual jika overselling nonaktif.
6. SKU produk tidak boleh duplikat.
7. Nomor invoice harus unik.
8. Transaksi sukses otomatis mengurangi stok.
9. Semua perubahan stok harus tercatat di stock movement.
10. Pembayaran tidak boleh kurang dari total transaksi.
11. Diskon tidak boleh lebih besar dari subtotal.
12. Kasir tidak boleh void/refund tanpa izin jika fitur otorisasi aktif.
13. Owner dapat melihat semua data outlet.
14. Admin hanya dapat melihat outlet yang diberikan akses.
15. Kasir hanya dapat melihat transaksi miliknya sendiri atau transaksi pada shift aktifnya.
16. Data transaksi tidak boleh dihapus permanen, hanya boleh dibatalkan dengan status void.
17. Export laporan hanya dapat dilakukan oleh owner/admin.
18. Tutup kasir harus menyimpan kas aktual dan selisih kas.
19. Stok tidak boleh berubah tanpa pencatatan movement.
20. Semua aktivitas penting harus dapat diaudit pada versi lanjutan.

\---

## 16\. Non-Functional Requirements

### 16.1 Performance

1. Halaman POS harus dapat memuat daftar produk dengan cepat.
2. Pencarian produk maksimal terasa responsif di bawah 1 detik untuk data kecil sampai menengah.
3. Checkout transaksi tidak boleh lambat karena digunakan saat antrean pelanggan.
4. API laporan boleh menggunakan pagination dan filter tanggal untuk menghindari beban berat.

### 16.2 Security

1. Password wajib di-hash.
2. API wajib menggunakan authentication token.
3. Endpoint harus dilindungi middleware role/permission.
4. Validasi input wajib dilakukan di frontend dan backend.
5. Data transaksi tidak boleh dihapus langsung dari database.
6. File upload gambar produk harus divalidasi tipe dan ukuran filenya.
7. CORS harus dikonfigurasi dengan benar.
8. Rate limiting diterapkan pada endpoint login.

### 16.3 Reliability

1. Transaksi penjualan harus menggunakan database transaction.
2. Pengurangan stok dan penyimpanan transaksi harus atomic.
3. Jika transaksi gagal, stok tidak boleh berkurang.
4. Jika stok gagal diperbarui, transaksi tidak boleh sukses.
5. Nomor invoice harus tetap unik meskipun ada banyak transaksi bersamaan.

### 16.4 Usability

1. UI harus sederhana dan mudah dipahami kasir.
2. Tombol checkout harus jelas.
3. Total pembayaran harus terlihat besar.
4. Produk harus mudah dicari.
5. Halaman POS harus nyaman digunakan di tablet.
6. Error message harus jelas, bukan sekadar “something went wrong”.

### 16.5 Scalability

1. Struktur database harus siap untuk multi-outlet.
2. Produk, transaksi, dan laporan harus mendukung pagination.
3. Sistem role dibuat fleksibel agar bisa dikembangkan.
4. API dibuat modular berdasarkan domain fitur.

\---

## 17\. Error Handling

Contoh error handling:

1. Login gagal: `Email atau password salah.`
2. Akun nonaktif: `Akun Anda tidak aktif. Hubungi owner.`
3. Stok tidak cukup: `Stok produk tidak mencukupi.`
4. Keranjang kosong: `Tambahkan produk terlebih dahulu.`
5. Pembayaran kurang: `Nominal pembayaran belum mencukupi.`
6. Diskon tidak valid: `Diskon tidak boleh melebihi subtotal.`
7. Shift belum dibuka: `Silakan buka kasir terlebih dahulu.`
8. Tidak punya akses: `Anda tidak memiliki akses ke fitur ini.`
9. Server error: `Terjadi kesalahan sistem. Silakan coba lagi.`

\---

## 18\. Format Nomor Invoice

Format invoice disarankan:

```text
INV-{OUTLET\_CODE}-{YYYYMMDD}-{RUNNING\_NUMBER}
```

Contoh:

```text
INV-CKP-20260609-0001
```

Keterangan:

1. `INV` adalah prefix invoice.
2. `CKP` adalah kode outlet.
3. `20260609` adalah tanggal transaksi.
4. `0001` adalah nomor urut harian.

\---

## 19\. Format Struk

Struk minimal berisi:

```text
Nama Outlet
Alamat Outlet
No. Telepon Outlet

No Invoice: INV-CKP-20260609-0001
Tanggal: 09/06/2026 19:30
Kasir: Royyan

--------------------------------
Produk              Qty   Total
Kopi Susu           2     30.000
Roti Bakar          1     15.000
--------------------------------
Subtotal                  45.000
Diskon                     5.000
Pajak 10%                  4.000
--------------------------------
Total                     44.000
Cash                      50.000
Kembali                    6.000

Terima kasih telah berbelanja.
```

\---

## 20\. Roadmap Pengembangan

### Phase 1 — MVP POS Core

Target utama: aplikasi kasir sudah bisa dipakai untuk transaksi harian.

Fitur:

1. Login user.
2. Role owner, admin, kasir.
3. Outlet/store.
4. Produk dan kategori.
5. Varian produk sederhana.
6. Barcode/SKU.
7. Transaksi kasir.
8. Diskon.
9. Pajak.
10. Metode pembayaran cash, transfer, QRIS manual.
11. Split payment sederhana.
12. Cetak/download struk.
13. Digital receipt via WhatsApp link.
14. Buka kasir.
15. Tutup kasir.
16. Laporan penjualan harian.
17. Stok otomatis berkurang.
18. Stock movement basic.
19. Export Excel.

### Phase 2 — Inventory dan Operasional

Target utama: sistem mulai kuat untuk operasional toko.

Fitur:

1. Supplier.
2. Purchase order.
3. Stok masuk.
4. Stok opname.
5. Stok terbuang/rusak.
6. Mutasi stok antar outlet.
7. Minimum stock alert.
8. HPP/COGS.
9. Return/refund.
10. Void dengan PIN manager.
11. Park/hold order.
12. Split bill.
13. Customer database.
14. Promo dan voucher.
15. Membership/poin.

### Phase 3 — F\&B dan Retail Advanced

Target utama: sistem cocok untuk restoran, cafe, dan retail multi-cabang.

Fitur:

1. Mode meja.
2. Layout meja.
3. Pindah meja.
4. Gabung meja.
5. Pisah item.
6. Kitchen display.
7. Order display.
8. Label sticker.
9. E-menu QR.
10. Self order.
11. Multi outlet.
12. Multi warehouse.
13. Batch/serial number.
14. Expired date.
15. Resep dan bahan baku.

### Phase 4 — SaaS Advanced

Target utama: sistem menjadi platform SaaS POS yang lebih matang.

Fitur:

1. Owner mobile dashboard.
2. Akuntansi basic.
3. Invoice, piutang, hutang.
4. Payroll dan absensi.
5. Omnichannel marketplace.
6. WhatsApp API resmi.
7. Payment gateway QRIS dinamis.
8. EDC integration.
9. Public API.
10. Webhook.
11. Geo fencing.
12. IP restriction.
13. TOTP/2FA.
14. Email report otomatis.
15. AI product description.

\---

## 21\. Success Metrics

Keberhasilan MVP dapat diukur dengan:

1. Kasir dapat menyelesaikan transaksi tanpa error.
2. Produk dan stok dapat dikelola dengan baik.
3. Stok otomatis berkurang setelah transaksi.
4. Laporan penjualan harian akurat.
5. Owner dapat melihat ringkasan bisnis dari dashboard.
6. Tutup kasir dapat menghitung selisih kas.
7. Struk dapat dicetak atau dikirim.
8. Sistem dapat digunakan minimal oleh 1 outlet aktif.
9. Export laporan berjalan dengan benar.
10. Tidak ada data transaksi yang hilang setelah checkout.

\---

## 22\. Prioritas Development

Urutan pengerjaan yang disarankan:

1. Setup backend Laravel + PostgreSQL.
2. Setup frontend React + Tailwind + shadcn/ui.
3. Authentication dan role.
4. Outlet.
5. Produk dan kategori.
6. POS page.
7. Transaksi.
8. Stock movement.
9. Shift buka/tutup kasir.
10. Struk.
11. Laporan harian.
12. Export Excel.
13. Testing end-to-end transaksi.
14. UI polishing.
15. Deployment MVP.

\---

## 23\. Risiko Produk

### Risiko 1: Scope terlalu besar

Solusi: fokus ke MVP terlebih dahulu. Fitur seperti akuntansi, marketplace, dan payroll tidak masuk tahap awal.

### Risiko 2: Transaksi dan stok tidak sinkron

Solusi: gunakan database transaction di Laravel ketika menyimpan transaksi dan mengurangi stok.

### Risiko 3: UI kasir terlalu rumit

Solusi: halaman POS harus dibuat sederhana, cepat, dan minim klik.

### Risiko 4: Laporan berat ketika data transaksi besar

Solusi: gunakan filter tanggal, pagination, indexing database, dan query optimization.

### Risiko 5: Multi-outlet membuat logic lebih kompleks

Solusi: dari awal semua data penting diberi `outlet\_id` agar siap dikembangkan.

\---

## 24\. Kesimpulan

Produk POS ini akan dibangun sebagai aplikasi kasir berbasis web dengan arsitektur modular. Versi MVP difokuskan pada kebutuhan paling penting: transaksi kasir, produk, stok, role user, buka/tutup kasir, struk, dan laporan penjualan.

Dengan stack React, shadcn/ui, Tailwind CSS, Laravel, dan PostgreSQL, sistem ini memiliki pondasi yang kuat untuk dikembangkan menjadi SaaS POS modern untuk UMKM Indonesia. Strategi terbaik adalah membangun MVP yang stabil terlebih dahulu, lalu menambahkan fitur inventory advanced, CRM, F\&B, omnichannel, payment gateway, dan akuntansi secara bertahap.

