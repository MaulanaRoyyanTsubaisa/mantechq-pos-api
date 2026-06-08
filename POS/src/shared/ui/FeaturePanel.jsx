import React from 'react'

export function FeaturePanel({ title, text, children }) {
  return (
    <div className="feature-panel">
      {title ? <strong>{title}</strong> : null}
      <p>{text}</p>
      {children ? <div className="feature-content">{children}</div> : null}
    </div>
  )
}
