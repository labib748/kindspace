import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const tabs = [
  {
    id: 'mahasiswa',
    label: 'Mahasiswa',
    judul: 'Halo, senang ketemu lagi',
    sub: 'Masuk untuk membuat janji, mengecek jadwal, dan menyimpan check-in suasana hatimu.',
  },
  {
    id: 'konselor',
    label: 'Konselor',
    judul: 'Siap mendengarkan hari ini?',
    sub: 'Masuk untuk melihat dan mengelola janji yang masuk ke kamu.',
  },
  {
    id: 'admin',
    label: 'Admin',
    judul: 'Ruang kendali KindSpace',
    sub: 'Masuk untuk mengelola konselor, janji, dan akun.',
  },
]

const field =
  'w-full bg-white border border-ink/10 rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition'

function terjemah(msg = '') {
  if (msg.includes('Invalid login credentials')) return 'Email atau password salah.'
  if (msg.includes('Email not confirmed')) return 'Email belum dikonfirmasi. Cek inbox kamu.'
  return 'Belum bisa masuk: ' + msg
}

export default function Login() {
  const navigate = useNavigate()
  const loc = useLocation()
  const dari = loc.state?.dari

  const [tab, setTab] = useState('mahasiswa')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [lihat, setLihat] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const aktif = tabs.find((t) => t.id === tab)

  async function masuk(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Isi email dan password dulu ya.')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) {
      setLoading(false)
      setError(terjemah(error.message))
      return
    }

    // Pastikan role akun cocok dengan tab yang dipilih
    const { data: p } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    if (p?.role !== tab) {
      await supabase.auth.signOut()
      setLoading(false)
      setError(`Akun ini bukan akun ${tab}. Coba pilih tab yang sesuai.`)
      return
    }

    setLoading(false)
    navigate(dari ?? '/dashboard', { replace: true })
  }

  return (
    <section className="max-w-md mx-auto px-5 py-14">
      {/* pilihan peran */}
      <div role="tablist" className="grid grid-cols-3 gap-1 bg-primary-soft rounded-full p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id)
              setError('')
            }}
            className={`py-2.5 rounded-full text-sm font-semibold transition ${
              tab === t.id ? 'bg-white text-primary shadow-sm' : 'text-ink/50 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h1 className="mt-8 text-3xl font-extrabold leading-tight">{aktif.judul}</h1>
      <p className="mt-2 text-ink/60">{aktif.sub}</p>

      <form
        onSubmit={masuk}
        className="mt-8 bg-white rounded-[2rem] p-7 space-y-5 shadow-[0_20px_60px_rgba(123,108,246,0.15)]"
      >
        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={field + ' mt-2'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              type={lihat ? 'text' : 'password'}
              autoComplete="current-password"
              className={field + ' pr-12'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password kamu"
            />
            <button
              type="button"
              onClick={() => setLihat(!lihat)}
              aria-label={lihat ? 'Sembunyikan password' : 'Tampilkan password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            >
              {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-ink text-white font-semibold py-4 rounded-full hover:bg-primary transition disabled:opacity-60"
        >
          {loading ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>

      {tab === 'mahasiswa' ? (
        <p className="mt-6 text-center text-sm text-ink/60">
          Belum punya akun?{' '}
          <Link to="/daftar" className="text-primary font-semibold hover:underline">
            Daftar dulu
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-center text-sm text-ink/50">
          Akun {tab} dibuatkan oleh admin KindSpace.
        </p>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
        >
          <ArrowLeft size={16} /> Kembali ke beranda
        </Link>
      </div>
    </section>
  )
}
