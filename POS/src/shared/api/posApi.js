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
