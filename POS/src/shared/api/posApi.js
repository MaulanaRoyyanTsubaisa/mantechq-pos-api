import { apiRequest } from './client.js'
import { storeSession } from './sessionStorage.js'

export async function signInWithEmail(email) {
  const session = await apiRequest('/auth/session', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  storeSession(session)
  return session
}

export function getPosData(userId) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : ''
  return apiRequest(`/pos-data${query}`)
}

export function createProduct(product) {
  return apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

export function updateProduct(id, product) {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

export function deleteProduct(id, orgId) {
  return apiRequest(`/products/${id}?orgId=${encodeURIComponent(orgId)}`, {
    method: 'DELETE',
  })
}

export async function uploadProductPhoto(file) {
  const formData = new FormData()
  formData.append('photo', file)
  
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  })
  if (!res.ok) {
    throw new Error('Upload failed')
  }
  return res.json()
}


export function createSale(sale) {
  return apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify(sale),
  })
}

export function createCustomer(customer) {
  return apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  })
}
export function getShift(orgId, outletId, userId) {
  const query = new URLSearchParams({ orgId, outletId, userId }).toString()
  return apiRequest(`/shifts/current?${query}`)
}

export function updateShift(payload) {
  return apiRequest('/shifts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
