import { getTranslations } from 'next-intl/server'
import GallerySection from '@/components/sections/GallerySection'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { placeholder } from '@/lib/utils'

export const metadata = { title: 'Gallery | PT Palm Trade Company' }

export default async function GalleryPage() {
  const t = await getTranslations('gallery')
  let images = []
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase.from('gallery').select('*').order('sort_order')
    images = data || []
  } catch {}

  return (
    <>
      <section className="relative py-32 bg-brand-darker overflow-hidden">
        <div className="absolute inset-0">
          <Image src={placeholder(1920, 600, 'Gallery+Hero')} alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-darker/90 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">{t('title')}</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>
      <GallerySection images={images} />
    </>
  )
}
