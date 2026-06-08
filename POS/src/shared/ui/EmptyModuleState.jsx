import React from 'react'
import { ClipboardList } from 'lucide-react'

export function EmptyModuleState() {
  return (
    <div className="module-empty">
      <div>
        <ClipboardList size={42} />
        <strong>Data tidak tersedia</strong>
        <p>Belum ada data yang dapat ditampilkan di halaman ini</p>
      </div>
    </div>
  )
}
