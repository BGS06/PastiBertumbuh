'use client'

import { useEffect } from 'react'
import { PartyPopper, X } from 'lucide-react'

interface RewardToastProps {
  show: boolean
  amount: string
  taskName: string
  onClose: () => void
}

export default function RewardToast({ show, amount, taskName, onClose }: RewardToastProps) {
  useEffect(() => {
    // Auto-close toast setelah 5 detik
    if (show) {
      const timer = setTimeout(() => onClose(), 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[101] animate-bounce">
      {/* Efek cincin cahaya (ring) menggunakan Tailwind */}
      <div className="bg-slate-900 border border-slate-700 p-1.5 rounded-2xl shadow-2xl flex items-center pr-4 ring-4 ring-yellow-500/30">
        <div className="bg-gradient-to-br from-yellow-400 to-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mr-3 shadow-inner">
          <PartyPopper className="text-white animate-pulse" size={24} />
        </div>
        <div className="flex-1 mr-6">
          <p className="text-xs text-slate-300 font-medium">Tugas "{taskName}" Selesai!</p>
          <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            Kamu mendapat {amount}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}