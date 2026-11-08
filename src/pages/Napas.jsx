import { useEffect, useState } from 'react'

const fases = [
  { nama: 'Tarik napas', detik: 4, skala: 1 },
  { nama: 'Tahan', detik: 7, skala: 1 },
  { nama: 'Hembuskan', detik: 8, skala: 0.55 },
]
const TOTAL_SIKLUS = 4

export default function Napas() {
  const [aktif, setAktif] = useState(false)
  const [st, setSt] = useState({ fase: 0, sisa: 4, siklus: 0 })

  useEffect(() => {
    if (!aktif) return
    const t = setInterval(() => {
      setSt((p) => {
        if (p.sisa > 1) return { ...p, sisa: p.sisa - 1 }
        const n = (p.fase + 1) % 3
        return { fase: n, sisa: fases[n].detik, siklus: p.siklus + (n === 0 ? 1 : 0) }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [aktif])

  useEffect(() => {
    if (st.siklus >= TOTAL_SIKLUS) setAktif(false)
  }, [st.siklus])

  const selesai = st.siklus >= TOTAL_SIKLUS
  const f = fases[st.fase]

  function mulai() {
    setSt({ fase: 0, sisa: fases[0].detik, siklus: 0 })
    setAktif(true)
  }
  function berhenti() {
    setAktif(false)
    setSt({ fase: 0, sisa: 4, siklus: 0 })
  }

  return (
    <section className="max-w-xl mx-auto px-5 py-16 text-center">
      <h1 className="text-4xl font-extrabold">Tarik napas dulu</h1>
      <p className="mt-2 text-ink/60">
        Latihan napas 4-7-8: tarik 4 detik, tahan 7 detik, hembuskan 8 detik. Ulangi {TOTAL_SIKLUS} kali.
      </p>

      <div className="mt-12 h-72 grid place-items-center">
        <div
          className="w-64 h-64 rounded-full bg-primary/20 grid place-items-center"
          style={{
            transform: `scale(${aktif ? f.skala : 0.55})`,
            transition: `transform ${aktif ? f.detik : 0.5}s ease-in-out`,
          }}
        >
          <div className="w-44 h-44 rounded-full bg-primary/40" />
        </div>
      </div>

      <div className="mt-6 min-h-[5rem]">
        {aktif ? (
          <>
            <p className="text-2xl font-extrabold text-primary">{f.nama}</p>
            <p className="text-5xl font-extrabold mt-1">{st.sisa}</p>
            <p className="mt-2 text-sm text-ink/50">
              Siklus {Math.min(st.siklus + 1, TOTAL_SIKLUS)} dari {TOTAL_SIKLUS}
            </p>
          </>
        ) : selesai ? (
          <p className="text-lg font-semibold text-primary">Selesai. Semoga terasa sedikit lebih tenang.</p>
        ) : (
          <p className="text-ink/50">Duduk dengan nyaman, lalu tekan mulai.</p>
        )}
      </div>

      <button
        onClick={aktif ? berhenti : mulai}
        className="mt-8 bg-ink text-white font-semibold px-10 py-4 rounded-full hover:bg-primary transition"
      >
        {aktif ? 'Berhenti' : selesai ? 'Ulangi' : 'Mulai'}
      </button>
    </section>
  )
}