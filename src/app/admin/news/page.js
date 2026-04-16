'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Calendar } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import FormModal from '@/components/admin/FormModal'
import ImageUpload from '@/components/ui/ImageUpload'
import DataTable from '@/components/admin/DataTable'
import { slugify, formatDate, placeholder } from '@/lib/utils'

const EMPTY = {
  title_id: '', title_en: '',
  slug: '',
  excerpt_id: '', excerpt_en: '',
  content_id: '', content_en: '',
  image_url: '',
  is_published: false,
}

export default function AdminNewsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [tab, setTab] = useState('id') // 'id' | 'en'

  // ✅ Dipindahkan ke dalam fungsi, tidak di level komponen
  const load = useCallback(async () => {
    setLoading(true)
    const supabase = getSupabaseClient()
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setTab('id'); setModal(true) }
  const openEdit = (post) => { setEditing(post); setForm({ ...post }); setTab('id'); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(null) }

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleTitleEn = (val) => {
    set('title_en', val)
    if (!editing) set('slug', slugify(val))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title_id || !form.title_en) return alert('Both titles are required.')
    if (!form.slug) return alert('Slug is required.')
    setSaving(true)
    const supabase = getSupabaseClient()
    try {
      const payload = { ...form, updated_at: new Date().toISOString() }
      if (editing) {
        await supabase.from('posts').update(payload).eq('id', editing.id)
      } else {
        delete payload.id
        await supabase.from('posts').insert(payload)
      }
      await load()
      closeModal()
    } catch (err) {
      alert('Error saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title_en}"?`)) return
    setDeleting(post.id)
    const supabase = getSupabaseClient()
    try {
      await supabase.from('posts').delete().eq('id', post.id)
      await load()
    } finally {
      setDeleting(null)
    }
  }

  const togglePublish = async (post) => {
    const supabase = getSupabaseClient()
    await supabase.from('posts').update({ is_published: !post.is_published }).eq('id', post.id)
    await load()
  }

  const columns = [
    {
      key: 'image_url',
      label: '',
      width: '60px',
      render: (val) => (
        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image src={val || placeholder(120, 90, 'Post')} alt="" fill className="object-cover" />
        </div>
      ),
    },
    {
      key: 'title_en',
      label: 'Title',
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-800 line-clamp-1">{val}</p>
          <p className="text-xs text-gray-400 mt-0.5">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'is_published',
      label: 'Status',
      width: '100px',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {val ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      width: '120px',
      render: (val) => (
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar size={11} />
          {formatDate(val, 'en')}
        </span>
      ),
    },
  ]

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green'
  const taClass = inputClass + ' resize-none'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">News & Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-green text-brand-dark font-semibold px-5 py-2.5 rounded-full hover:bg-brand-yellow transition-all text-sm"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-brand-green animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          searchKey="title_en"
          searchPlaceholder="Search posts..."
          actions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => togglePublish(row)}
                title={row.is_published ? 'Unpublish' : 'Publish'}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-brand-light transition-colors"
              >
                {row.is_published
                  ? <EyeOff size={13} className="text-gray-600" />
                  : <Eye size={13} className="text-gray-600" />
                }
              </button>
              <button
                onClick={() => openEdit(row)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-brand-light transition-colors"
              >
                <Pencil size={13} className="text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(row)}
                disabled={deleting === row.id}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100 transition-colors"
              >
                {deleting === row.id
                  ? <Loader2 size={13} className="animate-spin text-gray-400" />
                  : <Trash2 size={13} className="text-gray-600" />
                }
              </button>
            </div>
          )}
        />
      )}

      <FormModal open={modal} onClose={closeModal} title={editing ? 'Edit Post' : 'New Post'} size="xl">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <ImageUpload
            value={form.image_url}
            onChange={(url) => set('image_url', url)}
            folder="news"
            label="Featured Image"
          />

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Slug *</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="post-slug-url" className={inputClass} />
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              {[{ key: 'id', label: '🇮🇩 Indonesia' }, { key: 'en', label: '🇬🇧 English' }].map((l) => (
                <button key={l.key} type="button" onClick={() => setTab(l.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === l.key ? 'bg-brand-green text-brand-dark' : 'bg-gray-100 text-gray-600'}`}>
                  {l.label}
                </button>
              ))}
            </div>

            {tab === 'id' ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Title (ID) *</label>
                  <input value={form.title_id} onChange={(e) => set('title_id', e.target.value)} required placeholder="Judul artikel" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Excerpt (ID)</label>
                  <textarea value={form.excerpt_id} onChange={(e) => set('excerpt_id', e.target.value)} rows={3} placeholder="Ringkasan singkat..." className={taClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Content (ID) — HTML allowed</label>
                  <textarea value={form.content_id} onChange={(e) => set('content_id', e.target.value)} rows={8} placeholder="<p>Isi artikel...</p>" className={taClass} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Title (EN) *</label>
                  <input value={form.title_en} onChange={(e) => handleTitleEn(e.target.value)} required placeholder="Article title" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Excerpt (EN)</label>
                  <textarea value={form.excerpt_en} onChange={(e) => set('excerpt_en', e.target.value)} rows={3} placeholder="Short summary..." className={taClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Content (EN) — HTML allowed</label>
                  <textarea value={form.content_en} onChange={(e) => set('content_en', e.target.value)} rows={8} placeholder="<p>Article content...</p>" className={taClass} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-700">Published</p>
              <p className="text-xs text-gray-400">Visible to website visitors</p>
            </div>
            <button
              type="button"
              onClick={() => set('is_published', !form.is_published)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.is_published ? 'bg-brand-green' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_published ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-full bg-brand-green text-brand-dark font-semibold text-sm hover:bg-brand-yellow disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  )
}