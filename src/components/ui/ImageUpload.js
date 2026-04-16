'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export default function ImageUpload({ value, onChange, folder = 'general', label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.')
      return
    }

    setError('')
    setUploading(true)

    try {
      const supabase = getSupabaseClient()
      const ext = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('palmtrade-images')
        .upload(fileName, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('palmtrade-images').getPublicUrl(fileName)
      onChange(data.publicUrl)
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleRemove = async () => {
    if (!value) return
    try {
      const supabase = getSupabaseClient()
      const path = value.split('/palmtrade-images/')[1]
      if (path) await supabase.storage.from('palmtrade-images').remove([path])
    } catch {}
    onChange('')
  }

  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <div className="relative aspect-video">
            <Image src={value} alt="Uploaded" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
          >
            <X size={14} />
          </button>
          <p className="text-xs text-gray-400 px-3 py-2 truncate">{value.split('/').pop()}</p>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${uploading
              ? 'border-brand-green/50 bg-brand-light/30'
              : 'border-gray-200 hover:border-brand-green hover:bg-brand-light/20'
            }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-brand-green animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Drop image here or <span className="text-brand-muted">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
              <div className="flex items-center gap-2 bg-brand-green text-brand-dark text-xs font-semibold px-4 py-2 rounded-full">
                <Upload size={13} />
                Choose File
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}
