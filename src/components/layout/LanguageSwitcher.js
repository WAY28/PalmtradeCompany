'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher({ scrolled = false }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale) => {
    // Replace current locale prefix in path
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1 border border-white/20 rounded-full px-1 py-1">
      <Globe
        size={13}
        className={scrolled ? 'text-gray-500 ml-1' : 'text-white/70 ml-1'}
      />
      {['id', 'en'].map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all uppercase ${
            locale === lang
              ? 'bg-brand-green text-brand-dark'
              : scrolled
              ? 'text-gray-500 hover:text-brand-dark'
              : 'text-white/80 hover:text-white'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}
