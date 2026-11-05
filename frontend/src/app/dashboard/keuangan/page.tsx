'use client'

import { useState, useEffect } from 'react'
import { Wallet, PieChart, Loader2, ArrowRightLeft } from 'lucide-react'

export default function KeuanganPage() {
  const [activeTab, setActiveTab] = useState('Sisa Saldo') // Bisa 'Sisa Saldo' atau 'Sisa Anggaran'
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Tarik data setiap kali tab (Saldo/Anggaran) diklik
  useEffect(() => {
    const fetchKeuangan = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/keuangan?tab=${encodeURIComponent(activeTab)}`, { cache: 'no-store' })
        const result = await res.json()
        setData(Array.isArray(result) ? result : [])
      } catch (error) {
        console.error("Gagal menarik data keuangan:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchKeuangan()
  }, [activeTab])

  // ==========================================
  // SMART FILTER YANG SUDAH DIPERBAIKI
  // ==========================================
  let headers: string[] = []
  let rows: any[][] = []

  if (data.length > 0) {
    // Cari baris pertama yang memiliki setidaknya 3 kolom terisi tulisan.
    // Ini adalah cara paling jitu mencari "Header" di Google Sheets yang banyak baris kosong di atasnya.
    const headerIdx = data.findIndex(row => {
      let filledCols = 0
      for (let i = 0; i < Math.min(row.length, 5); i++) { // Cek maksimal 5 kolom pertama
        if (row[i] !== undefined && row[i] !== null && String(row[i]).trim() !== '') filledCols++
      }
      return filledCols >= 3 
    })

    const actualHeaderIdx = headerIdx !== -1 ? headerIdx : 0
    headers = data[actualHeaderIdx]
    
    // Ambil data SETELAH header
    // Buang baris yang isinya kosong semua
    rows = data.slice(actualHeaderIdx + 1).filter(row => {
      let hasData = false
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== undefined && row[i] !== null && String(row[i]).trim() !== '') {
          hasData = true
          break
        }
      }
      return hasData
    })
  }

  // Auto-format angka menjadi Rupiah 
  const formatRupiah = (value: any) => {
    if (value === undefined || value === null || value === '') return ''
    
    // Jika value adalah angka murni atau string angka
    if (!isNaN(Number(value))) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value))
    }
    return value
  }

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500">
      
      {/* JUDUL */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manajemen Keuangan</h1>
        <p className="text-[15px] text-slate-500 mt-1">Pantau sisa saldo dompet dan serapan anggaran secara real-time.</p>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8 shadow-inner border border-slate-200/60">
        <button
          onClick={() => setActiveTab('Sisa Saldo')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'Sisa Saldo' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Wallet size={18} />
          Sisa Saldo
        </button>
        <button
          onClick={() => setActiveTab('Sisa Anggaran')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'Sisa Anggaran' 
              ? 'bg-white text-purple-600 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <PieChart size={18} />
          Sisa Anggaran
        </button>
      </div>

      {/* AREA KONTEN (TABEL) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
        
        {/* Header Area Tabel */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ArrowRightLeft size={20} className={activeTab === 'Sisa Saldo' ? 'text-blue-500' : 'text-purple-500'} />
              Data {activeTab}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Tersinkronisasi langsung dari Google Spreadsheet</p>
          </div>
        </div>

        {/* State Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <Loader2 size={40} className="animate-spin mb-4 text-slate-300" />
            <p className="font-semibold text-slate-500">Menarik data {activeTab}...</p>
          </div>
          
        // State Kosong
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-4">
              <Wallet size={32} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-600 text-lg">Tidak ada data ditemukan</p>
            <p className="text-sm text-slate-400 mt-1">Pastikan tab "{activeTab}" di Spreadsheet sudah terisi data.</p>
          </div>
          
        // State Berhasil (Tabel Pintar)
        ) : (
          <div className="overflow-x-auto p-8 pt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {headers.map((header, idx) => {
                    // Hindari render kolom yang headernya kosong atau undefined
                    if (header === undefined || header === null || String(header).trim() === '') return null; 
                    return (
                      <th key={idx} className="pb-4 pt-2 px-4 border-b-2 border-slate-100 text-[13px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50 transition-colors group">
                    {headers.map((header, colIdx) => {
                      if (header === undefined || header === null || String(header).trim() === '') return null;
                      
                      const cellValue = row[colIdx]
                      
                      // Highlight tebal untuk kolom pertama (biasanya Nama Akun / Kategori)
                      const isFirstCol = colIdx === 0
                      
                      return (
                        <td key={colIdx} className={`py-4 px-4 whitespace-nowrap ${isFirstCol ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'}`}>
                          {/* Jika nilainya angka/rupiah, otomatis diformat. Jika teks biasa, tampilkan teksnya */}
                          {formatRupiah(cellValue) || '-'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  )
}