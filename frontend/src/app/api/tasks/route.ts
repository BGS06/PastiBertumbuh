import { NextResponse } from 'next/server'

// Wajib: Matikan cache untuk file API ini agar selalu real-time
export const dynamic = 'force-dynamic'

// MASUKKAN URL WEB APP DARI "MASTER CENTER" YANG TERBARU DI SINI
const SPREADSHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwwd7-Kkvl3vXEvlu3FdDzs2Pkh2M6eD0GNCprdAh93HK4PZFx661UFyiK-XgTIdkE3/exec' 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gid = searchParams.get('gid')
    const targetUrl = gid ? `${SPREADSHEET_WEB_APP_URL}?gid=${gid}` : SPREADSHEET_WEB_APP_URL

    // Gunakan cache: 'no-store' agar selalu tarik data segar
    const res = await fetch(targetUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const text = await res.text()
    const data = text ? JSON.parse(text) : []
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API GET Error]:', error.message)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(SPREADSHEET_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
      redirect: 'follow',
      cache: 'no-store' // Wajib agar perintah eksekusi tidak di-cache
    })

    const rawText = await res.text()
    const data = rawText ? JSON.parse(rawText) : {}
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API POST Error]:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}