'use client'

import { useState } from 'react'
import { Bell, Calendar, Clock, Search, Trash2, Pencil, Info, Plus, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PengingatPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [reminderType, setReminderType] = useState('sekali')

  const stats = [
    { label: 'Aktif', value: '0', color: 'text-purple-600', bg: 'bg-purple-100', tooltip: 'Pengingat sekali kirim yang belum kedaluwarsa.' },
    { label: 'Berulang', value: '0', color: 'text-rose-500', bg: 'bg-rose-100', tooltip: 'Pengingat yang diatur untuk berulang secara otomatis.' },
    { label: 'Selesai', value: '1', color: 'text-green-500', bg: 'bg-green-100', tooltip: 'Pengingat yang sudah lewat waktunya.' },
    { label: 'Total', value: '1', color: 'text-orange-500', bg: 'bg-orange-100', tooltip: 'Total seluruh pengingat Anda.' },
  ]

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto space-y-8 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-[#0ea5e9]">Pengingat</h1>
            <p className="text-slate-500 text-sm mt-1">Atur pengingat harian, mingguan, dan momen penting langsung dari obrolan.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm">
                Buat Pengingat Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#0ea5e9]">Buat Pengingat via WhatsApp</DialogTitle>
                <p className="text-slate-500 text-sm">Tulis pengingat lewat WhatsApp seperti contoh berikut, Memoris otomatis menjawab.</p>
              </DialogHeader>
              <div className="bg-blue-50/50 rounded-xl p-4 flex justify-center items-center h-64 border border-blue-100 my-4">
                {/* Mockup Chat Image Placeholder */}
                <div className="bg-white w-48 h-full rounded-[2rem] border-4 border-slate-800 shadow-lg flex flex-col overflow-hidden">
                    <div className="bg-slate-100 p-2 text-[10px] text-center border-b">Memoris Chat</div>
                    <div className="p-3 space-y-2 flex-1">
                        <div className="bg-[#e7ffdb] rounded-lg p-2 text-[8px] self-end ml-4 shadow-sm">Memoris, jangan lupa ingatkan aku bayar kos Senin pagi jam 8 ya.</div>
                        <div className="bg-white border rounded-lg p-2 text-[8px] self-start mr-4 shadow-sm">Pengingat berhasil dibuat.</div>
                    </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl h-12 shadow-md">
                  Buat Pengingat dari WhatsApp
                </Button>
                <Button variant="outline" className="w-full rounded-xl h-12 text-[#0ea5e9] border-[#0ea5e9]">
                  Buat Pengingat dari Telegram (Coming Soon)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Bell className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger><Info size={16} className="text-slate-400 hover:text-slate-600" /></TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white max-w-[200px] text-xs">
                  <p>{stat.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Cari pengingat" className="pl-10 bg-white border-slate-200 h-10 rounded-xl" />
          </div>
          <Select defaultValue="semua">
            <SelectTrigger className="w-32 bg-white border-slate-200 h-10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="semua">Semua</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="terbaru">
            <SelectTrigger className="w-32 bg-white border-slate-200 h-10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="terbaru">Terbaru</SelectItem></SelectContent>
          </Select>
          <Button variant="outline" className="text-rose-500 border-rose-200 hover:bg-rose-50 h-10 rounded-xl">
            <Trash2 size={16} className="mr-2" /> Deleted
          </Button>
        </div>

        {/* List Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
          {/* Card Item */}
          <div className="p-4 border-b border-slate-50">
            <div className="max-w-md bg-blue-50/30 rounded-xl p-4 border border-blue-100 flex gap-4 relative group hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-800">Reuni di Alses</h4>
                  
                  {/* Action Buttons (Edit & Delete) */}
                  <div className="flex items-center gap-2 text-slate-400">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <button className="hover:text-blue-500"><Pencil size={16} /></button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-[#0ea5e9] text-xl">
                            <CalendarDays size={24} /> Edit Pengingat
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Teks Pengingat <span className="text-rose-500">*</span></label>
                            <Input defaultValue="Reuni di Alses" className="rounded-xl h-12" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">Waktu <span className="text-rose-500">*</span></label>
                              <Input type="time" defaultValue="19:00" className="rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">Tanggal <span className="text-rose-500">*</span></label>
                              <Input type="date" defaultValue="2026-09-07" className="rounded-xl h-12" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Jenis Pengingat</label>
                            <div className="flex gap-2">
                              <Button 
                                variant={reminderType === 'sekali' ? 'default' : 'outline'}
                                className={`flex-1 rounded-xl h-12 ${reminderType === 'sekali' ? 'bg-[#0ea5e9] hover:bg-blue-500' : 'text-slate-500'}`}
                                onClick={() => setReminderType('sekali')}
                              >Sekali Saja</Button>
                              <Button 
                                variant={reminderType === 'berulang' ? 'default' : 'outline'}
                                className={`flex-1 rounded-xl h-12 ${reminderType === 'berulang' ? 'bg-[#0ea5e9] hover:bg-blue-500' : 'text-slate-500'}`}
                                onClick={() => setReminderType('berulang')}
                              >Berulang</Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button variant="outline" className="flex-1 rounded-xl h-12 text-[#0ea5e9] border-[#0ea5e9]" onClick={() => setIsEditOpen(false)}>Batal</Button>
                          <Button className="flex-1 rounded-xl h-12 bg-gradient-to-r from-blue-500 to-purple-500">Simpan</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button className="hover:text-rose-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mt-1">Sen, 7 September 2026 • 19.00 WIB</p>
                <div className="mt-3">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-semibold px-3 border-transparent shadow-none">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="flex justify-center py-6 border-t border-slate-100">
             <div className="flex items-center gap-4 text-sm">
                <button className="text-slate-300 cursor-not-allowed">{'<'}</button>
                <span className="text-purple-600 font-medium">1</span>
                <button className="text-slate-300 cursor-not-allowed">{'>'}</button>
             </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}