const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const SESSION_KEY = "mantechq_pos_session";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(payload?.error || "Request API gagal.");
    error.code = payload?.code;
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function getStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export async function signInWithEmail(email) {
  const session = await apiRequest("/auth/session", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  storeSession(session);
  return session;
}

export function getPosData(userId) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return apiRequest(`/pos-data${query}`);
}

export function createProduct(product) {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function createSale(sale) {
  return apiRequest("/sales", {
    method: "POST",
    body: JSON.stringify(sale),
  });
}
