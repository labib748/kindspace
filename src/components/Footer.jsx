export default function Footer() {
  return (
    <footer className="border-t border-ink/5 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row gap-6 justify-between text-sm text-ink/60">
        <div>
          <p className="font-extrabold text-ink text-lg">KindSpace</p>
          <p className="mt-1 max-w-sm">
            Ruang cerita bersama konselor sebaya. Data dijaga dengan akses terbatas.
          </p>
        </div>
        <div className="max-w-sm">
          <p className="font-semibold text-ink">Butuh bantuan segera?</p>
          <p className="mt-1">
            Kalau kamu merasa dalam bahaya, hubungi layanan darurat setempat atau orang
            terdekatmu. KindSpace adalah teman sebaya, bukan pengganti tenaga profesional.
          </p>
        </div>
      </div>
    </footer>
  )
}