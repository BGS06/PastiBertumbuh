'use client'

import { useState, useEffect } from 'react'
import { User, Crown, CheckCircle2, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

// Data Definisi Tier sesuai rencana Batch 3
const TIERS = [
  {
    id: 1,
    name: "Tier 1 (Starter)",
    price: "Rp 19.000",
    color: "from-slate-400 to-slate-500",
    badgeBg: "bg-slate-100 text-slate-700",
    features: [
      "Akses Dashboard Keuangan & Tugas",
      "Unlimited Catatan Tugas Harian",
      "Sistem Gamifikasi & Konversi Poin",
      "Akses Penuh via Website"
    ]
  },
  {
    id: 2,
    name: "Tier 2 (Pro)",
    price: "Rp 29.000",
    color: "from-blue-500 to-indigo-600",
    badgeBg: "bg-blue-100 text-blue-700",
    features: [
      "Semua Fitur Tier 1",
      "Notifikasi Pengingat Pagi & Sore (WA)",
      "Bot WhatsApp 2 Arah (Cek & Done Tugas)"
    ]
  },
  {
    id: 3,
    name: "Tier 3 (Elite)",
    price: "Rp 59.000",
    color: "from-amber-400 to-orange-500",
    badgeBg: "bg-amber-100 text-amber-700",
    features: [
      "Semua Fitur Tier 2",
      "Scan Struk Belanja Otomatis via WA",
      "Input Tugas via Voice Note WA",
      "Download & Export Laporan Keuangan"
    ]
  }
]

export default function ProfileTierPage() {
  // Dalam implementasi asli, currentTier didapat dari fungsi getUserTier() di actions.ts
  const [currentTier, setCurrentTier] = useState<number>(1) 
  const [userEmail, setUserEmail] = useState<string>("user@pastibertumbuh.com")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulasi penarikan data user dan tier dari database/session (Supabase/Google Sheets)
    const fetchUserData = async () => {
      // const tier = await getUserTier(session.email) 
      // setCurrentTier(tier)
      setTimeout(() => {
        setLoading(false)
      }, 800)
    }
    fetchUserData()
  }, [])

  const handleUpgradeClick = (targetTier: string) => {
    const adminWA = "6281234567890" // GANTI DENGAN NOMOR WA ADMIN
    const text = `Halo Admin PastiBertumbuh, saya ingin upgrade akun dengan email *${userEmail}* ke *${targetTier}*. Bagaimana proses pembayarannya?`
    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(text)}`, "_blank")
  }

  if (loading) {
    return <div className="w-full p-12 text-center text-slate-500 animate-pulse font-medium">Memuat profil akun...</div>
  }

  return (
    <div className="w-full pb-12">
      {/* HEADER PROFIL */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-inner shrink-0">
          <User size={36} className="text-white" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl font-bold text-slate-800">Profil Pengguna</h1>
          <p className="text-slate-500 mb-3">{userEmail}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-semibold">
            <ShieldCheck size={16} />
            Akun Aktif
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Crown className="text-amber-500" />
          Status Langganan (Tier)
        </h2>
        <p className="text-sm text-slate-500 mt-1">Tingkatkan tier untuk membuka fitur produktivitas tingkat lanjut.</p>
      </div>

      {/* GRID KARTU TIER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const isActive = currentTier === tier.id
          const isLocked = currentTier < tier.id

          return (
            <div 
              key={tier.id} 
              className={`relative bg-white rounded-3xl p-6 border-2 flex flex-col transition-all duration-300 ${
                isActive 
                  ? 'border-purple-500 shadow-[0_8px_30px_rgb(168,85,247,0.15)] scale-[1.02] md:scale-105 z-10' 
                  : 'border-slate-100 shadow-sm hover:border-slate-300'
              }`}
            >
              {/* Badge Aktif */}
              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Zap size={14} className="fill-white" />
                  PAKET SAAT INI
                </div>
              )}

              <div className="mb-6 text-center mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${tier.badgeBg}`}>
                  {tier.name}
                </span>
                <h3 className="text-3xl font-extrabold text-slate-800">{tier.price}<span className="text-sm font-normal text-slate-500">/bln</span></h3>
              </div>

              {/* Daftar Fitur */}
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    {isActive || currentTier > tier.id ? (
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                    ) : isActive ? (
                       <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <Lock size={18} className="text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span className={isActive || currentTier >= tier.id ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Tombol Aksi */}
              {isActive ? (
                <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-sm border border-slate-200">
                  Sedang Digunakan
                </button>
              ) : currentTier > tier.id ? (
                <button disabled className="w-full py-3 rounded-xl bg-transparent text-slate-400 font-bold text-sm border border-slate-200">
                  Sudah Terbuka
                </button>
              ) : (
                <button 
                  onClick={() => handleUpgradeClick(tier.name)}
                  className={`w-full py-3 rounded-xl text-white font-bold text-sm flex justify-center items-center gap-2 transition-transform active:scale-95 bg-gradient-to-r ${tier.color} shadow-md`}
                >
                  Upgrade Sekarang
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}