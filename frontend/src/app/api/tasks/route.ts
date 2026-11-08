import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

const SPREADSHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwwd7-Kkvl3vXEvlu3FdDzs2Pkh2M6eD0GNCprdAh93HK4PZFx661UFyiK-XgTIdkE3/exec'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const gid = searchParams.get('gid')
    const targetUrl = gid ? `${SPREADSHEET_WEB_APP_URL}?gid=${gid}` : SPREADSHEET_WEB_APP_URL

    const res = await fetch(targetUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    
    const text = await res.text()
    const allData = text ? JSON.parse(text) : []

    // Multi-tenant Filter Berdasarkan Email (Strict Mode)
    if (Array.isArray(allData) && allData.length > 1) {
      const headers = allData[0]
      const emailColIdx = headers.findIndex((h: string) => String(h).toLowerCase().includes('email'))
      
      if (emailColIdx !== -1) {
        const userRows = allData.slice(1).filter((row: any[]) => row[emailColIdx] === user.email)
        return NextResponse.json([headers, ...userRows])
      } else {
        return NextResponse.json([]) // Cegah kebocoran data
      }
    }
    return NextResponse.json([])
  } catch (error: any) {
    console.error('[API GET Tasks Error]:', error.message)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const body = await request.json()
    
    // Inject Email pengguna ke payload tugas baru 
    // agar Apps Script (atau n8n besok) tahu ini punya siapa.
    if (user && user.email) {
        body.email = user.email
    }

    const res = await fetch(SPREADSHEET_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
      redirect: 'follow',
      cache: 'no-store'
    })
    
    const rawText = await res.text()
    const data = rawText ? JSON.parse(rawText) : {}
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API POST Tasks Error]:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}