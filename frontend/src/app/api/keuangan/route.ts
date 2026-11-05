import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GANTI DENGAN URL WEB APP YANG SAMA DENGAN SEBELUMNYA
const SPREADSHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwwd7-Kkvl3vXEvlu3FdDzs2Pkh2M6eD0GNCprdAh93HK4PZFx661UFyiK-XgTIdkE3/exec' 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    // Otomatis menangkap nama tab dari URL web (default: Sisa Saldo)
    const tabName = searchParams.get('tab') || 'Sisa Saldo' 
    
    // Panggil Apps Script dengan parameter sheet
    const targetUrl = `${SPREADSHEET_WEB_APP_URL}?sheet=${encodeURIComponent(tabName)}`

    const res = await fetch(targetUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const rawText = await res.text()

    if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
      console.error('❌ Akses ditolak oleh Google. Apps Script mengembalikan HTML.')
      return NextResponse.json({ success: false, error: 'Akses Web App diblokir.' }, { status: 502 })
    }

    const data = rawText ? JSON.parse(rawText) : []
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('❌ [API GET Keuangan Error]:', error.message)
    return NextResponse.json([], { status: 500 })
  }
}