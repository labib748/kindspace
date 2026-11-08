import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import CounselorCard from '../components/CounselorCard'

export default function Konselor() {
  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('counselors')
      .select('*')
      .then(({ data }) => {
        setList(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = list.filter((c) => {
    const teks = `${c.nama} ${c.jurusan} ${(c.spesialisasi ?? []).join(' ')}`.toLowerCase()
    return teks.includes(q.toLowerCase())
  })

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-extrabold">Konselor sebaya</h1>
      <p className="mt-2 text-ink/60 max-w-xl">
        Pilih teman cerita yang paling cocok denganmu. Cari berdasarkan nama, jurusan, atau topik.
      </p>

      <div className="mt-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari: kecemasan, karier, nama..."
          className="w-full bg-white border border-ink/10 rounded-full pl-11 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
        />
      </div>

      {loading ? (
        <p className="mt-10 text-ink/50">Memuat konselor...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-ink/50">Tidak ada konselor yang cocok.</p>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <CounselorCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </section>
  )
}