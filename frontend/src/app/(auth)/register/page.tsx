'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Check, Sparkles, User, Mail, Lock, ArrowLeft, Zap } from 'lucide-react'

// --- Data Paket / Pricing ---
const pricingPlans = [
  {
    id: 'gratis',
    name: 'Gratis',
    price: 'Rp 0',
    period: '/bulan',
    description: 'Cocok untuk mencoba fitur dasar dan acara berskala kecil.',
    features: ['1 Acara Aktif', 'Maksimal 50 Tamu', 'Pengingat Standar (Email)', 'Tema Undangan Dasar'],
    buttonText: 'Mulai Gratis',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rp 49.000',
    period: '/bulan',
    description: 'Ideal untuk manajemen acara profesional dan to-do list harian.',
    features: ['Acara Tidak Terbatas', 'Tamu Tidak Terbatas', 'Pengingat Otomatis via WhatsApp', 'Kustomisasi Tautan (Slug)', 'Manajemen Tugas (To-Do)'],
    buttonText: 'Pilih Paket Pro',
    popular: true,
  },
  {
    id: 'bisnis',
    name: 'Bisnis',
    price: 'Rp 149.000',
    period: '/bulan',
    description: 'Untuk tim atau organisasi dengan kebutuhan kustomisasi penuh.',
    features: ['Semua Fitur Pro', 'Manajemen Anggota Tim', 'Laporan & Analitik', 'Prioritas Dukungan CS', 'API Akses'],
    buttonText: 'Hubungi Kami',
    popular: false,
  },
]

export default function RegisterPage() {
  // State untuk mengontrol tampilan (Pricing vs Form)
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  
  // State form
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setStep(2) // Lanjut ke form registrasi
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    // Logika pendaftaran Supabase akan dimasukkan di sini nantinya
    startTransition(async () => {
      // Mockup delay proses
      await new Promise(resolve => setTimeout(resolve, 1500))
      // setError("Fitur pendaftaran sedang dikonfigurasi.")
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-50/60 via-purple-50/20 to-slate-100/50 px-4 py-12 font-sans antialiased">
      
      {/* TAHAP 1: HALAMAN PRICING */}
      {step === 1 && (
        <div className="w-full max-w-6xl mx-auto space-y-12">
          {/* Header Pricing */}
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-200 mb-4 transition-transform hover:scale-105">
              <Zap size={24} className="fill-white" />
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
              Pilih Paket Sesuai Kebutuhanmu
            </h1>
            <p className="text-lg text-slate-500 font-normal max-w-2xl mx-auto">
              Mulai atur acaramu dan tingkatkan produktivitas dengan fitur-fitur pintar dari Memoris.
            </p>
          </div>

          {/* Grid Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative rounded-3xl overflow-hidden backdrop-blur-xl border-slate-200/60 transition-all hover:shadow-xl ${
                  plan.popular 
                    ? 'bg-white shadow-2xl shadow-purple-900/10 border-purple-200 scale-100 md:scale-105 z-10' 
                    : 'bg-white/70 shadow-sm hover:bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                )}
                <CardContent className="p-8">
                  {plan.popular && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
                      <Sparkles size={14} /> Paling Populer
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-slate-900">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="ml-1 text-sm font-medium text-slate-500">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-500 h-10">{plan.description}</p>
                  
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                          <Check size={12} className="text-purple-600 stroke-[3]" />
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full mt-8 h-12 rounded-full font-semibold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md shadow-purple-500/25' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center text-slate-500 text-sm font-medium pt-8">
            Sudah punya akun? <Link href="/login" className="text-purple-600 hover:text-purple-700 font-bold underline underline-offset-4">Masuk di sini</Link>
          </div>
        </div>
      )}

      {/* TAHAP 2: FORM REGISTRASI (MUNCUL SETELAH PILIH PAKET) */}
      {step === 2 && (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setStep(1)}
            className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Kembali ke Pilihan Paket
          </button>
          
          <Card className="border-slate-200/60 shadow-xl shadow-purple-900/5 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl py-10 px-8 sm:px-12">
            <div className="text-center space-y-2 pb-8">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
                Paket Terpilih: {pricingPlans.find(p => p.id === selectedPlan)?.name}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                Buat Akun Memoris
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Lengkapi data diri untuk mulai menggunakan aplikasi.
              </p>
            </div>
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 text-xs font-semibold uppercase tracking-wider">Nama Lengkap</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <User size={18} strokeWidth={1.8} />
                    </span>
                    <Input id="name" name="name" type="text" placeholder="Nama Lengkap Anda" required className="pl-11 rounded-xl border-slate-200 focus:border-purple-500 h-12 bg-slate-50/50 text-slate-800 text-sm font-medium" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 text-xs font-semibold uppercase tracking-wider">Email</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Mail size={18} strokeWidth={1.8} />
                    </span>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" required className="pl-11 rounded-xl border-slate-200 focus:border-purple-500 h-12 bg-slate-50/50 text-slate-800 text-sm font-medium" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 text-xs font-semibold uppercase tracking-wider">Password</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Lock size={18} strokeWidth={1.8} />
                    </span>
                    <Input id="password" name="password" type="password" placeholder="Minimal 6 karakter" required className="pl-11 rounded-xl border-slate-200 focus:border-purple-500 h-12 bg-slate-50/50 text-slate-800 text-sm font-medium" />
                  </div>
                </div>
                
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-sm text-red-600 font-medium">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium h-12 rounded-full shadow-md transition-all text-sm mt-4" disabled={isPending}>
                  {isPending ? 'Memproses...' : 'Daftar Sekarang'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}