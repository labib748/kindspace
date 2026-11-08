import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const field =
  'w-full bg-white border border-ink/10 rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition'

function terjemah(msg = '') {
  if (msg.includes('already registered')) return 'Email ini sudah terdaftar. Silakan masuk.'
  if (msg.includes('Password should be')) return 'Password minimal 6 karakter.'
  if (msg.includes('rate limit')) return 'Terlalu sering mencoba. Tunggu beberapa saat lalu ulangi.'
  return 'Belum bisa mendaftar: ' + msg
}

export default function Daftar() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function daftar(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!form.nama.trim() || !form.email.trim() || !form.password) {
      setError('Lengkapi semua kolom dulu ya.')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { nama: form.nama.trim() } },
    })
    setLoading(false)
    if (error) {
      setError(terjemah(error.message))
      return
    }
    if (data.session) {
      navigate('/dashboard', { replace: true })
    } else {
      setInfo('Akun dibuat. Cek email kamu untuk konfirmasi, lalu masuk.')
    }
  }

  return (
    <section className="max-w-md mx-auto px-5 py-14">
      <h1 className="text-3xl font-extrabold leading-tight">Buat akun KindSpace</h1>
      <p className="mt-2 text-ink/60">
        Nama boleh nama samaran. Kamu tetap bisa memilih mode anonim saat membuat janji.
      </p>

      <form
        onSubmit={daftar}
        className="mt-8 bg-white rounded-[2rem] p-7 space-y-5 shadow-[0_20px_60px_rgba(123,108,246,0.15)]"
      >
        <div>
          <label htmlFor="nama" className="text-sm font-semibold">
            Nama atau nama samaran
          </label>
          <input
            id="nama"
            className={field + ' mt-2'}
            value={form.nama}
            onChange={set('nama')}
            placeholder="Misal: Bintang"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={field + ' mt-2'}
            value={form.email}
            onChange={set('email')}
            placeholder="nama@email.com"
          />
          <p className="mt-1.5 text-xs text-ink/50">
            Konfirmasi janji akan dikirim ke email ini.
          </p>
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={field + ' mt-2'}
            value={form.password}
            onChange={set('password')}
            placeholder="Minimal 6 karakter"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {info && <p className="text-primary text-sm">{info}</p>}

        <button
          disabled={loading}
          className="w-full bg-ink text-white font-semibold py-4 rounded-full hover:bg-primary transition disabled:opacity-60"
        >
          {loading ? 'Membuat akun...' : 'Daftar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Sudah punya akun?{' '}
        <Link to="/masuk" className="text-primary font-semibold hover:underline">
          Masuk
        </Link>
      </p>
      <div className="mt-6 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink">
          <ArrowLeft size={16} /> Kembali ke beranda
        </Link>
      </div>
    </section>
  )
}
