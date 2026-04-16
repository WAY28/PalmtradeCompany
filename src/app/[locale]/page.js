import { createServerSupabaseClient } from '@/lib/supabaseServer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProductsSection from '@/components/sections/ProductsSection'
import GallerySection from '@/components/sections/GallerySection'
import NewsSection from '@/components/sections/NewsSection'
import TeamSection from '@/components/sections/TeamSection'
import ContactSection from '@/components/sections/ContactSection'

export const metadata = {
  title: 'PT Palm Trade Company | Indonesian Coconut Exporter',
  description: 'Trusted semi husked coconut exporter from Indonesia for Thailand, China, and India markets.',
}

export default async function HomePage() {
  let products = [], gallery = [], posts = [], team = []
  try {
    const supabase = await createServerSupabaseClient()
    const [p, g, n, tm] = await Promise.all([
      supabase.from('products').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('gallery').select('*').order('sort_order').limit(6),
      supabase.from('posts').select('id,slug,title_id,title_en,excerpt_id,excerpt_en,image_url,created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
      supabase.from('team').select('*').eq('is_active', true).order('sort_order'),
    ])
    products = p.data || []
    gallery = g.data || []
    posts = n.data || []
    team = tm.data || []
  } catch {}

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductsSection products={products} />
      <GallerySection images={gallery} />
      <NewsSection posts={posts} />
      <TeamSection team={team} />
      <ContactSection />
    </>
  )
}
