'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react'
import { placeholder } from '@/lib/utils'

export default function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()

  const markets = [
    {
      key: 'thailand',
      flag: '🇹🇭',
      label: 'Thailand',
      spec: '0.8–1.2 Kg',
      color: 'from-blue-600 to-blue-800',
    },
    {
      key: 'china',
      flag: '🇨🇳',
      label: 'China',
      spec: '1.0–1.4 Kg',
      color: 'from-red-600 to-red-800',
    },
    {
      key: 'india',
      flag: '🇮🇳',
      label: 'India',
      spec: '0.9–1.3 Kg',
      color: 'from-orange-500 to-orange-700',
    },
  ]

  const stats = [
    { value: '2,800+', label: t('stat1Label'), unit: t('stat1') },
    { value: '3', label: t('stat2Label'), unit: t('stat2') },
    { value: '5+', label: t('stat3Label'), unit: t('stat3') },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-darker">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={placeholder(1920, 1080, 'Coconut+Plantation')}
          alt="Coconut plantation"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-darker/95 via-brand-darker/80 to-transparent" />
      </div>

      {/* Decorative dots */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #a4dc4a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="badge-pill w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-dark inline-block" />
              {t('badge')}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t('title')}{' '}
              <span className="text-gradient">{t('titleHighlight')}</span>
              <br />
              {t('titleEnd')}
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {t('subtitle')}
            </p>

            {/* Features */}
            <div className="flex flex-col gap-2 mb-8">
              {[
                'Export-grade quality guaranteed',
                'Complete export documentation',
                '± 2,800 tons/month capacity',
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle2 size={15} className="text-brand-green flex-shrink-0" />
                  {feat}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/products`}
                className="bg-brand-green text-brand-dark font-bold px-7 py-3.5 rounded-full hover:bg-brand-yellow transition-all flex items-center gap-2 text-sm"
              >
                {t('ctaPrimary')}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-full hover:border-brand-green hover:text-brand-green transition-all text-sm"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Right: Market cards */}
          <div className="flex flex-col gap-4">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">
              Available Markets
            </p>
            {markets.map((market, i) => (
              <Link
                key={market.key}
                href={`/${locale}/products`}
                className="group bg-white/5 border border-white/10 hover:border-brand-green/50 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-5 transition-all hover:bg-white/10"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-3xl">{market.flag}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold">{market.label} Market</p>
                  <p className="text-gray-400 text-sm">Semi Husked Coconut • {market.spec}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-green text-xs font-medium">Export Ready</p>
                  <ArrowRight
                    size={16}
                    className="text-gray-500 group-hover:text-brand-green mt-1 ml-auto transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left">
              <p className="text-3xl sm:text-4xl font-bold text-gradient font-display">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.unit}</p>
              <p className="text-sm text-gray-300 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-brand-green transition-colors animate-bounce"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  )
}
