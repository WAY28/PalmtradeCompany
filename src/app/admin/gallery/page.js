'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2, Images } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import FormModal from '@/components/admin/FormModal'
import ImageUpload from '@/components/ui/ImageUpload'

const EMPTY = { image_url: '', caption_id: '', caption_en: '', category: 'product', sort_order: 0 }
const CATEGORIES = ['product', 'process', 'export']

export default function AdminGalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('all')

  const supabase = getSupabaseClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('gallery').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(null) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.image_url) return alert('Please upload an image first.')
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('gallery').update(form).eq('id', editing.id)
      } else {
        await supabase.from('gallery').insert(form)
      }
      await load()
      closeModal()
    } catch (err) {
      alert('Error saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!confirm(`Delete this image?`)) return
    setDeleting(item.id)
    try {
      // Remove from storage
      if (item.image_url?.includes('palmtrade-images')) {
        const path = item.image_url.split('/palmtrade-images/')[1]
        if (path) await supabase.storage.from('palmtrade-images').remove([path])
      }
      await supabase.from('gallery').delete().eq('id', item.id)
      await load()
    } finally {
      setDeleting(null)
    }
  }

  const displayed = filter === 'all' ? items : items.filter((i) => i.category === filter)

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product and process photos</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-green text-brand-dark font-semibold px-5 py-2.5 rounded-full hover:bg-brand-yellow transition-all text-sm"
        >
          <Plus size={16} />
          Add Image
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filter === cat
                ? 'bg-brand-green text-brand-dark'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-green'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-brand-green animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Images size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No images yet. Add your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.image_url}
                  alt={item.caption_en || ''}
                  fill
                  className="object-cover"
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-brand-green transition-colors"
                  >
                    <Pencil size={14} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.id}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    {deleting === item.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} className="text-gray-700" />
                    }
                  </button>
                </div>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted bg-brand-light px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                {item.caption_en && (
                  <p className="text-xs text-gray-500 mt-1.5 truncate">{item.caption_en}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <FormModal
        open={modal}
        onClose={closeModal}
        title={editing ? 'Edit Image' : 'Add New Image'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            folder="gallery"
            label="Image *"
          />

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                Caption (Indonesia)
              </label>
              <input
                value={form.caption_id}
                onChange={(e) => setForm((f) => ({ ...f, caption_id: e.target.value }))}
                placeholder="Keterangan gambar"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                Caption (English)
              </label>
              <input
                value={form.caption_en}
                onChange={(e) => setForm((f) => ({ ...f, caption_en: e.target.value }))}
                placeholder="Image caption"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-brand-green text-brand-dark font-semibold text-sm hover:bg-brand-yellow transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : editing ? 'Update Image' : 'Add Image'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  )
}