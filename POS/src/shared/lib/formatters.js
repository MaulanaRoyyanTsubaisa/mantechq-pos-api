export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export function formatQty(value) {
  return Number(value || 0).toLocaleString('id-ID')
}

export function shortId(value) {
  return value ? String(value).slice(0, 8) : '-'
}

export function membershipOutletLabel(membership) {
  return `Outlet ${shortId(membership?.outlet_id || membership?.org_id)}`
}

export function parseCurrencyInput(value) {
  const normalized = String(value || '').replace(/[^\d]/g, '')
  return Number(normalized || 0)
}

export function formatCurrencyInput(value) {
  const num = parseCurrencyInput(value)
  if (!num) return ''
  return new Intl.NumberFormat('id-ID').format(num)
}

export function parseQuantityInput(value) {
  const normalized = String(value || '').replace(',', '.').replace(/[^\d.]/g, '')
  const parsed = Number(normalized || 0)
  return Number.isFinite(parsed) ? parsed : 0
}
