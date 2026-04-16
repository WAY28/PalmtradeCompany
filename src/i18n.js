import { getRequestConfig } from 'next-intl/server'

export const locales = ['id', 'en']
export const defaultLocale = 'id'

export default getRequestConfig(async ({ requestLocale }) => {
  // Await requestLocale (bersifat async di v3+)
  let locale = await requestLocale

  // Fallback ke default jika locale tidak valid
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale
  }

  return {
    locale, // WAJIB dikembalikan di v3+
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})