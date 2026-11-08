// Coretan SVG ringan untuk nuansa buku harian. Warna mengikuti text-* (currentColor).

export function Sparkle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.9 7 3.6 10.9 12 12-8.4 1.1-11.1 5-12 12-.9-7-3.6-10.9-12-12C8.4 10.9 11.1 7 12 0Z" />
    </svg>
  )
}

export function HeartDoodle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

// Panah melengkung, ujungnya menunjuk ke atas
export function ArrowCurve({ className = '' }) {
  return (
    <svg
      viewBox="0 0 40 44"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 40C8 36 6 20 13 6" />
      <path d="M13 6L5 17M13 6L23 13" />
    </svg>
  )
}

// Garis bergelombang pendek, untuk menghias di bawah judul bagian
export function Squiggle({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 7c8-8 14-8 22 0s14 8 22 0 14-8 22 0 14 8 22 0 14-8 24-1" />
    </svg>
  )
}

// Pembatas bergelombang antar-bagian. Warnanya mengikuti text-* induknya.
export function Wave({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={`block w-full h-14 md:h-20 ${className}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 46C160 96 320 0 520 38S860 86 1060 40 1340 10 1440 44V90H0Z" />
    </svg>
  )
}

export function Tape({ className = '' }) {
  return <span className={`tape ${className}`} aria-hidden="true" />
}
