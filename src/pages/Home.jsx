import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, EyeOff, CalendarCheck, Wind } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import CounselorCard from '../components/CounselorCard'
import MoodCheckin from '../components/MoodCheckin'
import Marquee from '../components/Marquee'
import { Sparkle, HeartDoodle, ArrowCurve, Squiggle, Wave, Tape } from '../components/Doodles'

const langkah = [
  {
    judul: 'Pilih konselor',
    isi: 'Lihat profil dan topik yang mereka kuasai, lalu pilih yang terasa paling cocok.',
  },
  {
    judul: 'Buat janji',
    isi: 'Pilih tanggal dan jam. Mau anonim? Boleh. Konfirmasinya dikirim ke emailmu.',
  },
  {
    judul: 'Bercerita',
    isi: 'Datang di jadwalmu dan ceritakan apa yang kamu rasakan, tanpa dihakimi.',
  },
]

const chip =
  'w-12 h-12 rounded-2xl bg-white border-[1.5px] border-ink grid place-items-center text-ink'

export default function Home() {
  const [counselors, setCounselors] = useState([])

  useEffect(() => {
    supabase
      .from('counselors')
      .select('*')
      .limit(3)
      .then(({ data }) => setCounselors(data ?? []))
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div
          className="dots-fade absolute inset-x-0 top-0 h-[34rem] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-5 pt-16 md:pt-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Sparkle className="absolute -top-10 left-0 w-7 h-7 text-peach" />
            <Sparkle className="absolute -top-4 left-10 w-4 h-4 text-primary" />

            <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight">
              Nggak perlu kuat sendirian.
            </h1>
            <p className="mt-6 text-lg text-ink/70 max-w-md">
              KindSpace menghubungkan kamu dengan teman sebaya di kampus yang siap
              mendengarkan, tanpa menghakimi.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/booking"
                className="btn-sticker bg-primary text-white font-semibold px-7 py-3.5 rounded-full"
              >
                Mulai bercerita
              </Link>
              <Link
                to="/konselor"
                className="btn-sticker bg-white font-semibold px-7 py-3.5 rounded-full"
              >
                Lihat konselor
              </Link>
            </div>

            <div className="mt-5 hidden sm:flex items-end gap-1 text-primary">
              <ArrowCurve className="w-10 h-11 shrink-0" />
              <span className="font-hand text-2xl -rotate-2 pb-1">
                boleh pakai nama samaran, kok
              </span>
            </div>
          </div>

          {/* kartu check-in mood, ditempel dengan selotip */}
          <div className="relative rotate-1">
            <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3 z-10" />
            <HeartDoodle className="absolute -bottom-7 -left-6 w-12 h-12 text-peach -rotate-12" />
            <MoodCheckin />
          </div>
        </div>
      </section>

      {/* PITA */}
      <div className="mt-20">
        <Marquee />
      </div>

      {/* FITUR */}
      <section className="max-w-6xl mx-auto px-5 mt-24">
        <h2 className="text-3xl md:text-4xl font-extrabold">Dibuat supaya kamu nyaman</h2>
        <p className="font-hand text-2xl text-ink/60 mt-1">serius, ini bukan sekadar slogan</p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="sticker relative md:col-span-2 bg-primary text-white rounded-3xl p-8 -rotate-1">
            <Tape className="-top-3 right-10 rotate-3" />
            <span className={chip}>
              <EyeOff size={22} />
            </span>
            <h3 className="mt-5 text-2xl font-bold">Boleh anonim</h3>
            <p className="mt-2 text-white/85 max-w-md">
              Malu atau belum siap pakai nama asli? Pakai nama samaran, dan identitasmu
              dirahasiakan dari konselor. Yang penting kamu mulai bercerita.
            </p>
          </div>

          <div className="sticker bg-peach-soft rounded-3xl p-8 rotate-1 [--sh:#FFB59E]">
            <span className={chip}>
              <ShieldCheck size={22} />
            </span>
            <h3 className="mt-5 text-2xl font-bold">Akses terbatas</h3>
            <p className="mt-2 text-ink/70">
              Janjimu hanya bisa dilihat olehmu dan konselor yang kamu pilih.
            </p>
          </div>

          <div className="sticker bg-white rounded-3xl p-8 [--sh:#7B6CF6]">
            <span className={chip}>
              <CalendarCheck size={22} />
            </span>
            <h3 className="mt-5 text-2xl font-bold">Booking mudah</h3>
            <p className="mt-2 text-ink/70">
              Pilih konselor, tanggal, dan jam. Konfirmasi dikirim otomatis ke emailmu.
            </p>
          </div>

          <div className="sticker md:col-span-2 bg-butter rounded-3xl p-8 -rotate-1">
            <span className={chip}>
              <Wind size={22} />
            </span>
            <h3 className="mt-5 text-2xl font-bold">Tarik napas dulu</h3>
            <p className="mt-2 text-ink/75 max-w-md">
              Lagi panik atau overthinking? Coba latihan napas 4-7-8 untuk menenangkan diri
              sebelum bercerita.
            </p>
            <Link
              to="/napas"
              className="btn-sticker mt-5 bg-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              Coba latihan napas
            </Link>
          </div>
        </div>
      </section>

      {/* LANGKAH */}
      <section className="max-w-6xl mx-auto px-5 mt-28">
        <h2 className="text-3xl md:text-4xl font-extrabold">Mulainya gampang</h2>
        <Squiggle className="mt-3 w-28 text-peach" />

        <ol className="mt-10 grid md:grid-cols-3 gap-6">
          {langkah.map((l, i) => (
            <li
              key={l.judul}
              className="sticker bg-white rounded-3xl p-7 [--sh:#FFB59E]"
            >
              <span className="font-hand text-6xl leading-none text-primary">{i + 1}</span>
              <h3 className="mt-3 text-xl font-bold">{l.judul}</h3>
              <p className="mt-2 text-ink/70">{l.isi}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* KONSELOR, di atas pembatas ombak */}
      <div className="mt-28 text-primary-soft -mb-px">
        <Wave />
      </div>
      <section className="bg-primary-soft pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold">Kenalan dengan konselor</h2>
              <p className="font-hand text-2xl text-ink/60 mt-1">teman cerita yang sebaya denganmu</p>
            </div>
            <Link to="/konselor" className="text-primary font-semibold text-sm hover:underline shrink-0">
              Lihat semua
            </Link>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((c) => (
              <CounselorCard key={c.id} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* AJAKAN */}
      <section className="max-w-6xl mx-auto px-5 mt-24">
        <div className="sticker relative bg-ink text-cream rounded-[2rem] p-10 md:p-14 text-center [--sh:#FFB59E]">
          <Sparkle className="absolute top-6 left-8 w-6 h-6 text-peach" />
          <Sparkle className="absolute bottom-8 right-10 w-9 h-9 text-primary" />
          <h2 className="text-3xl md:text-5xl font-extrabold">Siap cerita hari ini?</h2>
          <p className="mt-3 text-cream/75 max-w-md mx-auto">
            Mulai dari satu langkah kecil. Kami di sini kapan pun kamu siap.
          </p>
          <Link
            to="/booking"
            className="mt-8 inline-block bg-peach text-ink font-semibold px-8 py-4 rounded-full hover:bg-white transition"
          >
            Buat janji sekarang
          </Link>
        </div>
      </section>
    </>
  )
}
