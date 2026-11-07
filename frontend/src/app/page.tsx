import Link from 'next/link'
import { ArrowRight, BookOpen, Heart, Activity, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] flex">
      {/* Kolom Kiri: Teks dan CTA */}
      <div className="flex-1 flex flex-col justify-center px-12 md:px-24 lg:px-32 py-12 relative z-10">
        
        {/* Label Atas */}
        <div className="inline-flex items-center gap-2 bg-[#EFECE3] text-[#4A5D4E] px-4 py-1.5 rounded-full text-sm font-semibold mb-8 w-fit">
          <BookOpen size={16} />
          <span>PastiBertumbuh Hub</span>
        </div>

        {/* Hero Text */}
        <h1 className="text-6xl md:text-7xl font-serif text-[#1F2937] leading-[1.1] tracking-tight mb-6">
          Personal<br />Growth
        </h1>
        <p className="text-xl md:text-2xl text-[#4B5563] mb-8 font-medium">
          Mindset. Habits. Confidence. <span className="font-serif italic text-[#4A5D4E]">You.</span>
        </p>

        <p className="text-[#6B7280] text-lg max-w-md mb-12 leading-relaxed">
          Platform produktivitas dan keuangan lengkap untuk membantumu membangun kebiasaan sehat, mengelola uang, dan membuka potensi terbaikmu.
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#4A5D4E] hover:bg-[#3d4d40] text-white px-8 py-4 rounded-lg font-medium transition-all shadow-sm">
            Mulai Perjalanan <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-white border border-[#E5E7EB] hover:border-[#4A5D4E] hover:text-[#4A5D4E] text-[#374151] px-8 py-4 rounded-lg font-medium transition-all shadow-sm">
            <Activity size={18} /> Buka Dasbor
          </Link>
        </div>

        {/* Fitur Bawah (4 Kolom Mini) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl border-t border-[#EFECE3] pt-8">
          <div>
            <CheckCircle className="text-[#4A5D4E] mb-3" size={24} />
            <h4 className="font-semibold text-[#1F2937] mb-1">Catatan Keuangan</h4>
            <p className="text-sm text-[#6B7280]">Lacak saldo & anggaran</p>
          </div>
          <div>
            <Activity className="text-[#4A5D4E] mb-3" size={24} />
            <h4 className="font-semibold text-[#1F2937] mb-1">Produktivitas</h4>
            <p className="text-sm text-[#6B7280]">Kelola tugas harian</p>
          </div>
          <div>
            <Heart className="text-[#4A5D4E] mb-3" size={24} />
            <h4 className="font-semibold text-[#1F2937] mb-1">Pengingat Pro</h4>
            <p className="text-sm text-[#6B7280]">Notifikasi pagi & sore</p>
          </div>
          <div>
            <BookOpen className="text-[#4A5D4E] mb-3" size={24} />
            <h4 className="font-semibold text-[#1F2937] mb-1">Premium AI</h4>
            <p className="text-sm text-[#6B7280]">Scan struk otomatis</p>
          </div>
        </div>

      </div>

      {/* Kolom Kanan: Gambar Penuh */}
      <div className="hidden lg:block w-[45%] relative bg-[#EFECE3]">
        {/* Placeholder untuk foto wanita membaca buku seperti referensi */}
        <img 
          src="/placeholder-hero.jpg" 
          alt="Personal Growth Lifestyle" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
        />
        {/* Kamu perlu menambahkan foto aslimu (misal bernama placeholder-hero.jpg) ke dalam folder 'public' Next.js */}
      </div>
    </div>
  )
}