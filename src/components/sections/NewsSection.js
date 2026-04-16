import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { placeholder, formatDate, truncate } from '@/lib/utils'

const PLACEHOLDER_POSTS = [
  {
    id: '1',
    slug: 'indonesia-coconut-supplier-global-market',
    title_id: 'Pemasok Kelapa Indonesia untuk Pembeli Global',
    title_en: 'Indonesia Coconut Supplier for Global Coconut Buyers',
    excerpt_id: 'Indonesia dikenal sebagai salah satu produsen kelapa terbesar di dunia. Banyak pembeli internasional mencari pemasok kelapa terpercaya dari Indonesia.',
    excerpt_en: 'Indonesia is known as one of the largest coconut producers in the world. Many international buyers search for reliable coconut suppliers from Indonesia.',
    image_url: placeholder(600, 400, 'News+1'),
    created_at: '2026-03-29T00:00:00Z',
  },
  {
    id: '2',
    slug: 'coconut-semi-husked-from-indonesia',
    title_id: 'Kelapa Semi Husked dari Indonesia untuk Pasar Ekspor Global',
    title_en: 'Coconut Semi Husked from Indonesia for Global Export Market',
    excerpt_id: 'Indonesia dikenal sebagai salah satu produsen kelapa terbesar di dunia. Saat ini, banyak pembeli internasional sedang mencari kelapa semi husked dari Indonesia.',
    excerpt_en: 'Indonesia is widely known as one of the largest coconut producers in the world. Today, many international buyers are looking for semi husked coconut from Indonesia.',
    image_url: placeholder(600, 400, 'News+2'),
    created_at: '2026-02-20T00:00:00Z',
  },
  {
    id: '3',
    slug: 'global-demand-indonesian-semi-husked-coconut',
    title_id: 'Permintaan Global untuk Kelapa Semi Husked Indonesia Terus Tumbuh',
    title_en: 'Global Demand for Indonesian Semi Husked Coconut Continues to Grow',
    excerpt_id: 'Indonesia adalah salah satu produsen kelapa terbesar di dunia. Dalam beberapa tahun terakhir, permintaan kelapa semi husked Indonesia terus meningkat.',
    excerpt_en: 'Indonesia is one of the largest coconut producers in the world. In recent years, the demand for Indonesian semi husked coconut has continued to increase.',
    image_url: placeholder(600, 400, 'News+3'),
    created_at: '2026-01-15T00:00:00Z',
  },
]

export default function NewsSection({ posts = [] }) {
  const t = useTranslations('news')
  const locale = useLocale()

  const data = posts.length > 0 ? posts : PLACEHOLDER_POSTS

  return (
    <section id="news" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="badge-pill w-fit">{t('badge')}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark">
              {t('title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-brand-muted font-semibold text-sm hover:text-brand-dark transition-colors flex-shrink-0"
          >
            See All <ArrowRight size={15} />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {data.slice(0, 3).map((post, i) => {
            const title = locale === 'id' ? post.title_id : post.title_en
            const excerpt = locale === 'id' ? post.excerpt_id : post.excerpt_en
            return (
              <Link
                key={post.id}
                href={`/${locale}/news/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover block"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image_url || placeholder(600, 400, 'News')}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                    <Calendar size={12} />
                    {formatDate(post.created_at, locale)}
                  </div>
                  <h3 className="font-display font-bold text-brand-dark text-lg leading-snug mb-3 line-clamp-2 group-hover:text-brand-muted transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {truncate(excerpt, 100)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-brand-muted text-sm font-semibold group-hover:gap-2.5 transition-all">
                    {t('readMore')} <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
