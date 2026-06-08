import React from 'react'
import { toast } from 'sonner'
import { Button } from '../../shared/ui/Button.jsx'

function TrialBar() {
  return (
    <div className="trial-bar">
      <span>Masa Aktif akun trial tersisa 14 hari Segera beli langganan sebelum masa trial berakhir untuk mendapatkan diskon berlangganan hingga 35%</span>
      <Button variant="danger" onClick={() => toast.success('Paket perpanjangan dibuka')}>
        Perpanjang
      </Button>
    </div>
  )
}

export { TrialBar }
