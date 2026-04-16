import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Leaf, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  const navLinks = [
    { href: `/${locale}`, label: nav('home') },
    { href: `/${locale}/about`, label: nav('about') },
    { href: `/${locale}/products`, label: nav('products') },
    { href: `/${locale}/gallery`, label: nav('gallery') },
    { href: `/${locale}/news`, label: nav('news') },
    { href: `/${locale}/team`, label: nav('team') },
    { href: `/${locale}/contact`, label: nav('contact') },
  ]

  return (
    <footer className="bg-brand-darker text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center">
                <Leaf size={20} className="text-brand-dark" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white block leading-none">
                  Palm Trade
                </span>
                <span className="text-[10px] text-brand-green font-medium tracking-widest uppercase">
                  Company
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              {t('description')}
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a
                href="https://wa.me/6282293807717"
                className="flex items-center gap-2 hover:text-brand-green transition-colors"
              >
                <Phone size={14} />
                +62 822-9380-7717
              </a>
              <a
                href="mailto:info@palmtradecompany.com"
                className="flex items-center gap-2 hover:text-brand-green transition-colors"
              >
                <Mail size={14} />
                info@palmtradecompany.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} />
                Indonesia
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t('quickLinks')}
            </h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-brand-green transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-green inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t('products')}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              {['Thailand Market', 'China Market', 'India Market'].map((market) => (
                <li key={market}>
                  <Link
                    href={`/${locale}/products`}
                    className="hover:text-brand-green transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-green inline-block" />
                    {market}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold mt-8 mb-5 text-sm uppercase tracking-wider">
              {t('followUs')}
            </h4>
            <div className="flex gap-3">
              {[
                {
                  href: '#',
                  label: 'Facebook',
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  href: '#',
                  label: 'Instagram',
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  ),
                },
                {
                  href: '#',
                  label: 'YouTube',
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                    </svg>
                  ),
                },
              ].map(({ href, label, svg }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-green hover:text-brand-dark transition-all"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} PT Palm Trade Company. {t('rights')}</span>
          <Link href="#" className="hover:text-brand-green transition-colors">
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}