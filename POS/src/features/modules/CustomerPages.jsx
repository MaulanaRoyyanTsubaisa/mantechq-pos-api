import React, { useState } from 'react'
import { Plus, Search, Users, Download } from 'lucide-react'
import { Button } from '../../shared/ui/Button.jsx'
import { CustomerFormModal } from './CustomerFormModal.jsx'
import { toast } from 'sonner'
import { downloadCSV } from './moduleBlueprints.js'

export function DaftarPelangganPage({ posData, onRefresh }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [query, setQuery] = useState('')

  const customers = posData?.customers || []
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    (c.phone && c.phone.includes(query))
  )

  const handleExport = () => {
    if (customers.length === 0) return toast.error('Tidak ada data untuk diekspor')
    const rows = customers.map(c => [c.name, c.phone || '-', c.email || '-', c.points || 0, new Date(c.created_at).toLocaleDateString()])
    downloadCSV('Daftar Pelanggan', ['Nama Pelanggan', 'No. Telepon', 'Email', 'Poin', 'Tgl Daftar'], rows)
    toast.success('Berhasil mengekspor Daftar Pelanggan')
  }

  const columns = ['Nama Pelanggan', 'No. Telepon', 'Email', 'Poin Reward', 'Tgl Daftar']

  return (
    <main className="content">
      <section className="panel module-page">
        <div className="majoo-page-head">
          <div className="majoo-title">
            <h1>Daftar Pelanggan</h1>
            <p>Kelola data pelanggan untuk ManTechQ PoS.</p>
            <p>{customers.length} Pelanggan</p>
          </div>
          <div className="majoo-actions">
            <Button variant="outline" onClick={handleExport}>
              <Download size={16} />
              Ekspor
            </Button>
            <Button variant="default" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              Tambah Pelanggan
            </Button>
          </div>
        </div>

        <div className="module-context">
          <span className="module-icon">
            <Users size={20} />
          </span>
          <div>
            <strong>Pelanggan</strong>
            <p>Kelola basis data pelanggan dan poin loyalitas mereka.</p>
          </div>
        </div>

        <div className="majoo-filterbar">
          <label>
            <Search size={17} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama atau no telepon..." />
          </label>
        </div>

        <div className="module-table">
          <div className="module-table-head" style={{ gridTemplateColumns: `44px repeat(5, minmax(130px, 1fr))` }}>
            <span className="check-col">
              <input type="checkbox" aria-label="Toggle All Current Page Rows Selected" />
            </span>
            {columns.map(col => <span key={col}>{col}</span>)}
          </div>
          {filteredCustomers.length > 0 ? (
            <div className="module-table-body">
              {filteredCustomers.map((row, rowIndex) => (
                <div className="module-table-row" style={{ gridTemplateColumns: `44px repeat(5, minmax(130px, 1fr))` }} key={row.id}>
                  <span className="check-col">
                    <input type="checkbox" aria-label={`Pilih baris ${rowIndex + 1}`} />
                  </span>
                  <span>{row.name}</span>
                  <span>{row.phone || '-'}</span>
                  <span>{row.email || '-'}</span>
                  <span>{row.points || '0'} Pts</span>
                  <span>{new Date(row.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="module-empty">
              <div>
                <Users size={42} />
                <strong>Tidak ada pelanggan ditemukan</strong>
                <p>Belum ada data pelanggan yang sesuai dengan pencarian.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {showAddModal && (
        <CustomerFormModal 
          posData={posData} 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false)
            if (onRefresh) onRefresh()
          }} 
        />
      )}
    </main>
  )
}
