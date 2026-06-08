import React from 'react'
import { X } from 'lucide-react'
import { Button } from '../../shared/ui/Button.jsx'

function TourSpotlight({ rect }) {
  if (!rect) return <div className="tour-dim plain" />
  return (
    <>
      <div className="tour-dim top" style={{ height: rect.top }} />
      <div className="tour-dim left" style={{ top: rect.top, width: rect.left, height: rect.height }} />
      <div className="tour-dim right" style={{ top: rect.top, left: rect.left + rect.width, height: rect.height }} />
      <div className="tour-dim bottom" style={{ top: rect.top + rect.height }} />
      <div className="tour-ring" style={rect} />
    </>
  )
}

function GuideBubble({ step, rect, onSkip, onNext }) {
  const top = rect ? Math.min(window.innerHeight - 190, Math.max(86, rect.top + rect.height / 2 - 78)) : 180
  const left = rect ? Math.max(18, Math.min(window.innerWidth - 330, rect.left - 330)) : 240
  return (
    <div className="guide-bubble" style={{ top, left }}>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
      <div className="guide-actions">
        <button onClick={onSkip}>Lewati</button>
        <button onClick={onNext}>Lanjut <span>({step.count})</span></button>
      </div>
    </div>
  )
}

function GuideDone({ onRepeat, onClose }) {
  return (
    <div className="guide-done">
      <button className="guide-done-close" onClick={onClose} aria-label="Tutup panduan">
        <X size={20} />
      </button>
      <h3>Panduan Selesai!</h3>
      <p>Anda telah menyelesaikan panduan pembuatan produk. Sudah siap untuk menambahkan produk anda sendiri?</p>
      <div>
        <button onClick={onRepeat}>Ulangi Panduan</button>
        <Button onClick={onClose}>Oke</Button>
      </div>
    </div>
  )
}


export { TourSpotlight, GuideBubble, GuideDone }
