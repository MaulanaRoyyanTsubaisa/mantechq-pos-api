import React from 'react'
import { CircleDollarSign } from 'lucide-react'

export function Brand() {
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
