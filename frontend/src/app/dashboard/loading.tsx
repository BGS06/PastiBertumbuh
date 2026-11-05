import React from 'react'

export default function DashboardGlobalLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium animate-pulse">Memuat halaman...</p>
      </div>
    </div>
  )
}