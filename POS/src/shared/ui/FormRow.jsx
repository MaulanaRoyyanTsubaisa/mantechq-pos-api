import React from 'react'
import { cn } from '../lib/cn.js'

export function FormRow({ label, children, refNode, guideKey, currentKey, hint, wide, error }) {
  return (
    <div ref={refNode} className={cn('form-row', wide && 'wide', error && 'has-error', guideKey === currentKey && 'guided-target')}>
      <label>
        {label}
        {hint ? <small>{hint}</small> : null}
      </label>
      <div className="form-control">
        {children}
        {error ? <p className="field-error">{error}</p> : null}
      </div>
    </div>
  )
}
