import React from 'react'
import { cn } from '../lib/cn.js'

export function Toggle({ checked }) {
  return <span className={cn('toggle', checked && 'on')}>{checked ? 'ON' : 'OFF'}</span>
}
