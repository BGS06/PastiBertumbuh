import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, CalendarDays, Bell, Users, Sparkles, Check, ArrowRight } from 'lucide-react'

const pricingPlans = [
  {
    id: 'gratis',
    name: 'Gratis',
    price: 'Rp 0',
    period: '/bulan',
    description: 'Cocok untuk mencoba fitur dasar dan acara berskala kecil.',
    features: ['1 Acara Aktif', 'Maksimal 50 Tamu', 'Pengingat Standar', 'Tema Dasar'],
    buttonText: 'Mulai Gratis',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rp 49.000',
    period: '/bulan',
    description: 'Ideal untuk manajemen acara profesional dan to-do list harian.',
    features: ['Acara Tidak Terbatas', 'Tamu Tidak Terbatas', 'Pengingat WhatsApp', 'Kustomisasi Tautan'],
    buttonText: 'Pilih Paket Pro',
    popular: true,
  },
  {
    id: 'bisnis',
    name: 'Bisnis',
    price: 'Rp 149.000',
    period: '/bulan',
    description: 'Untuk tim dengan kebutuhan kustomisasi penuh.',
    features: ['Semua Fitur Pro', 'Manajemen Tim', 'Laporan & Analitik', 'Prioritas Dukungan CS'],
    buttonText: 'Hubungi Kami',
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-purple-200">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <Zap className="text-purple-600 fill-purple-600" size={24} />
          <span className="text-xl font-bold text-slate-900 tracking-tight">PastiBertumbuh</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Masuk
          </Link>
          <Link href="/register">
            <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-5 h-9 text-sm">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Kelola Acara & Waktu <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Tanpa Beban Pikiran
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Platform all-in-one untuk manajemen undangan, pelacakan tamu, dan pengingat otomatis agar hidupmu lebih tertata.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-base font-semibold w-full sm:w-auto shadow-xl shadow-slate-900/20">
              Mulai Sekarang <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
          <Link href="#pricing">
            <Button variant="outline" className="h-14 px-8 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 text-base font-semibold w-full sm:w-auto">
              Lihat Harga
            </Button>
          </Link>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
              Harga Transparan, Sesuai Kebutuhan
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Mulai gratis, tingkatkan kapan saja. Tidak ada biaya tersembunyi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'bg-slate-900 text-white shadow-xl scale-100 md:scale-105 z-10 border-slate-800' 
                    : 'bg-white border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                )}
                <CardContent className="p-8">
                  {plan.popular && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                      <Sparkles size={14} /> Paling Populer
                    </div>
                  )}
                  <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className={`ml-1 text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-4 text-sm h-10 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                  
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.popular ? 'bg-purple-500/20' : 'bg-purple-100'
                        }`}>
                          <Check size={12} className={plan.popular ? 'text-purple-400 stroke-[3]' : 'text-purple-600 stroke-[3]'} />
                        </div>
                        <span className={`text-sm font-medium ${plan.popular ? 'text-slate-300' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register">
                    <Button 
                      className={`w-full mt-8 h-12 rounded-full font-semibold transition-all ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-0'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PastiBertumbuh. All rights reserved.</p>
      </footer>
    </div>
  )
}