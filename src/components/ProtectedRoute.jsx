import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// roles: daftar role yang boleh masuk. Kosongkan kalau semua yang sudah login boleh.
export default function ProtectedRoute({ roles, children }) {
  const { user, role, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return <p className="text-center py-24 text-ink/50">Memuat...</p>
  }
  if (!user) {
    return <Navigate to="/masuk" state={{ dari: loc.pathname + loc.search }} replace />
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
