import React from 'react'
import { cn } from '../lib/cn.js'

export function Button({ className, variant = 'default', ...props }) {
  return <button className={cn('btn', `btn-${variant}`, className)} {...props} />
}
