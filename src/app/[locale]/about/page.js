import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { CheckCircle2, Award, Users, TrendingUp, Leaf, Globe, Shield } from 'lucide-react'
import { placeholder } from '@/lib/utils'

export const metadata = { title: 'About Us | PT Palm Trade Company' }

function AboutPage() {
  const t = useTranslations('about')

  const values = [
    { icon: Shield, title: 'Quality First', desc: 'Every coconut goes through strict quality inspection before shipment.' },
    { icon: Globe, title: 'Global Reach', desc: 'Serving buyers in Thailand, China, India and expanding to new markets.' },
    { icon: Users, title: 'Farmer Partnership', desc: 'We work directly with local farmers for stable and ethical sourcing.' },
    { icon: TrendingUp, title: 'Reliable Supply', desc: '± 2,800 tons per month production capacity ensuring consistent supply.' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 bg-brand-darker overflow-hidden">
        <div className="absolute inset-0">
          <Image src={placeholder(1920, 600, 'About+Hero')} alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-darker/90 to-brand-darker/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">{t('title')}</h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <Image src={placeholder(800, 600, 'Company+Story')} alt="Our Story" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-brand-dark mb-6">Our Story</h2>
              <div className="flex flex-col gap-4 text-gray-600 leading-relaxed">
                <p>{t('description1')}</p>
                <p>{t('description2')}</p>
                <p>{t('description3')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[t('feature1'), t('feature2'), t('feature3'), t('feature4')].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center">
                <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-brand-muted" />
                </div>
                <h3 className="font-semibold text-brand-dark mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { val: '2,800+', label: t('stat1') },
              { val: '200+', label: t('stat2') },
              { val: '10+', label: t('stat3') },
              { val: '5+', label: t('stat4') },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-bold text-brand-green">{val}</p>
                <p className="text-gray-400 text-sm mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
