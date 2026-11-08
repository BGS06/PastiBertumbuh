import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

const SPREADSHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwwd7-Kkvl3vXEvlu3FdDzs2Pkh2M6eD0GNCprdAh93HK4PZFx661UFyiK-XgTIdkE3/exec'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const targetUrl = `${SPREADSHEET_WEB_APP_URL}?sheet=Acara`
    const res = await fetch(targetUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    
    const rawText = await res.text()
    if (rawText.trim().startsWith('<')) throw new Error("Menerima format HTML")

    const allData = JSON.parse(rawText)
    
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
    console.error('[API Acara Error]:', error.message)
    return NextResponse.json([], { status: 500 })
  }
}