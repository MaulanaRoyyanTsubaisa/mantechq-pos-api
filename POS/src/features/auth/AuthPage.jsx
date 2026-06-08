import React, { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { Button } from '../../shared/ui/Button.jsx'
import { Brand } from '../../shared/ui/Brand.jsx'
import { signInWithEmail } from '../../shared/api/posApi.js'

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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


export { AuthPage, NoMembershipPage, DataErrorPage, LoadingApp }
