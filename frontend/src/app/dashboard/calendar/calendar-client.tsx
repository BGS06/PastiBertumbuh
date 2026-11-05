'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Video, Info, Loader2 } from 'lucide-react'

export default function CalendarClient() {
  // State Navigasi Waktu
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  // State Data Acara dari Spreadsheet
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Tarik Data dari Endpoint Spreadsheet (API Acara)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/acara', { cache: 'no-store' })
        const data = await res.json()
        
        // Buang bagian "Dashboard" (baris 1-8). Asumsi header "ID Acara" ada di row index 8
        let dataRows = []
        if (Array.isArray(data) && data.length > 0) {
          const headerIndex = data.findIndex(row => row[1] === 'ID Acara' || row[2] === 'Nama Acara')
          if (headerIndex !== -1) {
            dataRows = data.slice(headerIndex + 1)
          } else {
            dataRows = data
          }
        }
        
        // Filter baris kosong
        const validRows = dataRows.filter(row => row[1] && row[2])
        setEvents(validRows)
      } catch (error) {
        console.error("Gagal menarik data acara:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Kalkulasi Grid Kalender
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const days = []
  
  // Tanggal bulan sebelumnya
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) })
  }
  // Tanggal bulan ini
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) })
  }
  // Tanggal bulan berikutnya
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) })
  }

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  const baseYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => baseYear - 5 + i)

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))

  // Helper Pencocokan Tanggal
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  // Helper Parsing String ISO ke Objek Date yang Aman
  const parseEventDate = (dateStr: string) => {
    if (!dateStr || dateStr === '-') return null
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? null : d
  }

  // Filter acara KHUSUS tanggal yang sedang di-klik (Untuk Sidebar Kanan)
  const selectedDateEvents = events.filter(event => {
    if (!selectedDate) return false
    const eventDate = parseEventDate(event[3]) // Index 3 adalah 'Tanggal' di spreadsheet-mu
    if (!eventDate) return false
    return isSameDay(eventDate, selectedDate)
  })

  // Filter acara KHUSUS bulan yang sedang dilihat (Untuk Marker di Kalender Kiri)
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseEventDate(event[3])
      if (!eventDate) return false
      return isSameDay(eventDate, date)
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* ------------------------------- */}
      {/* KIRI: GRID KALENDER             */}
      {/* ------------------------------- */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        
        {/* KONTROL BULAN & TAHUN */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <select 
              value={month}
              onChange={(e) => {
                const newDate = new Date(currentDate)
                newDate.setMonth(parseInt(e.target.value))
                setCurrentDate(newDate)
              }}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              {monthNames.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>

            <select 
              value={year}
              onChange={(e) => {
                const newDate = new Date(currentDate)
                newDate.setFullYear(parseInt(e.target.value))
                setCurrentDate(newDate)
              }}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* NAMA HARI */}
        <div className="grid grid-cols-7 mb-4 text-center">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
            <div key={day} className="text-sm font-extrabold text-slate-800">{day}</div>
          ))}
        </div>

        {/* LOADING GRID ATAU KOTAK TANGGAL */}
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={36} className="animate-spin mb-3 text-blue-500" />
            <p className="font-medium">Menarik data dari Spreadsheet...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-3">
            {days.map((d, idx) => {
              const isSelected = selectedDate ? isSameDay(selectedDate, d.date) : false
              const isToday = isSameDay(new Date(), d.date)
              const dayEvents = getEventsForDay(d.date)

              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDate(d.date)}
                  className={`min-h-[110px] border rounded-2xl p-2.5 cursor-pointer transition-all flex flex-col group ${
                    !d.isCurrentMonth ? 'bg-slate-50 border-slate-100 text-slate-400 opacity-60' : 
                    isSelected ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mb-2 ${
                    isSelected ? 'bg-white text-blue-600 shadow-sm' : 
                    isToday ? 'bg-blue-100 text-blue-700' : ''
                  }`}>
                    {d.day}
                  </div>

                  {/* Marker Acara di Kotak Tanggal */}
                  {dayEvents.length > 0 && d.isCurrentMonth && (
                    <div className="flex flex-col gap-1 mt-auto">
                      {dayEvents.slice(0, 2).map((ev, i) => (
                        <div key={i} className={`text-[10px] truncate rounded p-1 font-medium flex items-center gap-1 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
                          {ev[2]} {/* Index 2 = Nama Acara */}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className={`text-[10px] pl-1 font-medium ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          +{dayEvents.length - 2} acara
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ------------------------------- */}
      {/* KANAN: SIDEBAR AKTIVITAS JADWAL */}
      {/* ------------------------------- */}
      <div className="w-full lg:w-[420px] bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-full min-h-[600px]">
        
        {/* Header Sidebar */}
        <div className="px-7 py-6 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-800">
            Aktivitas Tanggal {selectedDate ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : 'Hari ini'}
          </h2>
        </div>
        
        {/* List Acara Berdasarkan Tanggal yang Diklik */}
        <div className="p-7 flex-1 bg-slate-50/50 rounded-b-3xl overflow-y-auto custom-scrollbar">
          
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <Loader2 size={32} className="animate-spin text-blue-400" />
             </div>
          ) : selectedDateEvents.length === 0 ? (
            
            /* UI Jika Kosong */
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center mb-5 text-slate-300">
                <CalendarIcon size={32} />
              </div>
              <p className="font-bold text-slate-700 text-lg mb-1">Belum ada acara</p>
              <p className="text-sm text-slate-500 px-4">Pilih tanggal lain di kalender untuk melihat detail acara.</p>
            </div>
            
          ) : (
            
            /* UI Jika Ada Acara */
            <div className="space-y-4">
              {selectedDateEvents.map((event, idx) => {
                
                // Parsing Data dari Spreadsheet Array
                // row[2] = Nama, row[3] = Tanggal/Waktu, row[4] = Lokasi, row[5] = Status
                const namaAcara = event[2]
                const rawDate = parseEventDate(event[3])
                const eventTime = rawDate ? rawDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'
                
                const lokasi = event[4]
                const isMeetLink = lokasi && String(lokasi).includes('meet.google.com')
                const status = event[5] || 'Akan Datang'

                return (
                  <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all group relative overflow-hidden">
                    
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>

                    <div className="flex items-start justify-between mb-3 pl-2">
                      <div className="pr-2">
                         <div className={`text-[10px] font-extrabold uppercase tracking-wider mb-1 ${
                            status === 'Selesai' ? 'text-green-500' : 
                            status === 'Berjalan' ? 'text-amber-500' : 'text-blue-500'
                         }`}>
                           • {status}
                         </div>
                         <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors leading-tight">
                           {namaAcara}
                         </h4>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                        {eventTime} WIB
                      </span>
                    </div>
                    
                    <div className="pl-2 space-y-2">
                      {lokasi && lokasi !== '-' ? (
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <MapPin size={15} className="text-slate-400 shrink-0" />
                          <span className="truncate">{lokasi}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-slate-400 italic">
                          <Info size={15} className="shrink-0" />
                          <span>Lokasi belum ditentukan</span>
                        </div>
                      )}
                    </div>

                    {/* Tombol Pintas Google Meet */}
                    {isMeetLink && (
                      <div className="mt-4 pl-2">
                        <a 
                          href={String(lokasi).startsWith('http') ? lokasi : `https://${lokasi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <Video size={16} />
                          Gabung Google Meet
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
          )}
        </div>
      </div>
      
    </div>
  )
}