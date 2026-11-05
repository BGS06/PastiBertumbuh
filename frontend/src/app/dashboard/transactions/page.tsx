'use client'

import { useState, useEffect } from 'react'
import { Receipt, Loader2, Download } from 'lucide-react'

export default function TransactionsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        // Menggunakan endpoint keuangan, namun meminta tab Riwayat Transaksi
        const res = await fetch('/api/keuangan?tab=Riwayat%20Transaksi', { cache: 'no-store' })
        const result = await res.json()
        setData(Array.isArray(result) ? result : [])
      } catch (error) {
        console.error("Gagal menarik data transaksi", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTransaksi()
  }, [])

  let headers: string[] = []
  let rows: any[][] = []

  if (data.length > 0) {
    const headerIdx = data.findIndex(r => r[0] && r[1] && typeof r[0] === 'string')
    const actualHeaderIdx = headerIdx !== -1 ? headerIdx : 0
    headers = data[actualHeaderIdx]
    rows = data.slice(actualHeaderIdx + 1).filter(r => r[0] || r[1])
  }

  const formatRupiah = (value: any) => {
    if (typeof value === 'number' || (!isNaN(Number(value)) && String(value).trim() !== '')) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))
    }
    return value
  }

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Riwayat Transaksi</h1>
          <p className="text-[15px] text-slate-500 mt-1">Catatan arus kas masuk dan keluar.</p>
        </div>
        
        {/* Tombol Download Lapkue (Revisi Poin 3) */}
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
          <Download size={18} />
          Unduh Lapkue (Excel)
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
            <p className="font-semibold text-slate-500">Memuat riwayat transaksi...</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
             <Receipt size={48} className="text-slate-300 mb-4" />
             <p className="font-bold text-slate-600">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {headers.map((header, idx) => header && (
                    <th key={idx} className="pb-4 pt-2 px-4 border-b-2 border-slate-100 text-[13px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50">
                    {headers.map((header, colIdx) => header && (
                      <td key={colIdx} className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {formatRupiah(row[colIdx]) || '-'}
                      </td>
                    ))}
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