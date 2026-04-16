'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, X, ZoomIn } from 'lucide-react'
import { placeholder } from '@/lib/utils'

const PLACEHOLDER_IMAGES = [
  { id: 1, image_url: placeholder(600, 450, 'Coconut+Product+1'), caption_en: 'Semi Husked Coconut', category: 'product' },
  { id: 2, image_url: placeholder(600, 450, 'Sorting+Process'), caption_en: 'Sorting Process', category: 'process' },
  { id: 3, image_url: placeholder(600, 450, 'Export+Packaging'), caption_en: 'Export Packaging', category: 'export' },
  { id: 4, image_url: placeholder(600, 450, 'Coconut+Farm'), caption_en: 'Coconut Farm', category: 'product' },
  { id: 5, image_url: placeholder(600, 450, 'Quality+Control'), caption_en: 'Quality Control', category: 'process' },
  { id: 6, image_url: placeholder(600, 450, 'Container+Loading'), caption_en: 'Container Loading', category: 'export' },
]

export default function GallerySection({ images = [] }) {
  const t = useTranslations('gallery')
  const locale = useLocale()
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  const data = images.length > 0 ? images : PLACEHOLDER_IMAGES

  const filters = [
    { key: 'all', label: t('all') },
    { key: 'product', label: t('product') },
    { key: 'process', label: t('process') },
    { key: 'export', label: t('export') },
  ]

  const filtered = activeFilter === 'all' ? data : data.filter((img) => img.category === activeFilter)

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.key
                  ? 'bg-brand-green text-brand-dark shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-brand-light hover:text-brand-dark'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.slice(0, 6).map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setLightbox(img)}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 hover:shadow-xl transition-all"
            >
              <Image
                src={img.image_url}
                alt={img.caption_en || img.caption_id || ''}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-darker/0 group-hover:bg-brand-darker/50 transition-all flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {img.caption_en && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-brand-darker/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">{img.caption_en}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* See all */}
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/gallery`}
            className="inline-flex items-center gap-2 border-2 border-brand-green text-brand-dark font-semibold px-7 py-3 rounded-full hover:bg-brand-green transition-all text-sm"
          >
            <ArrowRight size={15} />
            See All Photos
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-white hover:text-brand-green"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <div className="relative max-w-3xl w-full aspect-video">
            <Image
              src={lightbox.image_url}
              alt={lightbox.caption_en || ''}
              fill
              className="object-contain"
            />
          </div>
          {lightbox.caption_en && (
            <p className="absolute bottom-6 text-white text-sm text-center">{lightbox.caption_en}</p>
          )}
        </div>
      )}
    </section>
  )
}
