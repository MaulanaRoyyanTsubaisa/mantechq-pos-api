// Placeholder for WhatsApp API integration
// Env variables will be loaded here later (e.g., VITE_WA_API_URL, VITE_WA_API_KEY)

export const WA_API_URL = import.meta.env.VITE_WA_API_URL || ''
export const WA_API_KEY = import.meta.env.VITE_WA_API_KEY || ''

export async function sendWhatsAppMessage(phone, message) {
  if (!WA_API_URL || !WA_API_KEY) {
    console.warn('WA API not configured. Falling back to wa.me link.')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
    return { success: true, method: 'fallback' }
  }

  // TODO: Implement actual external WA API POST request
  try {
    const response = await fetch(`${WA_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WA_API_KEY}`
      },
      body: JSON.stringify({ phone, message })
    })
    
    if (!response.ok) throw new Error('Gagal mengirim pesan WA')
    return { success: true, method: 'api' }
  } catch (error) {
    console.error('WA API Error:', error)
    throw error
  }
}
