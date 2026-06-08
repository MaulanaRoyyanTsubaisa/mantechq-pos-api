const SESSION_KEY = 'mantechq_pos_session'

export function getStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY)
}
