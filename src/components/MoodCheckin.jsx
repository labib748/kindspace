import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const moods = [
  { v: 1, e: '😞', t: 'Berat' },
  { v: 2, e: '😕', t: 'Kurang baik' },
  { v: 3, e: '😐', t: 'Biasa' },
  { v: 4, e: '🙂', t: 'Baik' },
  { v: 5, e: '😄', t: 'Senang' },
]

const keyTanggal = (d) => d.toLocaleDateString('en-CA') // YYYY-MM-DD, zona waktu lokal

function tujuhHari() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })
}

export default function MoodCheckin() {
  const { user } = useAuth()
  const [pilih, setPilih] = useState(null)
  const [catatan, setCatatan] = useState('')
  const [riwayat, setRiwayat] = useState({})
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const userId = user?.id

  async function muat() {
    if (!userId) {
      setRiwayat({})
      return
    }
    try {
      const { data } = await supabase
        .from('mood_checkins')
        .select('mood, tanggal, created_at')
        .gte('tanggal', keyTanggal(tujuhHari()[0]))
        .order('created_at')
      const map = {}
      ;(data ?? []).forEach((r) => (map[r.tanggal] = r.mood))
      setRiwayat(map)
    } catch (e) {
      console.warn('Gagal memuat mood:', e)
    }
  }

  useEffect(() => {
    muat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  async function simpan() {
    if (!pilih || !userId) return
    setLoading(true)
    setStatus('')
    try {
      const { error } = await supabase.from('mood_checkins').insert({
        user_id: userId,
        mood: pilih,
        catatan: catatan || null,
        tanggal: keyTanggal(new Date()),
      })
      if (error) throw error
      setStatus(pilih <= 2 ? 'berat' : 'ok')
      setCatatan('')
      setPilih(null)
      await muat()
    } catch (e) {
      setStatus('Belum bisa menyimpan: ' + e.message)
    }
    setLoading(false)
  }

  const hari = tujuhHari()

  return (
    <div className="relative">
      <div className="absolute -top-6 -right-4 w-40 h-40 bg-peach/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-4 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
      <div className="sticker relative bg-white rounded-[2rem] p-8 [--sh:#7B6CF6]">
        <p className="text-sm text-ink/50">Cek suasana hati</p>
        <h3 className="text-2xl font-bold mt-1">Hari ini kamu lagi gimana?</h3>

        <div className="mt-6 flex justify-between">
          {moods.map((m) => (
            <button
              key={m.v}
              title={m.t}
              disabled={!user}
              onClick={() => setPilih(m.v)}
              className={`text-3xl w-14 h-14 rounded-2xl transition ${
                user ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'
              } ${
                pilih === m.v
                  ? 'bg-primary-soft ring-2 ring-primary'
                  : 'bg-cream hover:bg-primary-soft'
              }`}
            >
              {m.e}
            </button>
          ))}
        </div>

        {!user && (
          <p className="mt-4 text-sm text-ink/60">
            Masuk dulu supaya check-in dan grafik 7 harimu tersimpan.{' '}
            <Link to="/masuk" className="text-primary font-semibold hover:underline">
              Masuk
            </Link>
          </p>
        )}

        {user && pilih && (
          <div className="mt-5">
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan singkat (opsional)"
              className="w-full bg-cream rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/10"
            />
            <button
              onClick={simpan}
              disabled={loading}
              className="mt-3 w-full bg-ink text-white font-semibold py-3 rounded-full hover:bg-primary transition disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Simpan check-in'}
            </button>
          </div>
        )}

        {status === 'ok' && (
          <p className="mt-4 text-sm text-primary">Tersimpan. Terima kasih sudah check-in hari ini.</p>
        )}
        {status === 'berat' && (
          <p className="mt-4 text-sm text-ink/70">
            Terima kasih sudah jujur. Kalau hari ini terasa berat, kamu tidak harus melewatinya
            sendirian.{' '}
            <Link to="/booking" className="text-primary font-semibold hover:underline">
              Bercerita ke konselor
            </Link>
          </p>
        )}
        {status && status !== 'ok' && status !== 'berat' && (
          <p className="mt-4 text-sm text-red-600">{status}</p>
        )}

        {/* grafik 7 hari */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-ink/50">7 hari terakhir</p>
          <div className="mt-3 flex items-end justify-between gap-2 h-24">
            {hari.map((d) => {
              const v = riwayat[keyTanggal(d)]
              return (
                <div
                  key={keyTanggal(d)}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-1"
                >
                  <div
                    className={`w-full rounded-lg ${v ? 'bg-primary' : 'bg-ink/5'}`}
                    style={{ height: v ? `${v * 20}%` : '8%' }}
                    title={v ? moods[v - 1].t : 'Belum check-in'}
                  />
                  <span className="text-[10px] text-ink/50">
                    {d.toLocaleDateString('id-ID', { weekday: 'short' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
