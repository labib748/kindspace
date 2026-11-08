export const STATUS = ['menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan']

export function tanggalCantik(t) {
  if (!t) return '-'
  return new Date(t + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function tanggalPendek(t) {
  if (!t) return '-'
  return new Date(t + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
