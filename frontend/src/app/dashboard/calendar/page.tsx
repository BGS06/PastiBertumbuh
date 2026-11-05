import { getEvents } from '../actions'
import CalendarClient from './calendar-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Smartphone, Send } from 'lucide-react'

export const metadata = {
  title: 'Kalender - PastiBertumbuh',
}

export default async function KalenderPage() {
  const events = await getEvents()

  // Server Action: Tambah acara manual dari Pop-up Kalender
  async function handleAddEvent(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const location = formData.get('location') as string

    if (!title || !date || !time) return

    // Menggabungkan input Tanggal dan Waktu menjadi format ISO
    const event_date = new Date(`${date}T${time}:00`).toISOString()
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

    const { error } = await supabase
      .from('events')
      .insert([{ title, event_date, location, slug, user_id: user.id }])

    if (error) console.error('Error adding event:', error)

    // Merefresh halaman Kalender & Acara agar data terbaru langsung muncul
    revalidatePath('/dashboard/kalender')
    revalidatePath('/dashboard/events')
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Kalender</h1>
          <p className="text-slate-500">
            Jangan lewatkan jadwal penting dengan kalender yang terorganisir.
          </p>
        </div>
        
        <div className="flex gap-3">
          
          {/* Modal 1: Cara membagikan acara ke PastiBertumbuh (Mockup WhatsApp) */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                <Smartphone size={16} />
                Cara membagikan acara ke PastiBertumbuh
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-blue-500 text-xl font-bold">Buat Acara via WhatsApp</DialogTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Buat acara lewat WhatsApp seperti contoh berikut, PastiBertumbuh otomatis menjawab.
                </p>
              </DialogHeader>
              
              {/* Mockup Chat WhatsApp berbasis UI/CSS */}
              <div className="bg-[#EFEAE2] rounded-2xl p-4 my-2 flex flex-col gap-3 h-64 overflow-y-auto border-[6px] border-slate-800 shadow-inner relative">
                {/* Notch Mockup iPhone */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-2xl"></div>
                
                <div className="mt-6 flex justify-end">
                  <div className="bg-[#D9FDD3] text-slate-800 text-[13px] p-3 rounded-xl rounded-tr-sm max-w-[85%] shadow-sm leading-relaxed">
                    PastiBertumbuh, buatkan event rutin setiap Jumat jam 4 sore untuk weekly review tim bareng Siska dan Rena.
                    <span className="block text-right text-[10px] text-slate-500 mt-1">14:36 <span className="text-blue-500">✓✓</span></span>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 text-[13px] p-3 rounded-xl rounded-tl-sm max-w-[90%] shadow-sm space-y-1.5 leading-relaxed">
                    <p>✅ Event berhasil dijadwalkan.</p>
                    <p>Detail acara:<br/>Agenda: Weekly review<br/>Waktu: Setiap hari Jumat<br/>Peserta: Siska dan Rena</p>
                    <p>Link: <span className="text-blue-500 hover:underline cursor-pointer">http://meet.google.com/adks</span></p>
                    <p className="pt-2 text-slate-500">Undangan serta link meeting telah dikirimkan kepada seluruh peserta.</p>
                    <span className="block text-right text-[10px] text-slate-500 mt-1">14:37</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <Button className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-full font-semibold h-11">
                  <Smartphone className="mr-2" size={18} /> Buat Acara dari WhatsApp
                </Button>
                <Button variant="outline" className="w-full text-blue-400 border-blue-200 rounded-full font-semibold h-11 hover:bg-blue-50">
                  <Send className="mr-2" size={18} /> Buat Acara dari Telegram (Coming Soon)
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal 2: Tambah Acara Manual */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-sm">
                Tambah Acara
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Acara Baru</DialogTitle>
              </DialogHeader>
              
              <form action={handleAddEvent} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Acara</Label>
                  <Input id="title" name="title" placeholder="Misal: Reuni di Alses" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Waktu (WIB)</Label>
                    <Input id="time" name="time" type="time" defaultValue="19:00" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi / Link Meeting</Label>
                  <Input id="location" name="location" placeholder="Misal: Google Meet / Cafe..." />
                </div>
                
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Batal</Button>
                  </DialogClose>
                  <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    Simpan Acara
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* Komponen Kalender Interaktif */}
      <CalendarClient />
    </div>
  )
}