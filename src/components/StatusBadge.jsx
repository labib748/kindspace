const gaya = {
  menunggu: 'bg-peach-soft text-[#C2603F]',
  dikonfirmasi: 'bg-primary-soft text-primary',
  selesai: 'bg-green-100 text-green-700',
  dibatalkan: 'bg-red-100 text-red-600',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
        gaya[status] ?? 'bg-ink/5 text-ink/60'
      }`}
    >
      {status}
    </span>
  )
}
