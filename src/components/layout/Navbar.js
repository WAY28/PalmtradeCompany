'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import { Menu, X, Leaf } from 'lucide-react'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/gallery`, label: t('gallery') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/team`, label: t('team') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  const isActive = (href) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center">
            <Leaf size={18} className="text-brand-dark" />
          </div>
          <div>
            <span
              className={`font-display font-bold text-lg leading-none block ${
                scrolled ? 'text-brand-dark' : 'text-white'
              }`}
            >
              Palm Trade
            </span>
            <span className="text-[10px] text-brand-green font-medium tracking-wider uppercase leading-none">
              Company
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-brand-green'
                  : scrolled
                  ? 'text-gray-700 hover:text-brand-green'
                  : 'text-white/90 hover:text-brand-green'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Language + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher scrolled={scrolled} />
          <Link
            href={`/${locale}/contact`}
            className="bg-brand-green text-brand-dark text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-yellow transition-colors"
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className={`lg:hidden p-2 rounded-md ${scrolled ? 'text-brand-dark' : 'text-white'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-brand-light text-brand-dark font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between">
              <LanguageSwitcher scrolled={true} />
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMenuOpen(false)}
                className="bg-brand-green text-brand-dark text-sm font-semibold px-5 py-2 rounded-full"
              >
                Get Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
