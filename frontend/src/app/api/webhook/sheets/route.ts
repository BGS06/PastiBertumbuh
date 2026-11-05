import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache' // Tambahan untuk sistem Cache Pintar

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secret, user_id, data, type } = body

    // Lapisan Keamanan: Pastikan yang mengirim data benar-benar Google Sheets milikmu
    if (secret !== 'PastiBertumbuh') {
      return NextResponse.json({ error: 'Akses Ditolak' }, { status: 401 })
    }

    // LOGIKA 1: REFRESH CACHE KEUANGAN (Dipicu dari tab "Riwayat Transaksi")
    if (type === 'finance') {
      revalidateTag('finance-data')
      return NextResponse.json({ success: true, message: 'Cache keuangan berhasil di-refresh!' })
    }

    // LOGIKA 2: SINKRONISASI ANGGOTA TIM (Dipicu dari tab "Anggota Tim")
    
    // Jika tidak ada data email yang dikirim (menghindari error baca data kosong)
    if (!data || !data.email) {
      return NextResponse.json({ error: 'Format data anggota tidak lengkap' }, { status: 400 })
    }

    // Inisialisasi Supabase dengan Service Role Key (Bypass RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Cek apakah email sudah ada di database
    const { data: existing } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('email', data.email)
      .eq('user_id', user_id)
      .single()

    if (existing) {
      // Jika email sudah ada, perbarui datanya
      await supabaseAdmin.from('team_members').update(data).eq('id', existing.id)
    } else {
      // Jika email baru, masukkan sebagai anggota baru
      await supabaseAdmin.from('team_members').insert({ ...data, user_id })
    }

    return NextResponse.json({ success: true, message: 'Sinkronisasi anggota otomatis berhasil!' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}