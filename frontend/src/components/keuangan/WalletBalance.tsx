// src/components/keuangan/WalletBalance.tsx
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

export default function WalletBalance({ initialData }: { initialData?: any[] }) {
  // Jika data gagal ditarik atau kosong
  if (!initialData || initialData.length < 2) {
    return (
      <div className="flex flex-col h-full">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          SALDO BULAN INI
        </h3>
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Data belum tersedia.
        </div>
      </div>
    )
  }

  // 2. Persiapkan Variabel Kalkulasi
  const headers = initialData[0]
  // Baris 1: ["Tanggal", "Keterangan", "Dompet", "Masuk", "Keluar", "Anggaran"]
  // Mencari index kolom (antisipasi kalau kolomnya tergeser di Excel)
  const dompetIdx = headers.indexOf('Dompet') > -1 ? headers.indexOf('Dompet') : 2
  const masukIdx = headers.indexOf('Masuk') > -1 ? headers.indexOf('Masuk') : 3
  const keluarIdx = headers.indexOf('Keluar') > -1 ? headers.indexOf('Keluar') : 4

  const balances: Record<string, number> = {}
  let totalSaldo = 0

  // 3. Looping data mulai dari baris ke-2 (index 1)
  for (let i = 1; i < initialData.length; i++) {
    const row = initialData[i]
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
    <div className="flex flex-col h-full">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
        SALDO BULAN INI
      </h3>
      
      {/* Total Saldo */}
      <div className="text-center mb-8">
        <h2 className={`text-4xl font-extrabold tracking-tight ${totalSaldo < 0 ? 'text-red-600' : 'text-[#4A5D4E]'}`}>
          {formatRupiah(totalSaldo)}
        </h2>
      </div>

      {/* List per Dompet */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-4">
          {Object.entries(balances).map(([name, balance]) => (
            // Tampilkan dompet
            <div key={name} className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-600">{name}</span>
              <span className={balance < 0 ? 'text-red-500' : 'text-slate-800'}>
                {formatRupiah(balance)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}