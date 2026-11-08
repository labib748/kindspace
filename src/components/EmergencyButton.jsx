import { useState } from 'react'
import { LifeBuoy, X, Phone, MessageCircle } from 'lucide-react'

export default function EmergencyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-white text-[#C2603F] font-semibold text-sm px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(42,40,56,0.18)] border border-peach/50 hover:bg-peach-soft transition"
      >
        <LifeBuoy size={18} /> Butuh bantuan?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm grid place-items-center p-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-[2rem] p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-5 right-5" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
            <h2 className="text-2xl font-extrabold">Kamu tidak sendirian</h2>
            <p className="mt-2 text-sm text-ink/70">
              Kalau kamu sedang berada dalam krisis atau terpikir untuk menyakiti diri sendiri,
              tolong hubungi bantuan di bawah ini sekarang.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="tel:119"
                className="flex items-start gap-3 bg-peach-soft rounded-2xl p-4 hover:bg-peach/40 transition"
              >
                <Phone className="text-[#C2603F] mt-0.5" size={20} />
                <div>
                  <p className="font-bold">Telepon 119, lalu tekan 8</p>
                  <p className="text-sm text-ink/70">
                    Layanan krisis kesehatan jiwa Kemenkes (119 ext. 8). Juga nomor darurat medis.
                  </p>
                </div>
              </a>
              <a
                href="https://healing119.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 bg-primary-soft rounded-2xl p-4 hover:bg-primary/20 transition"
              >
                <MessageCircle className="text-primary mt-0.5" size={20} />
                <div>
                  <p className="font-bold">healing119.id</p>
                  <p className="text-sm text-ink/70">Konsultasi lewat chat atau panggilan suara.</p>
                </div>
              </a>
            </div>

            <p className="mt-5 text-xs text-ink/50">
              Kalau ada bahaya langsung di sekitarmu, minta tolong orang terdekat atau datangi
              fasilitas kesehatan terdekat. KindSpace adalah teman sebaya, bukan layanan darurat.
            </p>
          </div>
        </div>
      )}
    </>
  )
}