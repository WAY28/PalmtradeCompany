'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import FormModal from '@/components/admin/FormModal'
import ImageUpload from '@/components/ui/ImageUpload'
import DataTable from '@/components/admin/DataTable'
import { placeholder } from '@/lib/utils'

const EMPTY = { name: '', role_id: '', role_en: '', photo_url: '', social_url: '', sort_order: 0, is_active: true }

export default function AdminTeamPage() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const supabase = getSupabaseClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('team').select('*').order('sort_order')
    setTeam(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (m) => { setEditing(m); setForm({ ...m }); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(null) }
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.role_en) return alert('Name and role are required.')
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('team').update(form).eq('id', editing.id)
      } else {
        const { id, ...payload } = form
        await supabase.from('team').insert(payload)
      }
      await load(); closeModal()
    } catch { alert('Error saving.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (member) => {
    if (!confirm(`Delete ${member.name}?`)) return
    setDeleting(member.id)
    try {
      await supabase.from('team').delete().eq('id', member.id)
      await load()
    } finally { setDeleting(null) }
  }

  const columns = [
    {
      key: 'photo_url', label: '', width: '60px',
      render: (val, row) => (
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
          <Image src={val || placeholder(80, 80, row.name)} alt="" fill className="object-cover" />
        </div>
      ),
    },
    { key: 'name', label: 'Name', render: (val) => <span className="font-medium text-gray-800">{val}</span> },
    {
      key: 'role_en', label: 'Role',
      render: (val, row) => (
        <div>
          <p className="text-gray-700 text-sm">{val}</p>
          <p className="text-gray-400 text-xs">{row.role_id}</p>
        </div>
      ),
    },
    {
      key: 'is_active', label: 'Status', width: '90px',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {val ? 'Active' : 'Hidden'}
        </span>
      ),
    },
    { key: 'sort_order', label: 'Order', width: '70px', render: (val) => <span className="text-gray-400 text-sm">{val}</span> },
  ]

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">{team.length} members</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-green text-brand-dark font-semibold px-5 py-2.5 rounded-full hover:bg-brand-yellow transition-all text-sm">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-brand-green animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={team} searchKey="name" searchPlaceholder="Search members..."
          actions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => openEdit(row)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-brand-light transition-colors">
                <Pencil size={13} className="text-gray-600" />
              </button>
              <button onClick={() => handleDelete(row)} disabled={deleting === row.id} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100 transition-colors">
                {deleting === row.id ? <Loader2 size={13} className="animate-spin text-gray-400" /> : <Trash2 size={13} className="text-gray-600" />}
              </button>
            </div>
          )}
        />
      )}

      <FormModal open={modal} onClose={closeModal} title={editing ? 'Edit Member' : 'Add Team Member'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <ImageUpload value={form.photo_url} onChange={(url) => set('photo_url', url)} folder="team" label="Profile Photo" />

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Full Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Enter full name" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Role (ID) *</label>
              <input value={form.role_id} onChange={(e) => set('role_id', e.target.value)} required placeholder="Jabatan" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Role (EN) *</label>
              <input value={form.role_en} onChange={(e) => set('role_en', e.target.value)} required placeholder="Position" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Social URL</label>
            <input value={form.social_url} onChange={(e) => set('social_url', e.target.value)} placeholder="https://instagram.com/..." className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div className="flex items-end pb-0.5">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-full">
                <span className="text-sm text-gray-700 flex-1">Active</span>
                <button type="button" onClick={() => set('is_active', !form.is_active)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? 'bg-brand-green' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-full bg-brand-green text-brand-dark font-semibold text-sm hover:bg-brand-yellow disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Member'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  )
}
