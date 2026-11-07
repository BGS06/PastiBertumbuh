'use client'
import React from 'react'

// Skema Warna Earth Tone untuk Grafik
const CATEGORIES_CONFIG = [
  { name: 'Konsumsi', color: '#4A5D4E' }, // Sage Green
  { name: 'Transportasi', color: '#8C7A6B' }, // Terakota/Coklat Muted
  { name: 'Tagihan', color: '#64748B' }, // Slate Muted
  { name: 'Bisnis', color: '#D4A373' }, // Earthy Orange/Khaki
  { name: 'Hiburan', color: '#BCA89F' }, // Warm Grey
  { name: 'Pendidikan', color: '#718096' }, // Cool Grey
  { name: 'Kesehatan', color: '#9CA3AF' }, // Light Grey
]

export default function FinanceChart({ rawData }: { rawData?: any[] }) {
  const categoryTotals: Record<string, number> = {
    Konsumsi: 0,
    Transportasi: 0,
    Tagihan: 0,
    Bisnis: 0,
    Hiburan: 0,
    Pendidikan: 0,
    Kesehatan: 0,
  }

  let totalPengeluaran = 0

  if (Array.isArray(rawData) && rawData.length > 1) {
    const headers = rawData[0].map((h: any) => String(h || '').trim().toLowerCase())
    
    let keluarIdx = headers.findIndex((h: string) => h.includes('keluar') || h.includes('pengeluaran'))
    let anggaranIdx = headers.findIndex((h: string) => h.includes('anggaran') || h.includes('kategori'))
    let keteranganIdx = headers.findIndex((h: string) => h.includes('keterangan'))

    // Fallback index kolom berdasarkan struktur spreadsheet
    if (keluarIdx === -1) keluarIdx = 4
    if (anggaranIdx === -1) anggaranIdx = 5
    if (keteranganIdx === -1) keteranganIdx = 1

    const rows = rawData.slice(1)

    rows.forEach((row) => {
      if (!row || row.length === 0) return

      const rawKeluar = row[keluarIdx]
      let amount = 0

      if (typeof rawKeluar === 'number') {
        amount = Math.abs(rawKeluar)
      } else if (typeof rawKeluar === 'string') {
        const cleanStr = rawKeluar.replace(/[^0-9.-]/g, '')
        amount = Math.abs(parseFloat(cleanStr) || 0)
      }

      const categoryFromAnggaran = String(row[anggaranIdx] || '').trim()
      const categoryFromKeterangan = String(row[keteranganIdx] || '').trim()
      
      let targetCategory = ''

      const matchedCategory = CATEGORIES_CONFIG.find(
        (c) => c.name.toLowerCase() === categoryFromAnggaran.toLowerCase() || categoryFromAnggaran.toLowerCase().includes(c.name.toLowerCase())
      )

      if (matchedCategory) {
        targetCategory = matchedCategory.name
      } else {
        const matchedFromKeterangan = CATEGORIES_CONFIG.find(
          (c) => categoryFromKeterangan.toLowerCase().includes(c.name.toLowerCase())
        )
        if (matchedFromKeterangan) {
          targetCategory = matchedFromKeterangan.name
        }
      }

      if (targetCategory && amount > 0) {
        categoryTotals[targetCategory] += amount
        totalPengeluaran += amount
      }
    })
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Cari nilai terbesar untuk batas skala atas Y-Axis
  const maxVal = Math.max(...Object.values(categoryTotals), 100000)
  const yTicks = [maxVal, maxVal * 0.75, maxVal * 0.5, maxVal * 0.25]

  // Tampilkan SEMUA kategori, meskipun 0, agar selaras dengan nama di bawahnya
  const activeCategories = CATEGORIES_CONFIG

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Kartu */}
      <div className="mb-6 flex justify-between items-end">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1F2937]">Pengeluaran Bulanan</h3>
            <p className="text-[13px] text-[#6B7280]">Berdasarkan kategori riwayat transaksi</p>
          </div>
          <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-xl font-extrabold text-red-500">{formatRupiah(totalPengeluaran)}</p>
          </div>
      </div>

      {/* DIAGRAM BATANG */}
      {/* PERBAIKAN: Memberikan min-height tetap dan relative positioning yang kuat */}
      <div className="relative min-h-[220px] w-full mt-4 flex items-end justify-between pb-8">
          
          {/* Garis Grid Horizontal & Y-Axis */}
          <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0 pointer-events-none">
              {yTicks.map((tick, i) => (
              <div key={i} className="relative w-full border-t border-[#EFECE3] border-dashed">
                  <span className="absolute -top-3 left-0 text-[10px] text-[#9CA3AF] bg-white pr-2">
                  {formatRupiah(tick)}
                  </span>
              </div>
              ))}
              <div className="relative w-full border-t border-[#EFECE3]">
                  <span className="absolute -top-3 left-0 text-[10px] text-[#9CA3AF] bg-white pr-2">Rp 0</span>
              </div>
          </div>

          {/* Batang Diagram */}
          {/* PERBAIKAN: Mengatur height 100% dari container dan memposisikan batang di bawah */}
          <div className="absolute inset-0 pb-8 pl-16 z-10 w-full h-full flex items-end justify-around">
              {activeCategories.map((cat) => {
                const amount = categoryTotals[cat.name] || 0
                const heightPercent = maxVal > 0 ? (amount / maxVal) * 100 : 0
                
                return (
                    // Container batang diatur full height untuk layouting
                    <div key={cat.name} className="relative h-full flex flex-col justify-end items-center group w-12 cursor-pointer">
                    
                      {/* Tooltip */}
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1F2937] text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                          <span className="font-bold">{cat.name}</span><br />
                          {formatRupiah(amount)}
                      </div>
                      
                      {/* Bar (Batang Grafik) */}
                      {/* PERBAIKAN: Menambahkan min-height agar tidak lenyap jika nilainya kecil */}
                      <div 
                          className="w-6 md:w-8 rounded-t-md transition-all duration-700 ease-out hover:brightness-110"
                          style={{ 
                              height: amount > 0 ? `${Math.max(heightPercent, 2)}%` : '0%', 
                              backgroundColor: cat.color,
                          }}
                      />
                      
                      {/* Label Bawah */}
                      <span className="absolute -bottom-6 text-[10px] font-medium text-[#6B7280] truncate w-16 text-center">
                          {cat.name}
                      </span>
                    </div>
                )
              })}
          </div>
      </div>

      {/* Progress Bar Persentase Kategori di Bawah */}
      <div className="mt-10 pt-4 border-t border-[#EFECE3]">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Distribusi Pengeluaran</h4>
          <div className="space-y-3">
              {activeCategories.map((cat) => {
                  const amount = categoryTotals[cat.name] || 0
                  // Jangan render progress bar untuk kategori yang 0 jika tidak diinginkan (opsional)
                  if (amount === 0) return null;

                  const percentage = totalPengeluaran > 0 ? Math.round((amount / totalPengeluaran) * 100) : 0
                  
                  return (
                      <div key={cat.name}>
                          <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-slate-700">{cat.name}</span>
                              <span className="text-slate-500">{percentage}%</span>
                          </div>
                          <div className="w-full bg-[#EFECE3] h-2 rounded-full overflow-hidden">
                              <div 
                                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                                  style={{ width: `${percentage}%`, backgroundColor: cat.color }} 
                              />
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>

    </div>
  )
}