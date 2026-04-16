'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import FormModal from '@/components/admin/FormModal'
import ImageUpload from '@/components/ui/ImageUpload'
import DataTable from '@/components/admin/DataTable'

const EMPTY = {
  market: 'Thailand',
  weight_range: '',
  husk_type: 'Semi Husked',
  condition: 'Non-germinated, clean shell, export ready',
  packaging: 'Nett Bag (export packing)',
  capacity: '± 2,800 Tons per Month',
  price: 'Negotiable with buyers',
  contact: '082293807717',
  quality: '',
  color: '',
  documents: [],
  image_url: '',
  is_active: true,
  sort_order: 0,
}

const MARKETS = ['Thailand', 'China', 'India']

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [docsInput, setDocsInput] = useState('')

  const supabase = getSupabaseClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('sort_order')
    setProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setEditing(null); setForm(EMPTY)
    setDocsInput('')
    setModal(true)
  }
  const openEdit = (p) => {
    setEditing(p); setForm({ ...p })
    setDocsInput((p.documents || []).join('\n'))
    setModal(true)
  }
  const closeModal = () => { setModal(false); setEditing(null) }
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    const docs = docsInput.split('\n').map((d) => d.trim()).filter(Boolean)
    const payload = { ...form, documents: docs }
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('products').update(payload).eq('id', editing.id)
      } else {
        const { id, ...p } = payload
        await supabase.from('products').insert(p)
      }
      await load(); closeModal()
    } catch { alert('Error saving.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (product) => {
    if (!confirm(`Delete ${product.market} product?`)) return
    setDeleting(product.id)
    try {
      await supabase.from('products').delete().eq('id', product.id)
      await load()
    } finally { setDeleting(null) }
  }

  const MARKET_FLAGS = { Thailand: '🇹🇭', China: '🇨🇳', India: '🇮🇳' }

  const columns = [
    {
      key: 'market', label: 'Market',
      render: (val) => (
        <span className="flex items-center gap-2 font-medium text-gray-800">
          <span className="text-lg">{MARKET_FLAGS[val]}</span> {val}
        </span>
      ),
    },
    { key: 'weight_range', label: 'Weight', render: (val) => <span className="text-gray-600 text-sm">{val}</span> },
    { key: 'capacity', label: 'Capacity', render: (val) => <span className="text-gray-600 text-sm">{val}</span> },
    {
      key: 'is_active', label: 'Status', width: '90px',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {val ? 'Active' : 'Hidden'}
        </span>
      ),
    },
  ]

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage coconut product specifications</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-green text-brand-dark font-semibold px-5 py-2.5 rounded-full hover:bg-brand-yellow transition-all text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-brand-green animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={products} searchKey="market" searchPlaceholder="Search market..."
          actions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => openEdit(row)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-brand-light">
                <Pencil size={13} className="text-gray-600" />
              </button>
              <button onClick={() => handleDelete(row)} disabled={deleting === row.id} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100">
                {deleting === row.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} className="text-gray-600" />}
              </button>
            </div>
          )}
        />
      )}

      <FormModal open={modal} onClose={closeModal} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <ImageUpload value={form.image_url} onChange={(url) => set('image_url', url)} folder="products" label="Product Image" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Market *</label>
              <select value={form.market} onChange={(e) => set('market', e.target.value)} className={inputClass}>
                {MARKETS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Weight Range *</label>
              <input value={form.weight_range} onChange={(e) => set('weight_range', e.target.value)} required placeholder="e.g. 0.8 – 1.2 Kg" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Quality</label>
              <input value={form.quality} onChange={(e) => set('quality', e.target.value)} placeholder="Export Premium" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Color</label>
              <input value={form.color} onChange={(e) => set('color', e.target.value)} placeholder="Natural Brown Shell" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Condition</label>
            <input value={form.condition} onChange={(e) => set('condition', e.target.value)} placeholder="Non-germinated, clean shell..." className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Packaging</label>
              <input value={form.packaging} onChange={(e) => set('packaging', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Capacity</label>
              <input value={form.capacity} onChange={(e) => set('capacity', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Price</label>
              <input value={form.price} onChange={(e) => set('price', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Contact</label>
              <input value={form.contact} onChange={(e) => set('contact', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
              Export Documents <span className="text-gray-400 normal-case font-normal">(one per line)</span>
            </label>
            <textarea
              value={docsInput}
              onChange={(e) => setDocsInput(e.target.value)}
              rows={5}
              placeholder="Phytosanitary Certificate&#10;Certificate of Origin&#10;Commercial Invoice&#10;Bill of Lading (B/L)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 resize-none"
            />
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
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  )
}
