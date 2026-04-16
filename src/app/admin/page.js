import { createAdminClient } from '@/lib/supabaseServer'
import StatsCard from '@/components/admin/StatsCard'
import { Package, Images, Newspaper, Users, MessageSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  try {
    const supabase = createAdminClient()
    const [products, gallery, posts, team, contacts] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('gallery').select('id', { count: 'exact', head: true }),
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('team').select('id', { count: 'exact', head: true }),
      supabase.from('contacts').select('id', { count: 'exact', head: true }),
    ])
    const unread = await supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('is_read', false)
    return {
      products: products.count,
      gallery: gallery.count,
      posts: posts.count,
      team: team.count,
      contacts: contacts.count,
      unread: unread.count,
    }
  } catch {
    return {}
  }
}

async function getRecentContacts() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    return data || []
  } catch { return [] }
}

export default async function AdminDashboard() {
  const [stats, contacts] = await Promise.all([getStats(), getRecentContacts()])

  const cards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'green', href: '/admin/products' },
    { label: 'Gallery', value: stats.gallery, icon: Images, color: 'blue', href: '/admin/gallery' },
    { label: 'News Posts', value: stats.posts, icon: Newspaper, color: 'yellow', href: '/admin/news' },
    { label: 'Team Members', value: stats.team, icon: Users, color: 'green', href: '/admin/team' },
    { label: 'Total Messages', value: stats.contacts, icon: MessageSquare, color: 'blue', href: '/admin/contacts' },
    { label: 'Unread Messages', value: stats.unread, icon: TrendingUp, color: 'red', href: '/admin/contacts' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <StatsCard icon={card.icon} label={card.label} value={card.value} color={card.color} />
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">Recent Messages</h2>
          <Link href="/admin/contacts" className="text-brand-muted text-sm font-medium hover:underline">
            View All
          </Link>
        </div>

        {contacts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No messages yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Company</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Country</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-700">{c.name}</td>
                    <td className="py-3 px-2 text-gray-500">{c.company || '-'}</td>
                    <td className="py-3 px-2 text-gray-500">{c.country || '-'}</td>
                    <td className="py-3 px-2 text-gray-500">{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.is_read ? 'bg-gray-100 text-gray-500' : 'bg-brand-light text-brand-muted'}`}>
                        {c.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
