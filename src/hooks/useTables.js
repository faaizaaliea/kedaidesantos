import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function useTables() {
  const [meja, setMeja] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    supabase.from('tables').select('nomor').order('nomor').then(({ data, error }) => {
      setMeja(data || []); setError(error); setLoading(false)
    })
  }, [])
  return { meja, loading, error }
}
