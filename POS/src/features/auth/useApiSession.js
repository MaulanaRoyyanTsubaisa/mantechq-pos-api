import { useState } from 'react'
import { toast } from 'sonner'
import { clearStoredSession, getStoredSession } from '../../shared/api/sessionStorage.js'

function useApiSession() {
  const [session, setSessionState] = useState(() => getStoredSession())
  const [loading, setLoading] = useState(false)

  const setSession = (nextSession) => {
    setSessionState(nextSession)
  }

  const signOut = () => {
    clearStoredSession()
    setSessionState(null)
    toast.success('Berhasil keluar')
  }

  return { session, loading, setSession, signOut }
}


export { useApiSession }
