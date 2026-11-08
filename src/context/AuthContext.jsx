import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const uidRef = useRef(null)

  const muatProfil = useCallback(async (user) => {
    if (!user) {
      uidRef.current = null
      setProfile(null)
      setLoading(false)
      return
    }
    // Sisa sesi anonim dari versi lama dibersihkan
    if (user.is_anonymous) {
      await supabase.auth.signOut()
      return
    }
    if (uidRef.current === user.id) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('nama, role')
      .eq('id', user.id)
      .maybeSingle()
    uidRef.current = user.id
    setProfile(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      muatProfil(data.session?.user)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      // Jangan await query Supabase langsung di dalam callback ini
      setTimeout(() => muatProfil(s?.user), 0)
    })
    return () => sub.subscription.unsubscribe()
  }, [muatProfil])

  const user = session?.user && !session.user.is_anonymous ? session.user : null

  const value = {
    user,
    profile,
    role: profile?.role ?? null,
    loading,
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
