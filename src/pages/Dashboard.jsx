import { useAuth } from '../context/AuthContext'
import DashAdmin from './DashAdmin'
import DashKonselor from './DashKonselor'
import DashMahasiswa from './DashMahasiswa'

// Satu alamat /dashboard, tampilannya mengikuti role akun yang login.
export default function Dashboard() {
  const { role } = useAuth()
  if (role === 'admin') return <DashAdmin />
  if (role === 'konselor') return <DashKonselor />
  return <DashMahasiswa />
}
