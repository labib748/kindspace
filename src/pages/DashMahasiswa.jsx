import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, UserRound, EyeOff, Plus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import { tanggalCantik } from '../lib/format'

const info = {
  menunggu: 'Permintaanmu sudah masuk dan menunggu konfirmasi konselor.',
  dikonfirmasi: 'Jadwalmu sudah dikonfirmasi. Sampai ketemu di sesi nanti!',
  selesai: 'Sesi ini sudah selesai. Semoga membantu ya.',
  dibatalkan: 'Janji ini dibatalkan. Kamu bisa membuat janji baru kapan saja.',
}

export default function DashMahasiswa() {
  const { user, profile } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let batal = false
    supabase
      .from('bookings')
      .select('id, kode_booking, tanggal, jam, mode, status, topik, counselors(nama, jurusan)')
      .eq('user_id', user.id)
      .order('tanggal', { ascending: false })
      .then(({ data, error }) => {
        if (batal) return
        if (error) setError(error.message)
        else setList(data ?? [])
        setLoading(false)
      })
    return () => {
      batal = true
    }
  }, [user.id])

  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink/50">Dashboard mahasiswa</p>
          <h1 className="text-3xl font-extrabold">Halo, {profile?.nama ?? 'teman'}</h1>
        </div>
        <Link
          to="/booking"
          className="inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-primary transition"
        >
          <Plus size={16} /> Buat janji
        </Link>
      </div>

      <h2 className="mt-10 text-lg font-bold">Janji kamu</h2>

      {error && <p className="mt-4 text-red-600 text-sm">Terjadi kendala: {error}</p>}
      {loading && <p className="mt-4 text-ink/50">Memuat...</p>}

      {!loading && !error && list.length === 0 && (
        <div className="mt-4 bg-white rounded-3xl p-8 text-center shadow-[0_8px_30px_rgba(42,40,56,0.06)]">
          <p className="text-ink/60">Kamu belum punya janji.</p>
          <Link to="/konselor" className="inline-block mt-3 text-primary font-semibold hover:underline">
            Lihat konselor
          </Link>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {list.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(42,40,56,0.06)]"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold tracking-widest text-primary">{b.kode_booking}</span>
              <StatusBadge status={b.status} />
            </div>
            <p className="mt-3 text-sm text-ink/70">{info[b.status]}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <UserRound size={16} className="text-primary" />
                {b.counselors?.nama ?? '-'}
                {b.counselors?.jurusan && (
                  <span className="text-ink/50">({b.counselors.jurusan})</span>
                )}
              </li>
              <li className="flex items-center gap-3">
                <CalendarDays size={16} className="text-primary" />
                {tanggalCantik(b.tanggal)}
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-primary" />
                Pukul {b.jam}
              </li>
              <li className="flex items-center gap-3">
                <EyeOff size={16} className="text-primary" />
                Mode <b className="capitalize">{b.mode}</b>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
