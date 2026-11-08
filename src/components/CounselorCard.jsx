import { Link } from 'react-router-dom'

const warna = ['bg-peach-soft', 'bg-primary-soft', 'bg-butter']
const bayangan = ['[--sh:#FFB59E]', '[--sh:#7B6CF6]', '[--sh:#2A2838]']

// Warna kartu dipilih dari id, supaya konselor yang sama selalu berwarna sama
function pilih(id) {
  return [...String(id)].reduce((a, ch) => a + ch.charCodeAt(0), 0) % warna.length
}

export default function CounselorCard({ c }) {
  const initial = c.nama?.[0] ?? '?'
  const w = pilih(c.id)

  return (
    <div className={`sticker bg-white rounded-3xl p-6 flex flex-col ${bayangan[w]}`}>
      <div
        className={`w-16 h-16 rounded-2xl border-[1.5px] border-ink grid place-items-center overflow-hidden font-display text-2xl font-extrabold ${warna[w]}`}
      >
        {c.foto ? (
          <img src={c.foto} alt={c.nama} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </div>

      <h3 className="mt-4 font-bold text-xl">{c.nama}</h3>
      <p className="text-sm text-ink/60">{c.jurusan}</p>
      <p className="mt-3 text-sm text-ink/70 line-clamp-3">{c.bio}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {c.spesialisasi?.map((s) => (
          <span
            key={s}
            className="text-xs font-medium bg-cream border border-ink/20 px-3 py-1 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>

      <Link
        to={`/booking?konselor=${c.id}`}
        className="btn-sticker mt-6 text-center bg-primary text-white text-sm font-semibold py-3 rounded-full"
      >
        Buat janji
      </Link>
    </div>
  )
}
