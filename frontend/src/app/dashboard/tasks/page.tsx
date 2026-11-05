'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Clock, Plus, X, Loader2 } from 'lucide-react'
import RewardToast from '@/components/RewardToast'

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === '-') return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch(e) { return dateStr }
}

export default function DaftarTugasPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reward, setReward] = useState({ show: false, amount: '', taskName: '' })
  
  const [processingIdx, setProcessingIdx] = useState<number | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ task: '', deadline: '', prioritas: 'Medium' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. MENGAMBIL DATA AWAL DARI API
  // 1. MENGAMBIL DATA AWAL DARI API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Tambahkan opsi cache: 'no-store' di sini
        const res = await fetch('/api/tasks', { cache: 'no-store' })
        const data = await res.json()
        setTasks(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Gagal menarik data tugas", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // 2. FUNGSI MENYELESAIKAN TUGAS
  const handleCompleteTask = async (taskName: string, amount: string, rowIdx: number) => {
    setProcessingIdx(rowIdx)

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'COMPLETE_TASK', task: taskName })
      })

      const rawText = await response.text()
      let result: any = {}

      try {
        result = rawText ? JSON.parse(rawText) : {}
      } catch {
        throw new Error(`Respons server bukan format JSON: ${rawText.slice(0, 100)}`)
      }

      if (response.ok && result.success) {
        const newTasks = [...tasks]
        if (newTasks[rowIdx + 1]) {
          newTasks[rowIdx + 1][4] = 'Done'
          setTasks(newTasks)
        }
        setReward({ show: true, amount: amount || 'Rp2.000', taskName: taskName })
      } else {
        console.error("Gagal mengubah status di server:", result.error || response.statusText)
        alert(result.error || `Gagal mengubah status (Status: ${response.status})`)
      }
    } catch (error: any) {
      console.error("Error eksekusi:", error.message)
      alert(`Terjadi kendala: ${error.message}`)
    } finally {
      setProcessingIdx(null)
    }
  }

  // 3. FUNGSI MENAMBAH TUGAS BARU
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.task) return
    setIsSubmitting(true)

    const today = new Date().toISOString()
    const newTaskPayload = {
      action: 'ADD_TASK',
      tanggal: today,
      project: 'Umum',
      task: newTask.task,
      deadline: newTask.deadline || '-',
      prioritas: newTask.prioritas,
      poin: 1,
      konversi: 'Rp2.000'
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskPayload)
      })

      const rawText = await response.text()
      let result: any = {}
      try {
        result = rawText ? JSON.parse(rawText) : {}
      } catch {
        throw new Error("Gagal membaca respons dari server")
      }

      if (response.ok && result.success) {
        // Susun baris array sesuai format tab Produktivitas
        const addedRow = [
          newTaskPayload.tanggal,
          newTaskPayload.project,
          newTaskPayload.task,
          newTaskPayload.deadline,
          "Belum", 
          newTaskPayload.prioritas,
          newTaskPayload.poin,
          newTaskPayload.konversi
        ]

        // Masukkan langsung ke state agar muncul instan tanpa perlu memuat ulang halaman
        const currentTasks = tasks.length > 0 ? tasks : [['Tanggal', 'Nama Project', 'Taks', 'Deadline', 'Status', 'Prioritas', 'Poin', 'Konversi']]
        setTasks([...currentTasks, addedRow])
        
        // Reset form
        setIsModalOpen(false)
        setNewTask({ task: '', deadline: '', prioritas: 'Medium' })
      } else {
        alert(result.error || 'Gagal menyimpan tugas baru ke Google Sheets.')
      }
    } catch (error: any) {
      console.error("Gagal menambah tugas:", error)
      alert(`Terjadi kendala: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // TAMPILAN LOADING AWAL
  if (loading) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="animate-spin text-purple-600" />
        <p className="text-slate-500 font-medium animate-pulse">Menyinkronkan data tugas...</p>
      </div>
    )
  }

  // PERSIAPAN BARIS DAN HEADER
  const headers = tasks[0] || []
  const rows = tasks.slice(1) || []

  // Deteksi urutan kolom (Mendukung nama kolom "Taks" atau "Tugas")
  const nameIdx = headers.findIndex((h: string) => String(h).includes('Taks') || String(h).includes('Tugas')) || 2
  const deadlineIdx = headers.findIndex((h: string) => String(h).includes('Deadline')) || 3
  const statusIdx = headers.findIndex((h: string) => String(h).includes('Status')) || 4
  const convertIdx = headers.findIndex((h: string) => String(h).includes('Konversi')) || 7

  return (
    <div className="w-full pb-12 relative animate-in fade-in duration-500">
      
      {/* HEADER HALAMAN */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daftar Tugas Harian</h1>
          <p className="text-sm text-slate-500 mt-1">Selesaikan tugas untuk mengumpulkan saldo produktivitasmu!</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          Tambah Tugas
        </button>
      </div>

      {/* JIKA TIDAK ADA TUGAS */}
      {rows.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center">
          <p className="text-slate-500 font-semibold mb-2">Belum ada tugas yang tercatat.</p>
          <p className="text-sm text-slate-400">Klik tombol Tambah Tugas untuk memulai produktivitasmu hari ini!</p>
        </div>
      ) : (
        
        /* DAFTAR GRID TUGAS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((row: any[], i: number) => {
            const statusStr = String(row[statusIdx]).toLowerCase()
            const isDone = statusStr === 'done' || statusStr === 'selesai'
            const isProcessing = processingIdx === i
            
            // Lewati merender baris jika nama tugas kosong
            if (!row[nameIdx]) return null;

            return (
              <div key={i} className={`bg-white p-5 rounded-2xl border transition-all duration-300 flex flex-col h-full ${
                isDone ? 'border-green-200 bg-green-50/60 opacity-75' : 'border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300'
              }`}>
                
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                    isDone ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {row[statusIdx] || 'Belum'}
                  </span>
                  
                  {row[convertIdx] && (
                    <span className="text-amber-500 font-extrabold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100/50">
                      {row[convertIdx]}
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-bold mb-3 flex-1 ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {row[nameIdx] || 'Tugas Tanpa Nama'}
                </h3>
                
                <div className="flex items-center text-[13px] mb-6 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Clock size={16} className="mr-2 text-purple-500" />
                  <span className="font-medium text-slate-500">Batas Waktu:</span> 
                  <span className="ml-1.5 font-semibold text-slate-700">{formatDate(row[deadlineIdx])}</span>
                </div>

                {!isDone ? (
                  <button 
                    onClick={() => handleCompleteTask(row[nameIdx], row[convertIdx], i)}
                    disabled={isProcessing}
                    className={`w-full py-3 text-white rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] ${
                      isProcessing ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckSquare size={18} />
                        Selesaikan Tugas
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-3 bg-green-100/50 text-green-600 rounded-xl text-sm font-bold text-center border border-green-200">
                    ✓ Selesai
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* TOAST KOMPONEN */}
      <RewardToast 
        show={reward.show} 
        amount={reward.amount} 
        taskName={reward.taskName} 
        onClose={() => setReward({ ...reward, show: false })} 
      />

      {/* MODAL TAMBAH TUGAS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-slate-800">Tambah Tugas Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTask} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Tugas</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Susun LPJ Keuangan..."
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-slate-800"
                  value={newTask.task}
                  onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Deadline</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-slate-800"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tingkat Prioritas</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-slate-800 font-medium"
                    value={newTask.prioritas}
                    onChange={(e) => setNewTask({...newTask, prioritas: e.target.value})}
                  >
                    <option value="High" className="text-red-600">Tinggi (High)</option>
                    <option value="Medium" className="text-amber-600">Sedang (Medium)</option>
                    <option value="Low" className="text-blue-600">Rendah (Low)</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/30 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : 'Simpan Tugas'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}