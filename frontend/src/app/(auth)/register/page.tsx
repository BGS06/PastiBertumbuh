'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../actions'
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'

const TIERS = [
  { id: '1', name: 'Tier 1 (Starter)', price: 'Rp 19.000', desc: 'Produktivitas & Keuangan Dasar' },
  { id: '2', name: 'Tier 2 (Pro)', price: 'Rp 29.000', desc: 'Tambahan Pengingat WA & Lapkue' },
  { id: '3', name: 'Tier 3 (Elite)', price: 'Rp 59.000', desc: 'Tambahan AI Scan & Audit Mingguan' },
]

export default function RegisterPage() {
  const [selectedTier, setSelectedTier] = useState('1')

  // Membungkus Server Action untuk menyelesaikan error TS yang tidak menerima pengembalian obyek
  const handleSignup = async (formData: FormData) => {
    await signup(formData);
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EFECE3]">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#6B7280] hover:text-[#4A5D4E] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Kembali
        </Link>

        <div className="flex items-center gap-2 mb-6 text-[#8C7A6B]">
          <Sparkles size={24} />
          <span className="font-serif font-bold text-xl">Mulai Bertumbuh</span>
        </div>

        <h1 className="text-3xl font-serif text-[#1F2937] mb-2">Buat Akun</h1>
        <p className="text-[#6B7280] mb-8">Langkah pertamamu menuju kebiasaan yang lebih baik.</p>

        <form className="space-y-6">
          {/* PEMILIHAN TIER */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-[#4B5563]">Pilih Paket Berlangganan</label>
            {TIERS.map((tier) => (
              <div 
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTier === tier.id 
                    ? 'border-[#8C7A6B] bg-[#8C7A6B]/5' 
                    : 'border-[#EFECE3] hover:border-[#8C7A6B]/50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#1F2937]">{tier.name}</span>
                  <span className="text-sm font-semibold text-[#8C7A6B]">{tier.price}<span className="font-normal text-[#9CA3AF]">/bln</span></span>
                </div>
                <p className="text-xs text-[#6B7280] pr-8">{tier.desc}</p>
                
                {/* Checkmark jika terpilih */}
                {selectedTier === tier.id && (
                  <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] fill-[#8C7A6B]/20" />
                )}
              </div>
            ))}
            {/* Input Tersembunyi untuk mengirim data Tier ke Server Action */}
            <input type="hidden" name="tier" value={selectedTier} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FDFCF8] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition-all text-[#1F2937]"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5" htmlFor="password">Kata Sandi Baru</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FDFCF8] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition-all text-[#1F2937]"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button 
            formAction={handleSignup} 
            className="w-full bg-[#8C7A6B] hover:bg-[#7a6a5c] text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm mt-4"
          >
            Lanjutkan Pendaftaran
          </button>
        </form>

        <div className="mt-8 text-center text-[#6B7280] text-sm">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="text-[#8C7A6B] font-semibold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  )
}