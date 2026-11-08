import { useEffect, useState } from 'react'
import { CalendarDays, Clock, EyeOff, Mail, MessageSquareText } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import { STATUS, tanggalCantik } from '../lib/format'

const aksi = {
  menunggu: [
    { label: 'Konfirmasi', ke: 'dikonfirmasi', utama: true },
    { label: 'Tolak', ke: 'dibatalkan', konfirmasi: 'Tolak janji ini?' },
  ],
  dikonfirmasi: [
    { label: 'Tandai selesai', ke: 'selesai', utama: true },
    { label: 'Batalkan', ke: 'dibatalkan', konfirmasi: 'Batalkan janji ini?' },
  ],
}

export default function DashKonselor() {
  const { user, profile } = useAuth()
  const [konselor, setKonselor] = useState(undefined) // undefined = memuat, null = belum terhubung
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('semua')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(null)

  useEffect(() => {
    let batal = false
    async function muat() {
      const { data: k } = await supabase
        .from('counselors')
        .select('id, nama')
        .eq('user_id', user.id)
        .maybeSingle()
      if (batal) return
      setKonselor(k ?? null)
      if (!k) return
      const { data, error } = await supabase
        .from('bookings')
        .select('id, kode_booking, nama, kontak, topik, tanggal, jam, mode, status')
        .eq('counselor_id', k.id)
        .order('tanggal')
        .order('jam')
      if (batal) return
      if (error) setError(error.message)
      else setList(data ?? [])
    }
    muat()
    return () => {
      batal = true
    }
  }, [user.id])

  async function ubah(b, a) {
    if (a.konfirmasi && !window.confirm(a.konfirmasi)) return
    setBusy(b.id)
    setError('')
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: a.ke })
      .eq('id', b.id)
      .select('id')
    setBusy(null)
    if (error || !data?.length) {
      setError('Gagal mengubah status. ' + (error?.message ?? 'Kamu tidak punya izin untuk janji ini.'))
      return
    }
    setList((l) => l.map((x) => (x.id === b.id ? { ...x, status: a.ke } : x)))
  }

  if (konselor === undefined) {
    return <p className="text-center py-24 text-ink/50">Memuat...</p>
  }

  if (konselor === null) {
    return (
      <section className="max-w-lg mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Akunmu belum terhubung ke profil konselor</h1>
        <p className="mt-2 text-ink/60">
          Hubungi admin KindSpace untuk menghubungkan akun ini ke profil konselor, supaya janji yang
          masuk bisa tampil di sini.
        </p>
      </section>
    )
  }

  const hitung = (s) => list.filter((b) => b.status === s).length
  const tampil = filter === 'semua' ? list : list.filter((b) => b.status === filter)

  return (
    <section className="max-w-5xl mx-auto px-5 py-14">
      <p className="text-sm text-ink/50">Dashboard konselor</p>
      <h1 className="text-3xl font-extrabold">Halo, {konselor.nama || profile?.nama}</h1>

      {/* ringkasan + filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {['semua', ...STATUS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition ${
              filter === s ? 'bg-ink text-white' : 'bg-white border border-ink/10 hover:border-primary'
            }`}
          >
            {s} ({s === 'semua' ? list.length : hitung(s)})
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

      {tampil.length === 0 && (
        <div className="mt-6 bg-white rounded-3xl p-8 text-center text-ink/60 shadow-[0_8px_30px_rgba(42,40,56,0.06)]">
          Belum ada janji di kategori ini.
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {tampil.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(42,40,56,0.06)] flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold tracking-widest text-primary">{b.kode_booking}</span>
              <StatusBadge status={b.status} />
            </div>

            <p className="mt-3 font-bold text-lg">
              {b.nama}
              {b.mode === 'anonim' && (
                <span className="ml-2 text-xs font-semibold bg-ink/5 text-ink/60 px-2 py-0.5 rounded-full">
                  anonim
                </span>
              )}
            </p>

            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <CalendarDays size={16} className="text-primary" />
                {tanggalCantik(b.tanggal)}
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-primary" />
                Pukul {b.jam}
              </li>
              {b.mode === 'terbuka' ? (
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-primary" />
                  {b.kontak}
                </li>
              ) : (
                <li className="flex items-center gap-3 text-ink/50">
                  <EyeOff size={16} className="text-primary" />
                  Identitas dirahasiakan
                </li>
              )}
              {b.topik && (
                <li className="flex items-start gap-3">
                  <MessageSquareText size={16} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-ink/70">{b.topik}</span>
                </li>
              )}
            </ul>

            {aksi[b.status] && (
              <div className="mt-5 pt-4 border-t border-ink/5 flex flex-wrap gap-2">
                {aksi[b.status].map((a) => (
                  <button
                    key={a.ke}
                    disabled={busy === b.id}
                    onClick={() => ubah(b, a)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition disabled:opacity-60 ${
                      a.utama
                        ? 'bg-primary text-white hover:bg-ink'
                        : 'bg-white border border-ink/10 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
