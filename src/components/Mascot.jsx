import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Maskot KindSpace: "Kindy".
// - Mata dan wajah mengikuti kursor, badan sedikit condong ke arah kursor
// - Hover: senang dan melambai. Klik: melompat dan menyapa.
// - Berkedip acak. Tidak ada gerakan kursor 9 detik: mengantuk.

const pesan = [
  { t: 'Hai, aku Kindy! Senang kamu mampir.' },
  { t: 'Pelan-pelan aja ya, kamu nggak sendirian.' },
  { t: 'Tarik napas dulu yuk.', to: '/napas', label: 'Coba latihan napas' },
  { t: 'Bercerita bukan tanda lemah, lho.' },
  { t: 'Udah minum air hari ini?' },
  { t: 'Kamu sudah hebat karena sampai di sini.' },
]

const INK = '#2A2838'
const PEACH = '#FFB59E'
const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

const css = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes kindy-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
  @keyframes kindy-jump {
    0%   { transform: translateY(0) scale(1, 1) }
    25%  { transform: translateY(0) scale(1.08, .9) }
    50%  { transform: translateY(-28px) scale(.96, 1.06) }
    75%  { transform: translateY(0) scale(1.06, .92) }
    100% { transform: translateY(0) scale(1, 1) }
  }
  @keyframes kindy-wave { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(-42deg) } }
  @keyframes kindy-zzz {
    0%   { opacity: 0; transform: translate(0, 6px) }
    50%  { opacity: 1 }
    100% { opacity: 0; transform: translate(8px, -12px) }
  }
  @keyframes kindy-pop { 0% { opacity: 0; transform: translateY(6px) scale(.95) } 100% { opacity: 1; transform: none } }
  .kindy-float { animation: kindy-float 3.2s ease-in-out infinite }
  .kindy-jump  { animation: kindy-jump .6s ease-out }
  .kindy-wave  { animation: kindy-wave .55s ease-in-out infinite }
  .kindy-zzz   { animation: kindy-zzz 2.2s ease-in-out infinite }
  .kindy-pop   { animation: kindy-pop .2s ease-out }
}
`

export default function Mascot() {
  const ref = useRef(null)
  const idx = useRef(0)
  const idleTimer = useRef(null)
  const bubbleTimer = useRef(null)

  const [look, setLook] = useState({ x: 0, y: 0, lean: 0 })
  const [hover, setHover] = useState(false)
  const [blink, setBlink] = useState(false)
  const [sleepy, setSleepy] = useState(false)
  const [jump, setJump] = useState(false)
  const [bubble, setBubble] = useState(null)

  const show = useCallback((msg) => {
    setBubble(msg)
    clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => setBubble(null), 5500)
  }, [])

  // Mengikuti kursor
  useEffect(() => {
    let raf = 0
    const wake = () => {
      setSleepy(false)
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setSleepy(true), 9000)
    }
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const dist = Math.hypot(dx, dy) || 1
        const power = clamp(dist / 250, 0, 1)
        setLook({ x: (dx / dist) * power, y: (dy / dist) * power, lean: clamp(dx / 400, -1, 1) })
      })
      wake()
    }
    const onLeave = () => setLook({ x: 0, y: 0, lean: 0 })

    window.addEventListener('pointermove', onMove)
    document.addEventListener('mouseleave', onLeave)
    wake()
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer.current)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Berkedip acak
  useEffect(() => {
    let t1
    let t2
    const loop = () => {
      t1 = setTimeout(() => {
        setBlink(true)
        t2 = setTimeout(() => setBlink(false), 150)
        loop()
      }, 2500 + Math.random() * 3500)
    }
    loop()
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // Sapaan pertama
  useEffect(() => {
    const t = setTimeout(() => show(pesan[0]), 1500)
    return () => {
      clearTimeout(t)
      clearTimeout(bubbleTimer.current)
    }
  }, [show])

  function onClick() {
    idx.current = (idx.current + 1) % pesan.length
    show(pesan[idx.current])
    setJump(true)
    setTimeout(() => setJump(false), 600)
  }

  const happy = hover || jump
  const closed = !happy && (sleepy || blink)

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <style>{css}</style>

      {bubble && (
        <div
          role="status"
          className="kindy-pop absolute bottom-full left-2 mb-2 w-52 bg-white rounded-2xl px-4 py-3 text-sm text-ink shadow-[0_8px_30px_rgba(42,40,56,0.15)] border border-ink/5"
        >
          {bubble.t}
          {bubble.to && (
            <Link to={bubble.to} className="block mt-1 font-semibold text-primary hover:underline">
              {bubble.label}
            </Link>
          )}
          <span className="absolute -bottom-1.5 left-8 w-3 h-3 bg-white rotate-45 border-r border-b border-ink/5" />
        </div>
      )}

      <button
        ref={ref}
        type="button"
        onClick={onClick}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        aria-label="Kindy, maskot KindSpace. Klik untuk menyapa."
        className={`block w-24 md:w-32 cursor-pointer select-none rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
          jump ? 'kindy-jump' : 'kindy-float'
        }`}
      >
        <svg viewBox="0 0 200 210" className="w-full h-auto overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="kindyBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#A397FB" />
              <stop offset="1" stopColor="#7B6CF6" />
            </linearGradient>
          </defs>

          {/* bayangan */}
          <ellipse cx="100" cy="203" rx="52" ry="6" fill={INK} opacity="0.12" />

          {/* seluruh badan condong ke arah kursor */}
          <g
            style={{
              transform: `rotate(${look.lean * 6}deg)`,
              transformOrigin: '100px 190px',
              transition: 'transform .25s ease-out',
            }}
          >
            {/* kaki */}
            <ellipse cx="75" cy="188" rx="19" ry="8" fill="#6A5BE0" />
            <ellipse cx="125" cy="188" rx="19" ry="8" fill="#6A5BE0" />

            {/* lengan kiri */}
            <ellipse cx="20" cy="128" rx="10" ry="17" fill="#6A5BE0" />
            {/* lengan kanan: melambai saat hover */}
            <g
              className={happy ? 'kindy-wave' : ''}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 12%' }}
            >
              <ellipse cx="180" cy="128" rx="10" ry="17" fill="#6A5BE0" />
            </g>

            {/* badan */}
            <path
              d="M100 22 C150 22 182 58 182 108 C182 158 152 186 100 186 C48 186 18 158 18 108 C18 58 50 22 100 22 Z"
              fill="url(#kindyBody)"
            />
            <ellipse
              cx="62"
              cy="54"
              rx="18"
              ry="9"
              fill="#fff"
              opacity="0.25"
              transform="rotate(-30 62 54)"
            />

            {/* hati kecil di kepala, senada dengan logo */}
            <path
              d="M100 30 C84 20 90 6 100 14 C110 6 116 20 100 30 Z"
              fill={PEACH}
              transform="rotate(12 100 22)"
            />

            {/* wajah: bergeser sedikit ke arah kursor */}
            <g
              style={{
                transform: `translate(${look.x * 5}px, ${look.y * 4}px)`,
                transition: 'transform .12s ease-out',
              }}
            >
              {/* pipi */}
              <ellipse cx="50" cy="122" rx="11" ry="7" fill={PEACH} opacity={happy ? 0.95 : 0.65} />
              <ellipse cx="150" cy="122" rx="11" ry="7" fill={PEACH} opacity={happy ? 0.95 : 0.65} />

              {/* mata */}
              {happy ? (
                <>
                  <path d="M58 101 Q72 84 86 101" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <path d="M114 101 Q128 84 142 101" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
                </>
              ) : closed ? (
                <>
                  <path d="M58 98 Q72 107 86 98" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <path d="M114 98 Q128 107 142 98" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
                </>
              ) : (
                [72, 128].map((cx) => (
                  <g key={cx}>
                    <circle cx={cx} cy="98" r="17" fill="#fff" />
                    <g
                      style={{
                        transform: `translate(${look.x * 6}px, ${look.y * 6}px)`,
                        transition: 'transform .08s ease-out',
                      }}
                    >
                      <circle cx={cx} cy="98" r="8.5" fill={INK} />
                      <circle cx={cx - 3} cy="94.5" r="3" fill="#fff" />
                    </g>
                  </g>
                ))
              )}

              {/* mulut */}
              {happy ? (
                <>
                  <path d="M86 123 Q100 150 114 123 Z" fill={INK} />
                  <ellipse cx="100" cy="132" rx="7" ry="4" fill="#FF9F8A" />
                </>
              ) : sleepy ? (
                <ellipse cx="100" cy="131" rx="4" ry="3.5" fill={INK} />
              ) : (
                <path d="M90 128 Q100 137 110 128" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              )}
            </g>
          </g>

          {/* zzz saat mengantuk */}
          {sleepy && !happy && (
            <g fill={INK} fontWeight="700" fontFamily="inherit">
              <text className="kindy-zzz" x="150" y="40" fontSize="22">z</text>
              <text className="kindy-zzz" x="166" y="24" fontSize="16" style={{ animationDelay: '.7s' }}>z</text>
            </g>
          )}
        </svg>
      </button>
    </div>
  )
}
