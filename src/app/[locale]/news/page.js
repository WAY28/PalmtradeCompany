import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { placeholder, formatDate, truncate } from '@/lib/utils'

export const metadata = { title: 'News | PT Palm Trade Company' }

export default async function NewsPage({ params }) {
  const { locale } = await params
  const t = await getTranslations('news')
  let posts = []
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('posts')
      .select('id,slug,title_id,title_en,excerpt_id,excerpt_en,image_url,created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    posts = data || []
  } catch {}

  const PLACEHOLDER_POSTS = [
    { id: '1', slug: 'indonesia-coconut-supplier', title_en: 'Indonesia Coconut Supplier for Global Buyers', title_id: 'Pemasok Kelapa Indonesia untuk Pembeli Global', excerpt_en: 'Indonesia is known as one of the largest coconut producers in the world.', excerpt_id: 'Indonesia dikenal sebagai salah satu produsen kelapa terbesar di dunia.', image_url: placeholder(600, 400, 'News+1'), created_at: '2026-03-29T00:00:00Z' },
    { id: '2', slug: 'semi-husked-export', title_en: 'Coconut Semi Husked from Indonesia for Global Export', title_id: 'Kelapa Semi Husked dari Indonesia untuk Ekspor Global', excerpt_en: 'Today, many international buyers are looking for semi husked coconut from Indonesia.', excerpt_id: 'Kini banyak pembeli internasional mencari kelapa semi husked dari Indonesia.', image_url: placeholder(600, 400, 'News+2'), created_at: '2026-02-20T00:00:00Z' },
    { id: '3', slug: 'global-demand-growth', title_en: 'Global Demand for Indonesian Semi Husked Coconut Grows', title_id: 'Permintaan Global Kelapa Semi Husked Indonesia Meningkat', excerpt_en: 'In recent years, the demand for Indonesian semi husked coconut has continued to increase.', excerpt_id: 'Permintaan kelapa semi husked Indonesia terus meningkat dalam beberapa tahun terakhir.', image_url: placeholder(600, 400, 'News+3'), created_at: '2026-01-15T00:00:00Z' },
  ]

  const data = posts.length > 0 ? posts : PLACEHOLDER_POSTS

  return (
    <>
      <section className="relative py-32 bg-brand-darker overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={placeholder(1920, 600, 'News+Hero')} alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">{t('title')}</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post) => {
              const title = locale === 'id' ? post.title_id : post.title_en
              const excerpt = locale === 'id' ? post.excerpt_id : post.excerpt_en
              return (
                <Link
                  key={post.id}
                  href={`/${locale}/news/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover block"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={post.image_url || placeholder(600, 400)} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                      <Calendar size={12} />
                      {formatDate(post.created_at, locale)}
                    </div>
                    <h2 className="font-display font-bold text-brand-dark text-lg leading-snug mb-3 line-clamp-2 group-hover:text-brand-muted transition-colors">{title}</h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{truncate(excerpt, 100)}</p>
                    <span className="inline-flex items-center gap-1.5 text-brand-muted text-sm font-semibold group-hover:gap-3 transition-all">
                      {t('readMore')} <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
