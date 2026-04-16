import { Bell, User } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">PT Palm Trade Company</p>
        <p className="text-gray-800 font-semibold text-sm">Admin Dashboard</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-light transition-colors">
          <Bell size={16} />
        </button>
        <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center">
          <User size={16} className="text-brand-dark" />
        </div>
      </div>
    </header>
  )
}
