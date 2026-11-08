import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Copy } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { generateKode } from '../lib/helpers'
import { kirimKeN8n } from '../lib/n8n'

const jamList = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

const field =
  'w-full bg-white border border-ink/10 rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition'

export default function Booking() {
  const [params] = useSearchParams()
  const [counselors, setCounselors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kode, setKode] = useState('')
  const [form, setForm] = useState({
    nama: '',
    kontak: '',
    counselor_id: params.get('konselor') ?? '',
    topik: '',
    tanggal: '',
    jam: '',
    mode: 'terbuka',
  })

  useEffect(() => {
    supabase
      .from('counselors')
      .select('id, nama, jurusan')
      .then(({ data }) => setCounselors(data ?? []))
  }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.nama || !form.kontak || !form.counselor_id || !form.tanggal || !form.jam) {
      setError('Mohon lengkapi semua kolom yang bertanda *.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.kontak.trim())) {
      setError('Format email belum benar. Contoh: nama@gmail.com')
      return
    }
    setLoading(true)
    const kode_booking = generateKode()
    const { error } = await supabase.from('bookings').insert({
      kode_booking,
      nama: form.nama,
      kontak: form.kontak,
      counselor_id: form.counselor_id,
      topik: form.topik,
      tanggal: form.tanggal,
      jam: form.jam,
      mode: form.mode,
    })
    setLoading(false)
    if (error) {
      setError('Gagal menyimpan: ' + error.message)
      return
    }

    // Kirim ke n8n (Google Sheets + email otomatis)
    const konselor = counselors.find((c) => c.id === form.counselor_id)
    kirimKeN8n({
      kode_booking,
      nama: form.nama,
      kontak: form.kontak,
      konselor: konselor?.nama ?? '',
      topik: form.topik,
      tanggal: form.tanggal,
      jam: form.jam,
      mode: form.mode,
    })

    setKode(kode_booking)
  }

  // Tampilan sukses
  if (kode) {
    return (
      <section className="max-w-lg mx-auto px-5 py-20 text-center">
        <div className="bg-white rounded-[2rem] p-10 shadow-[0_20px_60px_rgba(123,108,246,0.15)]">
          <CheckCircle2 className="mx-auto text-primary" size={56} />
          <h1 className="mt-4 text-2xl font-extrabold">Janji kamu sudah dibuat</h1>
          <p className="mt-2 text-ink/60">Simpan kode ini untuk mengecek status janji kamu.</p>
          <div className="mt-6 flex items-center justify-center gap-3 bg-primary-soft rounded-2xl py-4">
            <span className="text-2xl font-extrabold tracking-widest text-primary">{kode}</span>
            <button onClick={() => navigator.clipboard.writeText(kode)} title="Salin">
              <Copy size={18} className="text-primary" />
            </button>
          </div>
          <Link to="/" className="inline-block mt-8 text-primary font-semibold hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-2xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-extrabold">Buat janji</h1>
      <p className="mt-2 text-ink/60">Isi data singkat di bawah. Boleh pakai nama samaran.</p>

      <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-[2rem] p-8 space-y-5 shadow-[0_8px_30px_rgba(42,40,56,0.06)]">
        <div>
          <label className="text-sm font-semibold">Nama / nama samaran *</label>
          <input className={field + ' mt-2'} value={form.nama} onChange={set('nama')} placeholder="Misal: Bintang" />
        </div>

        <div>
          <label className="text-sm font-semibold">Email *</label>
          <input
            type="email"
            className={field + ' mt-2'}
            value={form.kontak}
            onChange={set('kontak')}
            placeholder="nama@email.com"
          />
          <p className="mt-1.5 text-xs text-ink/50">
            Konfirmasi janji dan kode booking akan dikirim ke email ini.
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold">Pilih konselor *</label>
          <select className={field + ' mt-2'} value={form.counselor_id} onChange={set('counselor_id')}>
            <option value="">-- Pilih --</option>
            {counselors.map((c) => (
              <option key={c.id} value={c.id}>{c.nama} ({c.jurusan})</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold">Tanggal *</label>
            <input type="date" min={today} className={field + ' mt-2'} value={form.tanggal} onChange={set('tanggal')} />
          </div>
          <div>
            <label className="text-sm font-semibold">Jam *</label>
            <select className={field + ' mt-2'} value={form.jam} onChange={set('jam')}>
              <option value="">-- Pilih --</option>
              {jamList.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Topik singkat (opsional)</label>
          <textarea rows={3} className={field + ' mt-2'} value={form.topik} onChange={set('topik')} placeholder="Apa yang ingin kamu ceritakan?" />
        </div>

        <div>
          <label className="text-sm font-semibold">Mode</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {['terbuka', 'anonim'].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setForm({ ...form, mode: m })}
                className={`py-3 rounded-2xl border font-semibold capitalize transition ${
                  form.mode === m ? 'bg-primary text-white border-primary' : 'bg-white border-ink/10 hover:border-primary'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-ink text-white font-semibold py-4 rounded-full hover:bg-primary transition disabled:opacity-60"
        >
          {loading ? 'Mengirim...' : 'Kirim permintaan'}
        </button>
      </form>
    </section>
  )
}
