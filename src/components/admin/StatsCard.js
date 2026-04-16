export default function StatsCard({ icon: Icon, label, value, color = 'green' }) {
  const colors = {
    green: 'bg-brand-light text-brand-muted',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-500',
  }
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  )
}
