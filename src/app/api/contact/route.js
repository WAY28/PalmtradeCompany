import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseServer'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, company, country, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('contacts').insert({ name, email, company, country, message })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
