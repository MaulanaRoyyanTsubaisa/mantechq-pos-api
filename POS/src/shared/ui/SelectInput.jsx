import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn.js'

export function SelectInput({ placeholder, value, options = [], onChange, onClick }) {
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
