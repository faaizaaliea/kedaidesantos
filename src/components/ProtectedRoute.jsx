import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [sesi, setSesi] = useState(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesi(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSesi(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (sesi === undefined) return <p className="p-6">Memuat…</p>
  return sesi ? children : <Navigate to="/admin/login" replace />
}
