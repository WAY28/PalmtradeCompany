'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/utils'

export default function ContactSection() {
  const t = useTranslations('contact')
  const locale = useLocale()

  const [form, setForm] = useState({ name: '', email: '', company: '', country: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', company: '', country: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-all'

  return (
    <section id="contact" className="section-padding bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left info */}
          <div>
            <div className="badge-pill w-fit">{t('badge')}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-gray-400 mb-10 leading-relaxed">{t('subtitle')}</p>

            <div className="flex flex-col gap-6">
              {/* WhatsApp */}
              <a
                href={getWhatsAppLink("Hello PT Palm Trade Company, I'm interested in your coconut products.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-green/50 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} className="text-brand-dark" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t('whatsapp')}</p>
                  <p className="text-brand-green text-sm mt-0.5">+62 822-9380-7717</p>
                </div>
              </a>

              {/* Phone */}
              <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('phone')}</p>
                  <p className="text-white font-semibold">+62 822-9380-7717</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('emailLabel')}</p>
                  <p className="text-white font-semibold">info@palmtradecompany.com</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('address')}</p>
                  <p className="text-white font-semibold">{t('addressValue')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="bg-white rounded-3xl p-8">
            {status === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle2 size={56} className="text-brand-green mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-brand-dark mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">{t('success')}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 bg-brand-green text-brand-dark font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-brand-yellow transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-display font-bold text-xl text-brand-dark mb-2">Send a Message</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                      {t('name')} *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder={t('namePlaceholder')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                      {t('email')} *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder={t('emailPlaceholder')}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                      {t('company')}
                    </label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder={t('companyPlaceholder')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                      {t('country')}
                    </label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder={t('countryPlaceholder')}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">
                    {t('message')} *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder={t('messagePlaceholder')}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm">{t('error')}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-brand-green text-brand-dark font-bold py-3.5 rounded-full text-sm hover:bg-brand-yellow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send size={15} />
                  {status === 'sending' ? t('sending') : t('send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
