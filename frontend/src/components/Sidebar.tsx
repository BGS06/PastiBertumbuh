'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Zap, LayoutDashboard, CheckSquare, Calendar, CalendarDays, Wallet, 
  Receipt, Bell, Download, ShieldCheck, ScanFace, Mail, Lock, 
  Menu, X, Shield 
} from 'lucide-react'

// Tambahkan userTier dan userEmail ke props
export default function Sidebar({ 
  isAdmin = false, 
  userTier = 1,
  userEmail = ''
}: { 
  isAdmin?: boolean,
  userTier?: number,
  userEmail?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard'
    return pathname?.includes(path)
  }

  const getMenuClasses = (path: string) => {
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive(path)
        ? 'bg-gradient-to-r from-[#4A5D4E] to-[#3d4d40] text-white shadow-md shadow-[#4A5D4E]/20' 
        : 'text-[#4B5563] hover:bg-[#EFECE3] hover:text-[#1F2937]'
    }`
  }

  const getIconClasses = (path: string) => {
    return isActive(path) ? 'text-white' : 'text-[#8C7A6B]'
  }

  // Helper untuk merender menu yang terkunci (Premium)
  const renderLockedMenu = (title: string, IconComponent: any, requiredTier: number) => {
    const isLocked = userTier < requiredTier
    
    if (isLocked) {
      return (
        <div 
          onClick={() => alert(`Fitur ${title} hanya tersedia untuk Tier ${requiredTier}. Silakan upgrade di halaman profil.`)}
          className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-400 cursor-pointer font-medium hover:bg-slate-50 rounded-xl transition-all"
        >
          <div className="flex items-center gap-3"><IconComponent size={18} /> <span className="truncate">{title}</span></div>
          <Lock size={14} className="text-slate-300 shrink-0" />
        </div>
      )
    }

    // Jika sudah terbuka (tidak terkunci), buat jadi link/tombol normal
    return (
      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-[#4B5563] hover:bg-[#EFECE3] hover:text-[#1F2937]">
        <IconComponent size={18} className="text-[#8C7A6B]" /> <span className="truncate">{title}</span>
      </button>
    )
  }

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#FDFCF8] border-b border-[#EFECE3] z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center">
          <Zap className="text-[#4A5D4E] fill-[#4A5D4E] mr-2" size={24} />
          <h1 className="text-xl font-serif font-bold text-[#1F2937] tracking-tight">PastiBertumbuh</h1>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-[#EFECE3] rounded-lg text-[#4B5563]">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && <div className="md:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-[#FDFCF8] border-r border-[#EFECE3] z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        <div className="hidden md:flex h-20 items-center px-6 border-b border-[#EFECE3] shrink-0">
          <Zap className="text-[#4A5D4E] fill-[#4A5D4E] mr-2" size={24} />
          <span className="text-xl font-serif font-bold text-[#1F2937] tracking-tight">PastiBertumbuh</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
          
          <div>
            <p className="px-3 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Produktivitas & Keuangan</p>
            <nav className="space-y-1">
              <Link href="/dashboard"><div className={getMenuClasses('/dashboard')}><LayoutDashboard size={18} className={getIconClasses('/dashboard')} /> Dasbor</div></Link>
              <Link href="/dashboard/tasks"><div className={getMenuClasses('/dashboard/tasks')}><CheckSquare size={18} className={getIconClasses('/dashboard/tasks')} /> Daftar Tugas</div></Link>
              <Link href="/dashboard/calendar"><div className={getMenuClasses('/dashboard/calendar')}><Calendar size={18} className={getIconClasses('/dashboard/calendar')} /> Kalender</div></Link>
              <Link href="/dashboard/events"><div className={getMenuClasses('/dashboard/events')}><CalendarDays size={18} className={getIconClasses('/dashboard/events')} /> Acara & Undangan</div></Link>
              <Link href="/dashboard/keuangan"><div className={getMenuClasses('/dashboard/keuangan')}><Wallet size={18} className={getIconClasses('/dashboard/keuangan')} /> Keuangan</div></Link>
              <Link href="/dashboard/transactions"><div className={getMenuClasses('/dashboard/transactions')}><Receipt size={18} className={getIconClasses('/dashboard/transactions')} /> Riwayat Transaksi</div></Link>
            </nav>
          </div>

          <div>
            <div className="px-3 flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Automasi Pro</p>
              <span className="bg-[#EFECE3] text-[#8C7A6B] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#d6d0c4]">29K</span>
            </div>
            <nav className="space-y-1">
              <Link href="/dashboard/pengingat"><div className={getMenuClasses('/dashboard/pengingat')}><Bell size={18} className={getIconClasses('/dashboard/pengingat')} /> Pengingat Harian</div></Link>
              {renderLockedMenu("Unduh Lapkue", Download, 2)}
            </nav>
          </div>

          <div>
            <div className="px-3 flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Premium AI</p>
              <span className="bg-[#EFECE3] text-[#4A5D4E] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#d6d0c4]">59K</span>
            </div>
            <nav className="space-y-1">
              {renderLockedMenu("Audit Mingguan", ShieldCheck, 3)}
              {renderLockedMenu("Scan Struk & VN", ScanFace, 3)}
              {renderLockedMenu("Invoice Gmail", Mail, 3)}
            </nav>
          </div>

          {isAdmin && (
            <div className="pt-4 border-t border-[#EFECE3]">
              <p className="px-3 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Manajemen SaaS</p>
              <Link href="/dashboard/admin">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/dashboard/admin'
                    ? 'bg-[#1F2937] text-white shadow-md' 
                    : 'text-[#4B5563] hover:bg-[#EFECE3]'
                }`}>
                  <Shield size={18} className={pathname === '/dashboard/admin' ? 'text-white' : 'text-[#8C7A6B]'} />
                  Admin Panel
                </div>
              </Link>
            </div>
          )}
        </div>

        <Link href="/dashboard/profile" className="block p-4 border-t border-[#EFECE3] bg-[#FDFCF8] shrink-0 hover:bg-[#EFECE3] transition-colors">
          <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#8C7A6B] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#1F2937] truncate">{userEmail || 'Pengguna'}</p>
              <p className="text-[11px] text-[#4A5D4E] font-bold mt-0.5">Tier {userTier} Aktif</p>
            </div>
          </div>
        </Link>
        
      </aside>
    </>
  )
}