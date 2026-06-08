import React from 'react'
import { ChevronDown } from 'lucide-react'

export function SelectButton({ label, onClick }) {
  return (
    <button className="select-button" onClick={onClick || (() => {})}>
      <span>{label}</span>
      <ChevronDown size={15} />
    </button>
  )
}
