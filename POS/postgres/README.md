# PostgreSQL Local Setup

POS sekarang diarahkan ke PostgreSQL lokal melalui backend API. Folder ini menyimpan schema dan seed database untuk development.

## Status Lokal

Di mesin ini PostgreSQL service sudah terdeteksi:

```powershell
postgresql-x64-18
```

`psql.exe` ada di:

```powershell
C:\Program Files\PostgreSQL\18\bin\psql.exe
```

## Setup Otomatis

Jalankan dari root repo:

```powershell
.\scripts\setup-postgres-local.ps1
```

Default yang dibuat:

```text
database: mantechq_pos
user: pos_dev
password: pos_dev_123
host: localhost
port: 5432
```

Script akan meminta password superuser PostgreSQL `postgres`, lalu:

- membuat role `pos_dev`
- membuat database `mantechq_pos`
- apply schema `postgres/migrations/001_initial_pos_core.sql`
- insert seed `postgres/seeds/001_dev_dummy_data.sql`
- grant privilege untuk `pos_dev`

## Test Manual

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_isready.exe" -h localhost -p 5432
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U pos_dev -d mantechq_pos -c "select count(*) from st_mast;"
```

## DATABASE_URL Backend

```text
DATABASE_URL=postgresql://pos_dev:pos_dev_123@localhost:5432/mantechq_pos
```

Jangan taruh `DATABASE_URL` di frontend Vite. React/browser harus akses database lewat backend API.

## Catatan Migrasi

- Tidak memakai `auth.uid()`.
- Tidak memakai `auth.users`.
- User lokal disimpan di `app_users`.
- Authorization nanti ditangani backend API.
- Function `create_sales_transaction` menerima optional `p_user_id`.
