export async function kirimKeN8n(payload) {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    // Gagal kirim ke n8n tidak boleh membatalkan booking
    console.warn('n8n tidak terjangkau:', err)
  }
}