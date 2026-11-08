import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { STATUS, tanggalPendek } from '../lib/format'
import StatusBadge from '../components/StatusBadge'

const field =
  'w-full bg-white border border-ink/10 rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition'

export default function DashAdmin() {
  const [tab, setTab] = useState('janji')

  return (
    <section className="max-w-6xl mx-auto px-5 py-14">
      <p className="text-sm text-ink/50">Dashboard admin</p>
      <h1 className="text-3xl font-extrabold">Kelola KindSpace</h1>

      <div className="mt-8 inline-grid grid-cols-2 gap-1 bg-primary-soft rounded-full p-1">
        {[
          ['janji', 'Semua janji'],
          ['konselor', 'Konselor'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition ${
              tab === id ? 'bg-white text-primary shadow-sm' : 'text-ink/50 hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">{tab === 'janji' ? <AdminJanji /> : <AdminKonselor />}</div>
    </section>
  )
}

/* ---------- Semua janji ---------- */
function AdminJanji() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('semua')

  useEffect(() => {
    let batal = false
    supabase
      .from('bookings')
      .select('id, kode_booking, nama, kontak, tanggal, jam, mode, status, counselors(nama)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (batal) return
        if (error) setError(error.message)
        else setList(data ?? [])
        setLoading(false)
      })
    return () => {
      batal = true
    }
  }, [])

  async function ubah(id, status) {
    setError('')
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select('id')
    if (error || !data?.length) {
      setError('Gagal mengubah status. ' + (error?.message ?? ''))
      return
    }
    setList((l) => l.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  const hitung = (s) => list.filter((b) => b.status === s).length
  const tampil = list.filter((b) => {
    const cocokStatus = filter === 'semua' || b.status === filter
    const teks = `${b.kode_booking} ${b.nama} ${b.counselors?.nama ?? ''}`.toLowerCase()
    return cocokStatus && teks.includes(q.toLowerCase())
  })

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          ['Total', list.length],
          ...STATUS.map((s) => [s, hitung(s)]),
        ].map(([label, n]) => (
          <div
            key={label}
            className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(42,40,56,0.06)]"
          >
            <p className="text-3xl font-extrabold text-primary">{n}</p>
            <p className="text-sm text-ink/60 capitalize">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kode, nama, konselor"
            className="w-full bg-white border border-ink/10 rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-ink/10 rounded-full px-4 py-2.5 text-sm capitalize outline-none focus:border-primary"
        >
          {['semua', ...STATUS].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      {loading && <p className="mt-6 text-ink/50">Memuat...</p>}

      {!loading && (
        <div className="mt-6 bg-white rounded-3xl shadow-[0_8px_30px_rgba(42,40,56,0.06)] overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-ink/50 border-b border-ink/5">
                {['Kode', 'Mahasiswa', 'Konselor', 'Jadwal', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-ink/50">
                    Tidak ada janji yang cocok.
                  </td>
                </tr>
              )}
              {tampil.map((b) => (
                <tr key={b.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-4 font-bold tracking-wider text-primary">{b.kode_booking}</td>
                  <td className="px-5 py-4">
                    {b.nama}
                    <span className="block text-xs text-ink/50">
                      {b.mode === 'anonim' ? 'Anonim' : b.kontak}
                    </span>
                  </td>
                  <td className="px-5 py-4">{b.counselors?.nama ?? '-'}</td>
                  <td className="px-5 py-4">
                    {tanggalPendek(b.tanggal)}
                    <span className="block text-xs text-ink/50">{b.jam}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={b.status} />
                      <select
                        value={b.status}
                        onChange={(e) => ubah(b.id, e.target.value)}
                        aria-label="Ubah status"
                        className="border border-ink/10 rounded-full px-2 py-1 text-xs capitalize bg-white"
                      >
                        {STATUS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

/* ---------- Kelola konselor ---------- */
function AdminKonselor() {
  const [list, setList] = useState([])
  const [versi, setVersi] = useState(0)
  const [error, setError] = useState('')
  const [pesan, setPesan] = useState('')
  const [email, setEmail] = useState({})
  const [baru, setBaru] = useState({ nama: '', jurusan: '', bio: '', spesialisasi: '' })
  const [busy, setBusy] = useState(false)

  const muatUlang = () => setVersi((v) => v + 1)

  useEffect(() => {
    let batal = false
    supabase
      .from('counselors')
      .select('id, nama, jurusan, aktif, user_id')
      .order('created_at')
      .then(({ data, error }) => {
        if (batal) return
        if (error) setError(error.message)
        else setList(data ?? [])
      })
    return () => {
      batal = true
    }
  }, [versi])

  async function tambah(e) {
    e.preventDefault()
    setError('')
    setPesan('')
    if (!baru.nama.trim()) {
      setError('Nama konselor wajib diisi.')
      return
    }
    setBusy(true)
    const { error } = await supabase.from('counselors').insert({
      nama: baru.nama.trim(),
      jurusan: baru.jurusan.trim() || null,
      bio: baru.bio.trim() || null,
      spesialisasi: baru.spesialisasi
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setBusy(false)
    if (error) {
      setError('Gagal menambah: ' + error.message)
      return
    }
    setBaru({ nama: '', jurusan: '', bio: '', spesialisasi: '' })
    setPesan('Konselor ditambahkan.')
    muatUlang()
  }

  async function toggleAktif(c) {
    setError('')
    const { error } = await supabase.from('counselors').update({ aktif: !c.aktif }).eq('id', c.id)
    if (error) {
      setError(error.message)
      return
    }
    muatUlang()
  }

  async function hubungkan(c) {
    setError('')
    setPesan('')
    const alamat = (email[c.id] ?? '').trim()
    if (!alamat) {
      setError('Isi email akun konselor dulu.')
      return
    }
    const { error } = await supabase.rpc('jadikan_konselor', {
      p_email: alamat,
      p_counselor: c.id,
    })
    if (error) {
      setError(error.message)
      return
    }
    setPesan(`Akun ${alamat} sekarang terhubung ke ${c.nama}.`)
    setEmail({ ...email, [c.id]: '' })
    muatUlang()
  }

  return (
    <>
      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}
      {pesan && <p className="mb-4 text-primary text-sm">{pesan}</p>}

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* daftar konselor */}
        <div className="lg:col-span-2 space-y-4">
          {list.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(42,40,56,0.06)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-lg">{c.nama}</p>
                  <p className="text-sm text-ink/60">{c.jurusan ?? '-'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      c.user_id ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink/60'
                    }`}
                  >
                    {c.user_id ? 'Akun terhubung' : 'Belum ada akun'}
                  </span>
                  <button
                    onClick={() => toggleAktif(c)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                      c.aktif
                        ? 'border-primary text-primary hover:bg-primary-soft'
                        : 'border-ink/10 text-ink/50 hover:border-primary'
                    }`}
                  >
                    {c.aktif ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  value={email[c.id] ?? ''}
                  onChange={(e) => setEmail({ ...email, [c.id]: e.target.value })}
                  placeholder="Email akun konselor"
                  type="email"
                  className="flex-1 min-w-[12rem] bg-cream rounded-full px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary/10"
                />
                <button
                  onClick={() => hubungkan(c)}
                  className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary transition"
                >
                  {c.user_id ? 'Ganti akun' : 'Hubungkan akun'}
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-ink/50">Belum ada konselor.</p>}
        </div>

        {/* tambah konselor */}
        <form
          onSubmit={tambah}
          className="bg-white rounded-3xl p-6 space-y-4 shadow-[0_8px_30px_rgba(42,40,56,0.06)]"
        >
          <h2 className="font-bold text-lg">Tambah konselor</h2>
          <input
            className={field}
            placeholder="Nama"
            value={baru.nama}
            onChange={(e) => setBaru({ ...baru, nama: e.target.value })}
          />
          <input
            className={field}
            placeholder="Jurusan"
            value={baru.jurusan}
            onChange={(e) => setBaru({ ...baru, jurusan: e.target.value })}
          />
          <textarea
            rows={3}
            className={field}
            placeholder="Bio singkat"
            value={baru.bio}
            onChange={(e) => setBaru({ ...baru, bio: e.target.value })}
          />
          <input
            className={field}
            placeholder="Spesialisasi, pisahkan dengan koma"
            value={baru.spesialisasi}
            onChange={(e) => setBaru({ ...baru, spesialisasi: e.target.value })}
          />
          <button
            disabled={busy}
            className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:bg-ink transition disabled:opacity-60"
          >
            {busy ? 'Menyimpan...' : 'Tambah'}
          </button>
          <p className="text-xs text-ink/50">
            Setelah ditambah, minta calon konselor mendaftar lewat halaman Daftar, lalu hubungkan
            emailnya di kartu konselor.
          </p>
        </form>
      </div>
    </>
  )
}
