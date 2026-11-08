// Membuat kode booking, contoh: KS-7F3K9A
export function generateKode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `KS-${out}`
}