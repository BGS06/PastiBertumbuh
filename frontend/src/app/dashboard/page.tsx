import Link from 'next/link'
import { Lightbulb, CalendarDays, FileText, CheckSquare, Target, Bookmark, Activity } from 'lucide-react'
import WalletBalance from '@/components/keuangan/WalletBalance'
import FinanceChart from '@/components/keuangan/FinanceChart'
import { getFinanceData } from '@/app/dashboard/actions'

export default async function DashboardPage() {
  // 1. Tarik data keuangan di level halaman (Server Component)
  // Meminta tab 'Riwayat Transaksi' yang berisi catatan detail pengeluaran/pemasukan
  const financeData = await getFinanceData({ sheet: 'Riwayat Transaksi' })

  const cards = [
    {
      title: 'Pengingat',
      href: '/dashboard/pengingat',
      icon: Lightbulb,
      gradient: 'bg-[#4A5D4E]', 
      accentColor: 'text-[#4A5D4E]'
    },
    {
      title: 'Acara',
      href: '/dashboard/events',
      icon: CalendarDays,
      gradient: 'bg-[#8C7A6B]', 
      accentColor: 'text-[#8C7A6B]'
    },
    {
      title: 'Data Penting',
      href: '/dashboard/files',
      icon: FileText,
      gradient: 'bg-[#64748B]', 
      accentColor: 'text-[#64748B]'
    },
    {
      title: 'Daftar Tugas',
      href: '/dashboard/tasks',
      icon: CheckSquare,
      gradient: 'bg-[#4A5D4E]',
      accentColor: 'text-[#4A5D4E]'
    },
    {
      title: 'Pusat Memori',
      href: '/dashboard/memory',
      icon: Target,
      gradient: 'bg-[#8C7A6B]',
      accentColor: 'text-[#8C7A6B]'
    },
    {
      title: 'Catatan Penting',
      href: '/dashboard/notes',
      icon: Bookmark,
      gradient: 'bg-[#64748B]',
      accentColor: 'text-[#64748B]'
    },
  ]

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500 bg-[#FDFCF8] min-h-screen -m-4 md:-m-8 p-4 md:p-8">
      
      {/* Banner Sapaan */}
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-[#1F2937] tracking-tight mb-2">
          Apa yang ada di pikiranmu hari ini?
        </h1>
        <p className="text-[#6B7280]">Selamat datang kembali di pusat produktivitasmu.</p>
      </div>

      {/* --- RINGKASAN KEUANGAN --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Kolom Kiri: Saldo Dompet */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-[#EFECE3] p-6 h-full transition-all hover:shadow-md">
            {/* Teruskan data ke komponen WalletBalance */}
            <WalletBalance initialData={financeData} />
          </div>
        </div>

        {/* Kolom Kanan: Chart Aktivitas Ekonomi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-[#EFECE3] p-6 h-full transition-all hover:shadow-md overflow-hidden">
            {/* Teruskan data ke komponen FinanceChart */}
            <FinanceChart rawData={financeData} />
          </div>
        </div>
      </div>

      {/* Grid Kartu Fitur */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link href={card.href} key={index} className="group block">
            <div className="bg-white rounded-2xl shadow-sm border border-[#EFECE3] overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
              
              {/* Header Kartu (Warna Solid Alam) */}
              <div className={`${card.gradient} p-4 flex justify-between items-center text-white`}>
                <h3 className="font-semibold text-lg">{card.title}</h3>
                <span className="text-xs opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Lihat semua <span className="text-[10px]">→</span>
                </span>
              </div>

              {/* Body (Ikon di tengah) */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[140px] bg-slate-50/30">
                <div className={`p-4 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300 ${card.accentColor}`}>
                  <card.icon size={28} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-[#9CA3AF]">Belum ada data</p>
              </div>

              {/* Footer */}
              <div className="border-t border-[#EFECE3] px-4 py-3 bg-white">
                <p className="text-xs text-[#9CA3AF] flex items-center gap-1.5 truncate">
                  <Lightbulb size={12} />
                  PastiBertumbuh, ingatkan aku minum vitamin
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
      
    </div>
  )
}