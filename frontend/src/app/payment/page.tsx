import Link from 'next/link'
import { Wallet, CheckCircle2, ArrowRight, ShieldCheck, Copy } from 'lucide-react'

export default function PaymentPage({ searchParams }: { searchParams: { tier?: string, email?: string } }) {
  const tier = searchParams.tier || '2'
  const email = searchParams.email || 'Pengguna Baru'
  
  const tierDetails = {
    '2': { name: 'Tier 2 (Pro)', price: 'Rp 29.000' },
    '3': { name: 'Tier 3 (Elite)', price: 'Rp 59.000' }
  }
  
  const currentTier = tierDetails[tier as '2' | '3'] || tierDetails['2']
  const adminWA = "6281234567890" // TODO: Ganti dengan nomor WA Admin kamu
  const waMessage = `Halo Admin PastiBertumbuh, saya baru saja mendaftar dengan email *${email}* untuk paket *${currentTier.name}*. Berikut bukti transfer saya:`
  const waLink = `https://wa.me/${adminWA}?text=${encodeURIComponent(waMessage)}`

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EFECE3] flex flex-col md:flex-row">
        
        {/* Kolom Kiri: Detail Pesanan */}
        <div className="bg-[#4A5D4E] w-full md:w-2/5 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8 opacity-80">
              <ShieldCheck size={20} />
              <span className="font-serif font-bold tracking-wider text-sm">Pembayaran Aman</span>
            </div>
            <h2 className="text-2xl font-serif mb-2">Selesaikan Pesanan</h2>
            <p className="text-[#EFECE3] text-sm mb-8 opacity-90">Satu langkah lagi untuk membuka semua fitur produktivitasmu.</p>
            
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 mb-4">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Paket Pilihan</p>
              <p className="font-bold text-lg">{currentTier.name}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Total Tagihan</p>
            <p className="text-3xl font-extrabold">{currentTier.price}</p>
          </div>
        </div>

        {/* Kolom Kanan: Instruksi Pembayaran */}
        <div className="w-full md:w-3/5 p-8">
          <h3 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
            <Wallet className="text-[#8C7A6B]" size={20} />
            Metode Transfer
          </h3>

          <div className="space-y-4 mb-8">
            {/* Rekening Blu */}
            <div className="p-4 border border-[#EFECE3] rounded-xl bg-slate-50 hover:border-[#8C7A6B]/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#1F2937]">Blu by BCA Digital</span>
                <span className="text-xs font-semibold text-[#8C7A6B] bg-[#8C7A6B]/10 px-2 py-1 rounded-md">Direkomendasikan</span>
              </div>
              <p className="text-2xl font-mono tracking-wider text-[#4A5D4E] mb-1">0012 3456 7890</p>
              <p className="text-sm text-[#6B7280]">a.n PastiBertumbuh SaaS</p>
            </div>

            {/* Rekening SeaBank */}
            <div className="p-4 border border-[#EFECE3] rounded-xl bg-slate-50 hover:border-[#8C7A6B]/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#1F2937]">SeaBank</span>
              </div>
              <p className="text-2xl font-mono tracking-wider text-[#4A5D4E] mb-1">9012 3456 78</p>
              <p className="text-sm text-[#6B7280]">a.n PastiBertumbuh SaaS</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-8">
            <p className="text-sm text-amber-800">
              Setelah melakukan transfer, silakan kirimkan bukti pembayaran ke WhatsApp Admin. Akunmu akan diaktifkan dalam waktu kurang dari 5 menit.
            </p>
          </div>

          <Link 
            href={waLink} 
            target="_blank"
            className="w-full flex items-center justify-center gap-2 bg-[#8C7A6B] hover:bg-[#7a6a5c] text-white py-4 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            Konfirmasi Pembayaran <ArrowRight size={18} />
          </Link>
          
          <div className="mt-4 text-center">
            <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#4A5D4E] underline decoration-[#EFECE3] underline-offset-4 transition-colors">
              Masuk ke Dasbor Sementara
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}