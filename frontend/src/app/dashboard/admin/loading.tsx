import React from 'react'

export default function LoadingAdminPanel() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse pb-12">
      {/* Skeleton Header */}
      <div className="mb-8">
        <div className="h-8 bg-slate-200 rounded-lg w-64 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded-lg w-96"></div>
      </div>

      {/* Skeleton 3 Tabel */}
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-200 rounded-lg"></div>
            <div className="h-6 bg-slate-200 rounded w-48"></div>
            <div className="ml-auto w-16 h-6 bg-slate-200 rounded-full"></div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}