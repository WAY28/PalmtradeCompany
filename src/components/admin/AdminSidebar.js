'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Images, Newspaper,
  Users, MessageSquare, Leaf, ExternalLink
} from 'lucide-react'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/news', label: 'News / Posts', icon: Newspaper },
  { href: '/admin/team', label: 'Our Team', icon: Users },
  { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (link) => {
    if (link.exact) return pathname === link.href
    return pathname.startsWith(link.href)
  }

  return (
    <aside className="w-64 bg-brand-darker border-r border-white/10 flex flex-col min-h-screen flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
            <Leaf size={16} className="text-brand-dark" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Palm Trade</p>
            <p className="text-brand-green text-[10px] uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {LINKS.map((link) => {
          const Icon = link.icon
          const active = isActive(link)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-green text-brand-dark'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* View site */}
      <div className="px-3 pb-6">
        <Link
          href="/id"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/10 transition-all"
        >
          <ExternalLink size={16} />
          View Website
        </Link>
      </div>
    </aside>
  )
}
