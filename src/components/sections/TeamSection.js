import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'

import { placeholder } from '@/lib/utils'

const PLACEHOLDER_TEAM = [
  { id: 1, name: 'Ari Sadhu', role_en: 'Marketing', role_id: 'Marketing', photo_url: placeholder(300, 300, 'Ari+Sadhu'), social_url: '#' },
  { id: 2, name: 'Ayu Sintyawati', role_en: 'Marketing', role_id: 'Marketing', photo_url: placeholder(300, 300, 'Ayu+S'), social_url: '#' },
  { id: 3, name: 'Budi Santoso', role_en: 'Export Manager', role_id: 'Manajer Ekspor', photo_url: placeholder(300, 300, 'Budi+S'), social_url: '#' },
  { id: 4, name: 'Dewi Rahayu', role_en: 'Quality Control', role_id: 'Kontrol Kualitas', photo_url: placeholder(300, 300, 'Dewi+R'), social_url: '#' },
]

export default function TeamSection({ team = [] }) {
  const t = useTranslations('team')
  const locale = useLocale()

  const data = team.length > 0 ? team : PLACEHOLDER_TEAM

  return (
    <section id="team" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.map((member) => (
            <div key={member.id} className="group text-center card-hover">
              {/* Photo */}
              <div className="relative mx-auto w-36 h-36 rounded-full overflow-hidden mb-4 ring-4 ring-gray-100 group-hover:ring-brand-green transition-all">
                <Image
                  src={member.photo_url || placeholder(300, 300, member.name)}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-brand-dark mb-1">{member.name}</h3>
              <p className="text-gray-500 text-sm mb-3">
                {locale === 'id' ? member.role_id : member.role_en}
              </p>
              {member.social_url && (
                <a
                  href={member.social_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-brand-green hover:text-brand-dark transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}