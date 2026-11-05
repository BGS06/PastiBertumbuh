import Link from 'next/link'
import { Lightbulb, CalendarDays, FileText, CheckSquare, Target, Bookmark } from 'lucide-react'
// Import komponen saldo yang baru saja kita buat
import WalletBalance from '@/components/keuangan/WalletBalance'

export default function DashboardPage() {
  const cards = [
    {
      title: 'Pengingat',
      href: '/dashboard/pengingat',
      icon: Lightbulb,
      gradient: 'bg-gradient-to-r from-teal-400 to-emerald-500',
    },
    {
      title: 'Acara',
      href: '/dashboard/events',
      icon: CalendarDays,
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-500',
    },
    {
      title: 'Data Penting',
      href: '/dashboard/data',
      icon: FileText,
      gradient: 'bg-gradient-to-r from-blue-600 to-yellow-500',
    },
    {
      title: 'Daftar Tugas',
      href: '/dashboard/tasks',
      icon: CheckSquare,
      gradient: 'bg-gradient-to-r from-blue-800 to-orange-500',
    },
    {
      title: 'Pusat Memori',
      href: '/dashboard/memory',
      icon: Target,
      gradient: 'bg-gradient-to-r from-blue-700 to-pink-500',
    },
    {
      title: 'Catatan Penting',
      href: '/dashboard/notes',
      icon: Bookmark,
      gradient: 'bg-gradient-to-r from-blue-600 to-teal-500',
    },
  ]

  return (
    <div className="w-full">
      {/* Banner Sapaan */}
      <div className="bg-slate-50/50 rounded-2xl p-6 mb-8 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Apa yang ada di pikiranmu hari ini?</h1>
      </div>

      {/* --- RINGKASAN KEUANGAN (TAMBAHAN BARU) --- */}
      <div className="mb-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
           <WalletBalance />
        </div>
        
        {/* Placeholder Chart yang disesuaikan dengan tema desainmu */}
        <div className="w-full md:w-2/3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
           <p className="text-slate-400 text-sm font-medium">Mini Chart Aktivitas Ekonomi Akan Tampil Di Sini</p>
        </div>
      </div>

      {/* Grid Kartu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
            {/* Header dengan Gradasi */}
            <div className={`h-24 w-full ${card.gradient} px-5 py-4 flex justify-between items-start`}>
              <h3 className="text-white font-bold text-lg">{card.title}</h3>
              <Link 
                href={card.href} 
                className="text-white/90 text-xs font-medium hover:text-white flex items-center gap-1 transition-colors z-10"
              >
                Lihat semua &rarr;
              </Link>
            </div>

            {/* Ikon Tengah */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white p-3 rounded-full shadow-sm border border-slate-100 z-10">
              <card.icon className="text-teal-500" size={24} />
            </div>

            {/* Body */}
            <div className="pt-14 pb-8 flex justify-center items-center">
              <p className="text-slate-300 text-sm">Belum ada data</p>
            </div>

            {/* Footer */}
            <div className="mt-auto px-4 py-3 border-t border-slate-50 flex items-center gap-2">
              <Lightbulb size={14} className="text-purple-400" />
              <p className="text-[11px] text-purple-400 font-medium truncate">
                PastiBertumbuh, ingatkan aku minum vitamin
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}