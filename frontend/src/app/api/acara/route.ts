import { NextResponse } from 'next/server'

// Mematikan cache agar data acara selalu ditarik secara real-time
export const dynamic = 'force-dynamic'

// GANTI DENGAN URL WEB APP HASIL DEPLOY "NEW VERSION" & "ANYONE"
const SPREADSHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwwd7-Kkvl3vXEvlu3FdDzs2Pkh2M6eD0GNCprdAh93HK4PZFx661UFyiK-XgTIdkE3/exec' 

export async function GET(request: Request) {
  try {
    // Memaksa parameter sheet=Acara agar Apps Script menarik data dari tab Acara
    const targetUrl = `${SPREADSHEET_WEB_APP_URL}?sheet=Acara`

    const res = await fetch(targetUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const rawText = await res.text()

    // Pertahanan: Jika responsnya berupa halaman web HTML, cegah error JSON parsing
    if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
      console.error('❌ [API GET Acara]: Akses ditolak oleh Google. Apps Script mengembalikan HTML. Pastikan opsi "Who has access" disetel ke "Anyone" (Siapa saja) saat deploy.')
      return NextResponse.json({ success: false, error: 'Akses Web App diblokir oleh Google.' }, { status: 502 })
    }

    const data = rawText ? JSON.parse(rawText) : []
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('❌ [API GET Acara Error]:', error.message)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const res = await fetch(SPREADSHEET_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // Harus text/plain agar tidak terkena blokir CORS dari Google
      body: JSON.stringify(body),
      redirect: 'follow', // Wajib follow karena Google Apps Script melakukan pengalihan (redirect 302)
      cache: 'no-store'
    })

    const rawText = await res.text()

    // Pertahanan: Jika responsnya berupa halaman web HTML, cegah error JSON parsing
    if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
      console.error('❌ [API POST Acara]: Akses ditolak oleh Google. Apps Script mengembalikan HTML. Pastikan opsi "Who has access" disetel ke "Anyone" (Siapa saja) saat deploy.')
      return NextResponse.json({ success: false, error: 'Akses Web App diblokir oleh Google. Cek deployment Apps Script.' }, { status: 502 })
    }

    const data = rawText ? JSON.parse(rawText) : {}
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('❌ [API POST Acara Error]:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}