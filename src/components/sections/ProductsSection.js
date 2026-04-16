'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Phone, ArrowRight, CheckCircle2, Download } from 'lucide-react'
import { placeholder, getWhatsAppLink } from '@/lib/utils'

const PRODUCTS = [
  {
    key: 'thailand',
    flag: '🇹🇭',
    image: placeholder(600, 400, 'Thailand+Coconut'),
    accentColor: 'from-blue-500 to-blue-700',
    specs: [
      { key: 'quality', value: 'Export Premium (Thailand Standard)' },
      { key: 'weight', value: '0.8 – 1.2 Kg per coconut' },
      { key: 'color', value: 'Natural Brown Shell' },
      { key: 'husk', value: 'Semi Husked' },
      { key: 'packaging', value: 'Nett Bag (export packing)' },
      { key: 'capacity', value: '± 2,800 Tons per Month' },
      { key: 'price', value: 'Negotiable with buyers' },
    ],
    documents: [
      'Phytosanitary Certificate',
      'Certificate of Origin (Form E – ACFTA)',
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading (B/L)',
    ],
  },
  {
    key: 'china',
    flag: '🇨🇳',
    image: placeholder(600, 400, 'China+Coconut'),
    accentColor: 'from-red-500 to-red-700',
    specs: [
      { key: 'weight', value: '1.0 – 1.4 Kg per coconut' },
      { key: 'husk', value: 'Semi Husked' },
      { key: 'condition', value: 'Non-germinated, clean shell, export ready' },
      { key: 'packaging', value: 'Nett Bag (export packing)' },
      { key: 'capacity', value: '± 2,800 Tons per Month' },
      { key: 'price', value: 'Negotiable with buyers' },
    ],
    documents: [
      'GACC Registration (China Customs)',
      'Phytosanitary Certificate',
      'Certificate of Origin (Form E – ACFTA)',
      'Commercial Invoice & Packing List',
      'Bill of Lading (B/L)',
      'Export Declaration (PEB Indonesia)',
    ],
  },
  {
    key: 'india',
    flag: '🇮🇳',
    image: placeholder(600, 400, 'India+Coconut'),
    accentColor: 'from-orange-500 to-orange-700',
    specs: [
      { key: 'weight', value: '0.9 – 1.3 Kg per coconut' },
      { key: 'husk', value: 'Semi Husked' },
      { key: 'condition', value: 'Non-germinated, clean shell, export ready' },
      { key: 'packaging', value: 'Nett Bag (export packing)' },
      { key: 'capacity', value: '± 2,800 Tons per Month' },
      { key: 'price', value: 'Negotiable with buyers' },
    ],
    documents: [
      'Phytosanitary Certificate',
      'Certificate of Origin (COO)',
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading (B/L)',
    ],
  },
]

export default function ProductsSection({ products = [] }) {
  const t = useTranslations('products')
  const locale = useLocale()
  const [active, setActive] = useState(0)

  // Use DB data if available, else fallback to static
  const data = products.length > 0 ? products : PRODUCTS

  const current = data[active] || PRODUCTS[active]

  const specLabels = {
    quality: t('specQuality'),
    weight: t('specWeight'),
    color: t('specColor'),
    husk: t('specHusk'),
    condition: t('specCondition'),
    packaging: t('specPackaging'),
    capacity: t('specCapacity'),
    price: t('specPrice'),
  }

  const marketLabels = [t('thailand'), t('china'), t('india')]

  return (
    <section id="products" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Market tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {PRODUCTS.map((product, i) => (
            <button
              key={product.key}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                active === i
                  ? 'bg-brand-green text-brand-dark shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-green hover:text-brand-dark'
              }`}
            >
              <span className="text-lg">{product.flag}</span>
              {marketLabels[i]}
            </button>
          ))}
        </div>

        {/* Product detail */}
        <div className="grid lg:grid-cols-2 gap-10 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
            <Image
              src={PRODUCTS[active].image}
              alt={`Coconut ${PRODUCTS[active].key}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-3xl">{PRODUCTS[active].flag}</span>
              <h3 className="text-white font-display font-bold text-2xl mt-1">
                {marketLabels[active]}
              </h3>
              <p className="text-gray-300 text-sm">Semi Husked Coconut — Export Grade</p>
            </div>
          </div>

          {/* Specs */}
          <div className="p-8 flex flex-col">
            <h4 className="font-semibold text-brand-dark mb-4 text-sm uppercase tracking-wider">
              Specifications
            </h4>
            <table className="spec-table mb-6">
              <tbody>
                {PRODUCTS[active].specs.map(({ key, value }) => (
                  <tr key={key}>
                    <td>{specLabels[key] || key}</td>
                    <td className="text-gray-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Documents */}
            <div className="mb-6">
              <h4 className="font-semibold text-brand-dark mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                {t('documents')}
              </h4>
              <div className="flex flex-col gap-2">
                {PRODUCTS[active].documents.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={13} className="text-brand-green flex-shrink-0" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-auto">
              <a
                href={getWhatsAppLink(`Hello, I'm interested in coconut supply for ${PRODUCTS[active].key} market`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-brand-green text-brand-dark font-bold px-5 py-3 rounded-full text-sm text-center hover:bg-brand-yellow transition-all flex items-center justify-center gap-2"
              >
                <Phone size={15} />
                {t('ctaContact')}
              </a>
              <Link
                href={`/${locale}/products`}
                className="border-2 border-brand-green text-brand-dark font-semibold px-5 py-3 rounded-full text-sm hover:bg-brand-green transition-all flex items-center gap-2"
              >
                <ArrowRight size={15} />
                Detail
              </Link>
            </div>
          </div>
        </div>

        {/* Download catalog */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-6 py-3 rounded-full hover:border-brand-green hover:text-brand-dark transition-all">
            <Download size={15} />
            {t('downloadCatalog')}
          </button>
        </div>
      </div>
    </section>
  )
}
