import Link from 'next/link'
import { login } from '../actions'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EFECE3]">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#6B7280] hover:text-[#4A5D4E] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="flex items-center gap-2 mb-6 text-[#4A5D4E]">
          <BookOpen size={24} />
          <span className="font-serif font-bold text-xl">PastiBertumbuh</span>
        </div>

        <h1 className="text-3xl font-serif text-[#1F2937] mb-2">Selamat Datang</h1>
        <p className="text-[#6B7280] mb-8">Masuk ke pusat produktivitasmu.</p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FDFCF8] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E] focus:border-transparent transition-all text-[#1F2937]"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5" htmlFor="password">Kata Sandi</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FDFCF8] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E] focus:border-transparent transition-all text-[#1F2937]"
              placeholder="••••••••"
            />
          </div>
          <button 
            formAction={login} 
            className="w-full bg-[#4A5D4E] hover:bg-[#3d4d40] text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm mt-4"
          >
            Masuk
          </button>
        </form>

        <div className="mt-8 text-center text-[#6B7280] text-sm">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#4A5D4E] font-semibold hover:underline">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}