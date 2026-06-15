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
  
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/upload`, {
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

// Suppliers
export function getSuppliers(orgId) {
  return apiRequest(`/suppliers?orgId=${encodeURIComponent(orgId)}`)
}
export function createSupplier(payload) {
  return apiRequest('/suppliers', { method: 'POST', body: JSON.stringify(payload) })
}

// Purchase Orders
export function getPurchaseOrders(orgId, outletId) {
  const query = new URLSearchParams({ orgId, outletId: outletId || '' }).toString()
  return apiRequest(`/purchase-orders?${query}`)
}
export function createPurchaseOrder(payload) {
  return apiRequest('/purchase-orders', { method: 'POST', body: JSON.stringify(payload) })
}

// Customers
export function getCustomers(orgId) {
  return apiRequest(`/customers?orgId=${encodeURIComponent(orgId)}`)
}
export function createCustomer(customer) {
  return apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  })
}

// Stock Opname
export function getStockOpnames(orgId, outletId) {
  const query = new URLSearchParams({ orgId, outletId: outletId || '' }).toString()
  return apiRequest(`/stock-opname?${query}`)
}
export function createStockOpname(payload) {
  return apiRequest('/stock-opname', { method: 'POST', body: JSON.stringify(payload) })
}

// Note Categories
export function createNoteCategory(payload) {
  return apiRequest('/note-categories', { method: 'POST', body: JSON.stringify(payload) })
}
export function updateNoteCategory(id, payload) {
  return apiRequest(`/note-categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export function deleteNoteCategory(id) {
  return apiRequest(`/note-categories/${id}`, { method: 'DELETE' })
}

// Recipes
export function savePosRecipeBatch(payload) {
  return apiRequest('/pos-recipes/batch', { method: 'POST', body: JSON.stringify(payload) })
}

export function deletePosRecipeBatch(recipeName, productId) {
  return apiRequest(`/pos-recipes/batch?recipeName=${encodeURIComponent(recipeName)}&productId=${encodeURIComponent(productId)}`, { method: 'DELETE' })
}
