'use client'

import React from 'react'

const CATEGORIES_CONFIG = [
  { name: 'Konsumsi', color: '#3b82f6' },   // Biru
  { name: 'Transportasi', color: '#eab308' },// Kuning/Emas
  { name: 'Tagihan', color: '#ef4444' },     // Merah
  { name: 'Bisnis', color: '#22c55e' },      // Hijau
  { name: 'Hiburan', color: '#facc15' },     // Kuning Terang
  { name: 'Pendidikan', color: '#06b6d4' },  // Cyan
  { name: 'Kesehatan', color: '#60a5fa' },   // Biru Muda
]

export default function FinanceChart({ rawData }: { rawData: any[] }) {
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
        (c) => 
          c.name.toLowerCase() === categoryFromAnggaran.toLowerCase() ||
          categoryFromAnggaran.toLowerCase().includes(c.name.toLowerCase())
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

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6 w-full h-full">
      {/* Header Kartu */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Aktivitas & Kategori Pengeluaran</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ringkasan alokasi dana dari Riwayat Transaksi</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">Total Pengeluaran</span>
          <p className="text-base font-extrabold text-red-500">{formatRupiah(totalPengeluaran)}</p>
        </div>
      </div>

      {/* DIAGRAM BATANG (DESAIN SESUAI REFERENSI GAMBAR) */}
      <div className="border border-slate-200 rounded-lg p-4 bg-white flex flex-col gap-4">
        {/* Legenda Kategori di Atas */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-700 pb-2">
          {CATEGORIES_CONFIG.map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: cat.color }} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Area Grafik dengan Gridline Horizontal */}
        <div className="relative h-60 w-full pt-4 pb-1 flex flex-col justify-between border-t border-b border-slate-200">
          {/* Garis Grid Nominal Y-Axis */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2">
            {yTicks.map((tick, i) => (
              <div key={i} className="relative w-full border-b border-slate-100 flex items-center">
                <span className="absolute -top-3 left-0 bg-white/90 px-1 text-[10px] font-medium text-slate-400">
                  {formatRupiah(tick)}
                </span>
              </div>
            ))}
          </div>

          {/* Batang Diagram */}
          <div className="relative z-10 h-full flex items-end justify-around pl-16 pr-2">
            {CATEGORIES_CONFIG.map((cat) => {
              const amount = categoryTotals[cat.name] || 0
              const heightPercent = maxVal > 0 ? (amount / maxVal) * 100 : 0

              return (
                <div key={cat.name} className="flex flex-col items-center h-full justify-end group relative w-6 md:w-8">
                  {/* Tooltip Angka saat kursor di-hover */}
                  {amount > 0 && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow whitespace-nowrap z-20">
                      {cat.name}: {formatRupiah(amount)}
                    </div>
                  )}

                  {/* Batang */}
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${Math.max(heightPercent, amount > 0 ? 3 : 0)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar Penggolongan Kategori di Bawah */}
      <div className="space-y-3 overflow-y-auto max-h-[200px] pr-1">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Penggolongan Kategori</h4>
        {CATEGORIES_CONFIG.map((cat) => {
          const amount = categoryTotals[cat.name] || 0
          const percentage = totalPengeluaran > 0 ? Math.round((amount / totalPengeluaran) * 100) : 0

          return (
            <div key={cat.name} className="flex flex-col gap-1.5 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }} />
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800">{formatRupiah(amount)}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({percentage}%)</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}