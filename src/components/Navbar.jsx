import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, role, signOut } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/', label: 'Beranda' },
    { to: '/konselor', label: 'Konselor' },
    { to: '/napas', label: 'Tenang' },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ]

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      isActive ? 'bg-primary-soft text-primary' : 'text-ink/70 hover:text-ink'
    }`

  const bolehBuatJanji = !user || role === 'mahasiswa'
  const namaTampil = profile?.nama || user?.email?.split('@')[0]

  async function keluar() {
    setOpen(false)
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-cream/80 border-b border-ink/5">
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="w-8 h-8 rounded-xl bg-primary text-white grid place-items-center">
            <Heart size={16} fill="currentColor" />
          </span>
          KindSpace
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold max-w-[8rem] truncate">{namaTampil}</p>
                <p className="text-xs text-ink/50 capitalize">{role}</p>
              </div>
              <button
                onClick={keluar}
                title="Keluar"
                aria-label="Keluar"
                className="w-10 h-10 grid place-items-center rounded-full bg-white border border-ink/10 hover:border-primary hover:text-primary transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/masuk"
              className="hidden sm:inline-block text-sm font-semibold px-5 py-2.5 rounded-full border border-ink/10 bg-white hover:border-primary transition"
            >
              Masuk
            </Link>
          )}

          {bolehBuatJanji && (
            <Link
              to="/booking"
              className="hidden sm:inline-block bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary transition"
            >
              Buat Janji
            </Link>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          {bolehBuatJanji && (
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 bg-ink text-white text-center text-sm font-semibold px-5 py-3 rounded-full"
            >
              Buat Janji
            </Link>
          )}
          {user ? (
            <button
              onClick={keluar}
              className="mt-1 text-center text-sm font-semibold px-5 py-3 rounded-full border border-ink/10 bg-white"
            >
              Keluar ({namaTampil})
            </button>
          ) : (
            <Link
              to="/masuk"
              onClick={() => setOpen(false)}
              className="mt-1 text-center text-sm font-semibold px-5 py-3 rounded-full border border-ink/10 bg-white"
            >
              Masuk
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
