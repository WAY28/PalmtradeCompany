// Format tanggal
export function formatDate(dateString, locale = 'id') {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Slug generator
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Truncate text
export function truncate(text, length = 120) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// WhatsApp link
export const WHATSAPP_NUMBER = '6282293807717'
export function getWhatsAppLink(message = '') {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

// Class names helper
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Placeholder image
export function placeholder(w = 800, h = 600, text = '') {
  const t = encodeURIComponent(text || `${w}x${h}`)
  return `https://placehold.co/${w}x${h}/1a2e05/a4dc4a?text=${t}&font=playfair-display`
}
