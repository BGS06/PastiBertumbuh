'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Zap, LayoutDashboard, CheckSquare, Calendar, CalendarDays, Wallet, 
  Receipt, Bell, Download, ShieldCheck, ScanFace, Mail, Lock, 
  Menu, X, Shield 
} from 'lucide-react'

// PENTING: Prop isAdmin dikembalikan
export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Helper untuk mengecek apakah path aktif
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard' // Exact match untuk dasbor
    return pathname?.includes(path) // Includes untuk sub-menu
  }

  // Helper untuk styling menu yang rapi dan mempertahankan desain Gradient aslimu
  const getMenuClasses = (path: string) => {
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive(path)
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/20' 
        : 'text-slate-600 hover:bg-slate-50'
    }`
  }

  const getIconClasses = (path: string) => {
    return isActive(path) ? 'text-white' : 'text-slate-400'
  }

  return (
    <>
      {/* ========================================= */}
      {/* HEADER MOBILE (Hanya tampil di HP)        */}
      {/* ========================================= */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center">
          <Zap className="text-purple-600 fill-purple-600 mr-2" size={24} />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">PastiBertumbuh</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ========================================= */}
      {/* SIDEBAR UTAMA (Fixed Full Layar)          */}
      {/* ========================================= */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* LOGO ZAP ASLI */}
        <div className="hidden md:flex h-16 items-center px-6 border-b border-transparent shrink-0 mt-2">
          <Zap className="text-purple-600 fill-purple-600 mr-2" size={24} />
          <span className="text-xl font-bold text-slate-800 tracking-tight">PastiBertumbuh</span>
        </div>

        {/* AREA SCROLL MENU */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          
          {/* TIER 1: PRODUKTIVITAS & KEUANGAN */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Produktivitas & Keuangan</p>
            <nav className="space-y-1">
              <Link href="/dashboard"><div className={getMenuClasses('/dashboard')}><LayoutDashboard size={18} className={getIconClasses('/dashboard')} /> Dasbor</div></Link>
              <Link href="/dashboard/tasks"><div className={getMenuClasses('/dashboard/tasks')}><CheckSquare size={18} className={getIconClasses('/dashboard/tasks')} /> Daftar Tugas</div></Link>
              <Link href="/dashboard/calendar"><div className={getMenuClasses('/dashboard/calendar')}><Calendar size={18} className={getIconClasses('/dashboard/calendar')} /> Kalender</div></Link>
              <Link href="/dashboard/events"><div className={getMenuClasses('/dashboard/events')}><CalendarDays size={18} className={getIconClasses('/dashboard/events')} /> Acara & Undangan</div></Link>
              <Link href="/dashboard/keuangan"><div className={getMenuClasses('/dashboard/keuangan')}><Wallet size={18} className={getIconClasses('/dashboard/keuangan')} /> Keuangan</div></Link>
              <Link href="/dashboard/transactions"><div className={getMenuClasses('/dashboard/transactions')}><Receipt size={18} className={getIconClasses('/dashboard/transactions')} /> Riwayat Transaksi</div></Link>
            </nav>
          </div>

          {/* TIER 2: AUTOMASI PRO */}
          <div>
            <div className="px-3 flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Automasi Pro</p>
              <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full">29K</span>
            </div>
            <nav className="space-y-1">
              <Link href="/dashboard/pengingat"><div className={getMenuClasses('/dashboard/pengingat')}><Bell size={18} className={getIconClasses('/dashboard/pengingat')} /> Pengingat Harian</div></Link>
              <button className="w-full">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-600 hover:bg-slate-50">
                  <Download size={18} className="text-slate-400" /> Unduh Lapkue
                </div>
              </button>
            </nav>
          </div>

          {/* TIER 3: PREMIUM AI */}
          <div>
            <div className="px-3 flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Premium AI</p>
              <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-full">59K</span>
            </div>
            <nav className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed font-medium">
                <div className="flex items-center gap-3"><ShieldCheck size={18} /> Audit Mingguan</div>
                <Lock size={14} className="text-slate-300" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed font-medium">
                <div className="flex items-center gap-3"><ScanFace size={18} /> Scan Struk & VN</div>
                <Lock size={14} className="text-slate-300" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed font-medium">
                <div className="flex items-center gap-3"><Mail size={18} /> Invoice Gmail</div>
                <Lock size={14} className="text-slate-300" />
              </div>
            </nav>
          </div>

          {/* MENU KHUSUS ADMIN (Sesuai kode aslimu) */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-100">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Manajemen SaaS</p>
              <Link href="/dashboard/admin">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/dashboard/admin'
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/20' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}>
                  <Shield size={18} className={pathname === '/dashboard/admin' ? 'text-white' : 'text-slate-400'} />
                  Admin Panel
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* BOTTOM AREA (User Profile / Chat Assistant) */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
              N
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">nasg1868@...</p>
              <p className="text-[11px] text-slate-500 font-medium">Manajemen SaaS</p>
            </div>
          </div>
          {/* Kamu bisa meletakkan kode <ChatAssistant /> milikmu di bawah sini jika perlu */}
        </div>
        
      </aside>
    </>
  )
}git rm -r --cached node_modules