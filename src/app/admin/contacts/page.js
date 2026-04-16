'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Mail, Trash2, Eye, CheckCheck, MessageSquare } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import FormModal from '@/components/admin/FormModal'
import DataTable from '@/components/admin/DataTable'
import { formatDate, getWhatsAppLink } from '@/lib/utils'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('all')

  const getSupabase = useCallback(() => getSupabaseClient(), [])

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = getSupabase()
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setContacts(data || [])
    setLoading(false)
  }, [getSupabase])

  useEffect(() => { load() }, [load])

  const viewContact = async (contact) => {
    setViewing(contact)
    if (!contact.is_read) {
      const supabase = getSupabase()
      await supabase.from('contacts').update({ is_read: true }).eq('id', contact.id)
      setContacts((prev) => prev.map((c) => c.id === contact.id ? { ...c, is_read: true } : c))
    }
  }

  const handleDelete = async (contact) => {
    if (!confirm(`Delete message from ${contact.name}?`)) return
    setDeleting(contact.id)
    try {
      const supabase = getSupabase()
      await supabase.from('contacts').delete().eq('id', contact.id)
      await load()
    } finally { setDeleting(null) }
  }

  const markAllRead = async () => {
    const supabase = getSupabase()
    await supabase.from('contacts').update({ is_read: true }).eq('is_read', false)
    await load()
  }

  const filtered = filter === 'all' ? contacts
    : filter === 'unread' ? contacts.filter((c) => !c.is_read)
    : contacts.filter((c) => c.is_read)

  const unreadCount = contacts.filter((c) => !c.is_read).length

  const columns = [
    {
      key: 'name', label: 'From',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {!row.is_read && <span className="w-2 h-2 rounded-full bg-brand-green flex-shrink-0" />}
          <div>
            <p className={`text-sm ${row.is_read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>{val}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'company', label: 'Company', render: (val) => <span className="text-gray-500 text-sm">{val || '—'}</span> },
    { key: 'country', label: 'Country', render: (val) => <span className="text-gray-500 text-sm">{val || '—'}</span> },
    {
      key: 'message', label: 'Message',
      render: (val) => <span className="text-gray-500 text-sm line-clamp-1 max-w-xs">{val}</span>,
    },
    {
      key: 'created_at', label: 'Date', width: '110px',
      render: (val) => <span className="text-xs text-gray-400">{formatDate(val, 'id')}</span>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {contacts.length} total • {unreadCount > 0 && <span className="text-brand-muted font-medium">{unreadCount} unread</span>}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-full hover:border-brand-green transition-all">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: `All (${contacts.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: `Read (${contacts.length - unreadCount})` },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.key ? 'bg-brand-green text-brand-dark' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-green'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-brand-green animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={filtered} searchKey="name" searchPlaceholder="Search by name..."
          actions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => viewContact(row)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-brand-light transition-colors" title="View message">
                <Eye size={13} className="text-gray-600" />
              </button>
              <button onClick={() => handleDelete(row)} disabled={deleting === row.id} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100 transition-colors">
                {deleting === row.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} className="text-gray-600" />}
              </button>
            </div>
          )}
        />
      )}

      <FormModal open={!!viewing} onClose={() => setViewing(null)} title="Message Detail">
        {viewing && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Name</p>
                <p className="font-semibold text-gray-800">{viewing.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <a href={`mailto:${viewing.email}`} className="text-brand-muted font-medium hover:underline">{viewing.email}</a>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Company</p>
                <p className="text-gray-700">{viewing.company || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Country</p>
                <p className="text-gray-700">{viewing.country || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Received</p>
                <p className="text-gray-700">{formatDate(viewing.created_at, 'id')}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Message</p>
              <div className="p-4 bg-brand-light/30 border border-brand-green/20 rounded-xl">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a href={`mailto:${viewing.email}?subject=Re: Palm Trade Company Inquiry`}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-green text-brand-dark font-semibold py-2.5 rounded-full text-sm hover:bg-brand-yellow transition-all">
                <Mail size={14} /> Reply via Email
              </a>
              <a href={getWhatsAppLink(`Hello ${viewing.name}, thank you for your inquiry about our coconut products.`)}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-green text-brand-dark font-semibold py-2.5 rounded-full text-sm hover:bg-brand-green transition-all">
                <MessageSquare size={14} /> WhatsApp
              </a>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  )
}