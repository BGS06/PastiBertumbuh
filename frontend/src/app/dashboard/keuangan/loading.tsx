import React from 'react'

export default function LoadingKeuangan() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Skeleton Judul Halaman */}
      <div className="h-8 bg-slate-200 rounded-lg w-48"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skeleton Kolom Kiri: Saldo Dompet */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[350px] flex flex-col justify-center items-center">
          <div className="h-4 bg-slate-200 rounded w-32 mb-4"></div>
          <div className="h-10 bg-slate-200 rounded w-56 mb-8"></div>
          <div className="w-full space-y-4">
            <div className="h-4 bg-slate-100 rounded w-full flex justify-between"></div>
            <div className="h-4 bg-slate-100 rounded w-full flex justify-between"></div>
            <div className="h-4 bg-slate-100 rounded w-full flex justify-between"></div>
            <div className="h-4 bg-slate-100 rounded w-full flex justify-between"></div>
          </div>
        </div>

        {/* Skeleton Kolom Kanan: Grafik Pengeluaran */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[500px] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="h-6 bg-slate-200 rounded w-56"></div>
              <div className="h-3 bg-slate-100 rounded w-48"></div>
            </div>
            <div className="space-y-2 text-right">
              <div className="h-3 bg-slate-100 rounded w-24 ml-auto"></div>
              <div className="h-6 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Skeleton Diagram */}
          <div className="h-64 bg-slate-100 rounded-xl w-full mb-6"></div>
          
          {/* Skeleton Kategori */}
          <div className="space-y-4 mt-auto">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}