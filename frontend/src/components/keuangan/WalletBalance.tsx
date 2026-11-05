// src/components/finance/WalletBalance.tsx

import { getFinanceData } from '@/app/dashboard/actions'
import { formatRupiah } from '@/utils/format'

// Map untuk mengubah inisial dari Excel menjadi nama dompet yang rapi
const dompetMap: Record<string, string> = {
  'B': 'BCA',
  'C': 'Cash',
  'G': 'Gopay',
  'M': 'Mandiri',
  'P': 'Plafon',
  'S': 'Shopeepay',
  'A': 'Ajaib'
}

export default async function WalletBalance() {
  // 1. Tarik data dari Google Sheets melalui actions.ts
  const rawData = await getFinanceData()

  // Jika data gagal ditarik atau kosong
  if (!rawData || rawData.length < 2) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-700">SALDO BULAN INI</h3>
        <p className="text-gray-500 text-sm mt-2">Data belum tersedia.</p>
      </div>
    )
  }

  // 2. Persiapkan Variabel Kalkulasi
  const headers = rawData[0] // Baris 1: ["Tanggal", "Keterangan", "Dompet", "Masuk", "Keluar", "Anggaran"]
  
  // Mencari index kolom (antisipasi kalau kolomnya tergeser di Excel)
  const dompetIdx = headers.indexOf('Dompet') > -1 ? headers.indexOf('Dompet') : 2
  const masukIdx = headers.indexOf('Masuk') > -1 ? headers.indexOf('Masuk') : 3
  const keluarIdx = headers.indexOf('Keluar') > -1 ? headers.indexOf('Keluar') : 4

  const balances: Record<string, number> = {}
  let totalSaldo = 0

  // 3. Looping data mulai dari baris ke-2 (index 1)
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i]
    
    // Lewati jika baris benar-benar kosong
    if (!row[dompetIdx] && !row[masukIdx] && !row[keluarIdx]) continue;

    const rawDompet = String(row[dompetIdx] || 'Lainnya').trim()
    const dompetName = dompetMap[rawDompet] || rawDompet // Ubah inisial jadi nama lengkap
    
    // Pastikan angka valid, kalau kosong jadikan 0
    const masuk = Number(row[masukIdx]) || 0
    const keluar = Number(row[keluarIdx]) || 0

    // Inisialisasi jika dompet belum ada di object balances
    if (!balances[dompetName]) {
      balances[dompetName] = 0
    }

    // Kalkulasi
    balances[dompetName] += masuk
    balances[dompetName] -= keluar
    totalSaldo += masuk
    totalSaldo -= keluar
  }

  // 4. Render UI
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-sm">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center mb-4">
        SALDO BULAN INI
      </h3>
      
      {/* Total Saldo */}
      <div className="text-center mb-6">
        <p className={`text-3xl font-extrabold ${totalSaldo < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
          {formatRupiah(totalSaldo)}
        </p>
      </div>

      <hr className="border-gray-200 mb-4" />

      {/* List per Dompet */}
      <div className="space-y-3">
        {Object.entries(balances).map(([name, balance]) => (
          // Hanya tampilkan jika saldonya tidak 0 (opsional, hapus kondisi ini kalau ingin saldo 0 tetap tampil)
          balance !== 0 && (
            <div key={name} className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">{name}</span>
              <span className={`font-semibold ${balance < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                {formatRupiah(balance)}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  )
}