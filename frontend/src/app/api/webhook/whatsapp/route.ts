import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Inisialisasi AI dan Database
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// FUNGSI GET: Untuk Verifikasi Webhook Meta WhatsApp
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Akses Ditolak' }, { status: 403 })
}

// FUNGSI POST: Menerima & Memproses Pesan WhatsApp
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Cek apakah payload berasal dari pesan WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'Bukan pesan WA' }, { status: 200 })
    }

    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const messageInfo = changes?.value?.messages?.[0]

    // Jika tidak ada pesan teks masuk, abaikan
    if (!messageInfo || messageInfo.type !== 'text') {
      return NextResponse.json({ status: 'Pesan diabaikan' }, { status: 200 })
    }

    const senderPhone = messageInfo.from // Nomor WA pengirim
    const incomingText = messageInfo.text.body // Isi chat pengguna

    //  Panggil AI untuk Ekstraksi Data (NLP)
    const extractedData = await extractIntentWithAI(incomingText)
    
    // Asumsi: Kita hardcode user_id untuk testing. 
    // Di produksi, kita cari user_id berdasarkan senderPhone di database.
    const TEST_USER_ID = "MASUKKAN_USER_ID_KAMU_DISINI" 
    
    let replyMessage = "Maaf, Memoris belum paham maksud pesanmu. Coba format lain ya!"

    //  Simpan ke Database berdasarkan Niat (Intent)
    if (extractedData.intent === 'add_contact') {
      const { name, phone } = extractedData.data
      
      const { error } = await supabaseAdmin.from('contacts').insert({
        user_id: TEST_USER_ID,
        name: name,
        whatsapp: phone,
      })

      if (!error) {
        replyMessage = `✅ Berhasil! Kontak *${name}* (${phone}) telah ditambahkan ke Memoris.`
      } else {
        replyMessage = `❌ Gagal menyimpan kontak. Error: ${error.message}`
      }
    } 
    else if (extractedData.intent === 'add_event') {
      const { title, date, time } = extractedData.data
      
      // Simpan ke tabel events (asumsi tabel ini sudah kamu buat)
      const { error } = await supabaseAdmin.from('events').insert({
        user_id: TEST_USER_ID,
        title: title,
        date: date,
        time: time,
      })

      if (!error) {
        replyMessage = `🗓️ Mantap! Jadwal *${title}* pada tanggal ${date} jam ${time} sudah masuk kalender.`
      } else {
        replyMessage = `❌ Gagal menyimpan jadwal. Error: ${error.message}`
      }
    }

    // C. Kirim Balasan ke WhatsApp Pengguna
    await sendWhatsAppReply(senderPhone, replyMessage)

    return NextResponse.json({ status: 'Berhasil diproses' }, { status: 200 })
  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// FUNGSI HELPER: Ekstraksi AI & Kirim Pesan Meta API
// Fungsi mengekstrak maksud pengguna memakai Google Gemini AI
async function extractIntentWithAI(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  
  const prompt = `
    Kamu adalah asisten sistem cerdas bernama Memoris.
    Tugasmu mengekstrak maksud (intent) dari pesan pengguna menjadi format JSON MURNI tanpa markdown.
    
    Teks masuk: "${text}"
    
    Jika pengguna ingin menyimpan nomor/teman, intent = "add_contact".
    Jika pengguna ingin membuat jadwal/acara, intent = "add_event".
    Jika tidak jelas, intent = "unknown".

    Format JSON yang diwajibkan:
    {
      "intent": "add_contact" | "add_event" | "unknown",
      "data": {
        "name": "nama orang (untuk kontak)",
        "phone": "nomor WA (untuk kontak, ubah ke format awal 62...)",
        "title": "judul acara (untuk event)",
        "date": "tanggal YYYY-MM-DD (jika dibilang besok, perkirakan tanggalnya)",
        "time": "waktu HH:MM"
      }
    }
  `

  const result = await model.generateContent(prompt)
  const responseText = result.response.text()
  
  // Bersihkan backticks markdown jika AI mengembalikannya
  const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
  return JSON.parse(cleanJson)
}

// Fungsi membalas pesan via Meta API
async function sendWhatsAppReply(to: string, message: string) {
  const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`
  
  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    })
  })
}