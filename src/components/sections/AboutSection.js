import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ArrowRight, Award, Users, TrendingUp, Leaf } from 'lucide-react'
import { placeholder } from '@/lib/utils'

export default function AboutSection() {
  const t = useTranslations('about')
  const locale = useLocale()

  const features = [
    { icon: Award, label: t('feature1') },
    { icon: CheckCircle2, label: t('feature2') },
    { icon: TrendingUp, label: t('feature3') },
    { icon: Users, label: t('feature4') },
  ]

  const stats = [
    { value: '50+', label: t('stat1') },
    { value: '200+', label: t('stat2') },
    { value: '10+', label: t('stat3') },
    { value: '5+', label: t('stat4') },
  ]

  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <Image
                src={placeholder(800, 600, 'Coconut+Farm')}
                alt="Palm Trade Company"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/40 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center">
                  <Leaf size={22} className="text-brand-dark" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-dark">2,800+</p>
                  <p className="text-xs text-gray-500 font-medium">Tons / Month</p>
                </div>
              </div>
            </div>

            {/* Accent box */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-brand-green/20 border-2 border-brand-green/30 -z-10" />
          </div>

          {/* Content side */}
          <div>
            <div className="badge-pill w-fit">{t('badge')}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark leading-tight mb-6">
              {t('title')}
            </h2>
            <div className="flex flex-col gap-4 mb-8">
              <p className="text-gray-600 leading-relaxed">{t('description1')}</p>
              <p className="text-gray-600 leading-relaxed">{t('description2')}</p>
              <p className="text-gray-600 leading-relaxed">{t('description3')}</p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-brand-light/50 border border-brand-green/20"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-brand-muted" />
                  </div>
                  <span className="text-sm font-medium text-brand-dark">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 bg-brand-green text-brand-dark font-bold px-7 py-3.5 rounded-full hover:bg-brand-yellow transition-all text-sm"
            >
              Learn More
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 p-8 bg-brand-dark rounded-3xl">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl font-bold text-brand-green">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
