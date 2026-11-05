'use client'
import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, MapPin, Loader2, Link as LinkIcon, Info } from 'lucide-react'

export default function AcaraPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    namaAcara: '',
    tanggalWaktu: '',
    lokasi: ''
  })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/acara', { cache: 'no-store' })
        const data = await res.json()
        setEvents(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Gagal menarik data acara", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const formatDateTime = (isoString: string) => {
    if (!isoString || isoString === '-') return '-'
    try {
      const d = new Date(isoString)
      const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')
      return `${date}, ${time}`
    } catch {
      return isoString
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.namaAcara || !formData.tanggalWaktu || !formData.lokasi) return
    setIsSubmitting(true)

    const baseSlug = formData.namaAcara.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const randomSuffix = Math.random().toString(36).substring(2, 6)
    const slug = `/${baseSlug}-${randomSuffix}`
    
    const payload = {
      action: 'ADD_ACARA',
      nama_acara: formData.namaAcara,
      tanggal_waktu: formData.tanggalWaktu,
      lokasi: formData.lokasi,
      slug: slug
    }

    try {
      const response = await fetch('/api/acara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        // Susun baris bayangan sementara untuk UI (sesuai format baru)
        const idAcaraSementara = `EVT-${new Date().getFullYear()}-...`
        const newRow = [
          "", // Col A
          idAcaraSementara, // Col B
          payload.nama_acara, // Col C
          payload.tanggal_waktu, // Col D
          payload.lokasi, // Col E
          "Akan Datang", // Col F
          "Web", // Col G
          "-", // Col H
          payload.slug, // Col I
          "-" // Col J
        ]
        
        setEvents([...events, newRow])
        setFormData({ namaAcara: '', tanggalWaktu: '', lokasi: '' })
      } else {
        alert(result.error || 'Gagal menyimpan acara ke Google Sheets.')
      }
    } catch (error: any) {
      alert(`Terjadi kendala jaringan: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // LOGIKA PINTAR: Memotong array spreadsheet agar mengabaikan baris dashboard summary
  let dataRows = []
  if (events && events.length > 0) {
    // Cari baris yang mengandung teks "ID Acara" atau "Nama Acara" (Ini adalah Header Tabel)
    const headerIndex = events.findIndex(row => row[1] === 'ID Acara' || row[2] === 'Nama Acara')
    
    if (headerIndex !== -1) {
      // Ambil data SETELAH header
      dataRows = events.slice(headerIndex + 1)
    } else {
      dataRows = events // Fallback jika format meleset
    }
  }

  // Bersihkan baris kosong (misal jika ada baris sisa di spreadsheet)
  dataRows = dataRows.filter(row => row[1] && row[2])

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Acara & Undangan</h1>
        <p className="text-[15px] text-slate-500 mt-1">Buat dan kelola halaman proyek acaramu secara tersinkronisasi.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
        <h3 className="text-lg font-semibold text-slate-800 mb-5">Buat Acara Baru</h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-slate-600 mb-2">Nama Acara</label>
            <input 
              type="text" 
              required
              placeholder="Workshop Digital Marketing..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A855F7] bg-white text-slate-800"
              value={formData.namaAcara}
              onChange={(e) => setFormData({...formData, namaAcara: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-slate-600 mb-2">Tanggal & Waktu</label>
            <input 
              type="datetime-local" 
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A855F7] bg-white text-slate-800"
              value={formData.tanggalWaktu}
              onChange={(e) => setFormData({...formData, tanggalWaktu: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-slate-600 mb-2">Lokasi / Platform</label>
            <input 
              type="text" 
              required
              placeholder="Zoom / Gedung A..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A855F7] bg-white text-slate-800"
              value={formData.lokasi}
              onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-[150px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Buat Acara'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 size={32} className="animate-spin text-[#A855F7]" />
        </div>
      ) : dataRows.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
          <p className="text-slate-500 font-medium">Belum ada acara yang terdaftar di spreadsheet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataRows.map((row: any[], i: number) => {
            // Mapping Index Spreadsheet Berdasarkan Gambar:
            // row[1] = ID Acara
            // row[2] = Nama Acara
            // row[3] = Tanggal
            // row[4] = Lokasi / Platform
            // row[5] = Status (Selesai, Akan Datang, Berjalan)
            // row[8] = Tautan Web (Slug)

            const status = row[5] || 'Akan Datang'
            const isSelesai = status === 'Selesai'
            
            return (
              <div key={i} className={`bg-white border rounded-2xl p-6 transition-shadow flex flex-col h-full relative overflow-hidden ${
                isSelesai ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:shadow-md'
              }`}>
                
                {/* Pita Status */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-xs font-bold ${
                  status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                  status === 'Berjalan' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {status}
                </div>

                <div className="text-[11px] font-bold text-slate-400 mb-1">{row[1]}</div>
                <h2 className={`text-xl font-bold mb-3 ${isSelesai ? 'text-slate-500' : 'text-[#5B21B6]'}`}>
                  {row[2]}
                </h2>
                
                <div className="inline-flex items-center gap-1.5 bg-[#F3E8FF] text-[#A855F7] px-3 py-1.5 rounded-md text-sm font-medium mb-5 w-fit cursor-pointer hover:bg-purple-200 transition-colors border border-purple-100">
                  <LinkIcon size={14} />
                  {row[8]}
                </div>
                
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center text-slate-600">
                    <CalendarIcon size={18} className="mr-3 text-[#A855F7]" />
                    <span className="text-[14px] font-medium">{formatDateTime(row[3])}</span>
                  </div>
                  
                  <div className="flex items-center text-slate-600">
                    <MapPin size={18} className="mr-3 text-[#A855F7]" />
                    <span className="text-[14px] font-medium">{row[4]}</span>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}