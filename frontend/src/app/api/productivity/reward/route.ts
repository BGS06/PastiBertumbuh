import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { totalPoints } = await request.json()
    
    // Logika Konversi: 1 Tugas Selesai = 2000 Rupiah (contoh kelipatan 2k)
    // Asumsi: totalPoints adalah jumlah tugas selesai yang baru ditarik dari spreadsheet
    const rewardRate = 2000
    const totalReward = totalPoints * rewardRate
    
    // Cek apakah mencapai threshold (misal kelipatan 5 tugas atau Rp 10.000)
    // Di sini kita trigger pop-up jika ada kelipatan
    const isMilestoneReached = totalPoints > 0 && totalPoints % 5 === 0 

    return NextResponse.json({ 
      totalPoints,
      totalReward,
      isMilestoneReached,
      message: isMilestoneReached 
        ? `Kamu sudah mendapatkan Rp ${new Intl.NumberFormat('id-ID').format(totalReward)} dari produktivitasmu!`
        : 'Terus bertumbuh!'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memproses reward' }, { status: 500 })
  }
}