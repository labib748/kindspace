import { Sparkle } from './Doodles'

const kata = [
  'Kamu didengar',
  'Kamu cukup',
  'Pelan-pelan nggak apa-apa',
  'Cerita itu bukan tanda lemah',
  'Kamu nggak sendirian',
  'Boleh istirahat dulu',
]

function Grup({ duplikat = false }) {
  return (
    <div
      className={`flex shrink-0 items-center ${duplikat ? 'marquee-dup' : ''}`}
      aria-hidden={duplikat || undefined}
    >
      {kata.map((k) => (
        <span key={k} className="flex items-center">
          <span className="font-display text-2xl md:text-3xl font-bold px-6 whitespace-nowrap">
            {k}
          </span>
          <Sparkle className="w-5 h-5 text-peach shrink-0" />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="overflow-hidden py-6">
      <div
        className="marquee bg-ink text-cream border-y-[1.5px] border-ink py-4 -rotate-1 w-[104%] -ml-[2%]"
        aria-label="Kalimat hangat dari KindSpace"
      >
        <div className="marquee-track">
          <Grup />
          <Grup duplikat />
        </div>
      </div>
    </div>
  )
}
