import { getContacts, addContact, deleteContact } from '../actions'
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
import { Search, Users, Smartphone, Info, Contact, Trash2 } from 'lucide-react'

export const metadata = {
  title: 'Teman dan Kontak - Memoris',
}

export default async function TemanPage() {
  const contacts = await getContacts()

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-500 mb-1">Teman dan Kontak</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Kirim pengingat ke teman melalui WhatsApp, Email atau Undangan Kalender dan kelola koneksi Anda.
          </p>
        </div>
        
        {/* Modal Tambah Kontak */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-sm w-full sm:w-auto whitespace-nowrap">
              Tambah Kontak
            </button>
          </DialogTrigger>
          {/* Tambahan class w-[95vw] dan overflow-x-hidden untuk responsivitas Mobile */}
          <DialogContent className="w-[95vw] sm:max-w-[425px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-5 sm:p-6">
            <DialogHeader className="mb-2">
              <DialogTitle className="flex items-center gap-2 text-blue-500 text-xl font-bold">
                <div className="bg-blue-50 p-1.5 rounded-md">
                  <Contact size={20} />
                </div>
                Tambah Kontak
              </DialogTitle>
            </DialogHeader>
            
            <form action={addContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-600">Nama Teman <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" placeholder="Masukkan nama" required className="border-slate-200 w-full" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-600">Alamat Email <span className="text-red-500">*</span></Label>
                <Input id="email" name="email" type="email" placeholder="Masukkan email" required className="border-slate-200 w-full" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-slate-600">Nomor WhatsApp (Opsional)</Label>
                <Input id="whatsapp" name="whatsapp" placeholder="contoh: +62 812..." className="border-slate-200 w-full" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-slate-600">Username Instagram (Opsional)</Label>
                <Input id="instagram" name="instagram" placeholder="username" className="border-slate-200 w-full" />
              </div>

              {/* Info Praktis */}
              <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100 mt-4 break-words">
                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700 leading-relaxed">
                  Ingin lebih praktis? Tambahkan kontak langsung lewat WhatsApp Memoris. <span className="text-blue-600 font-semibold cursor-pointer hover:underline break-all">+6285885967842</span>
                </p>
              </div>

              {/* Mockup Chat WhatsApp */}
              <div className="bg-[#EFEAE2] rounded-2xl p-4 flex flex-col gap-3 h-48 overflow-hidden border-[6px] border-slate-800 shadow-inner relative mt-2 w-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 bg-slate-800 rounded-b-2xl"></div>
                
                <div className="mt-5 flex justify-end">
                  {/* Tambahan break-words agar teks memanjang turun */}
                  <div className="bg-[#D9FDD3] text-slate-800 text-[12px] p-2.5 rounded-xl rounded-tr-sm max-w-[90%] shadow-sm leading-relaxed break-words">
                    Memoris, tolong tambahkan nomor Michelle +62898123444
                    <span className="block text-right text-[9px] text-slate-500 mt-1">14:36 <span className="text-blue-500">✓✓</span></span>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 text-[12px] p-2.5 rounded-xl rounded-tl-sm max-w-[90%] shadow-sm leading-relaxed break-words">
                    ✅ Nomor berhasil ditambahkan ke daftar Teman dan Kontakmu.
                    <span className="block text-right text-[9px] text-slate-500 mt-1">14:37</span>
                  </div>
                </div>
              </div>

              {/* Footer Modal - Hanya tombol Simpan yang merentang penuh */}
              <div className="pt-4 mt-2 w-full">
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full h-11 border-0 font-medium">
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Input Pencarian */}
      <div className="max-w-md mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Cari kontak" 
            className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-100 w-full" 
          />
        </div>
      </div>

      {/* Tampilan Kondisional: Empty State vs Tabel Data */}
      {contacts.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Kiri: Kosong */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[300px]">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-500">
              <Users size={28} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Belum ada teman di daftar Kamu</h3>
            <p className="text-sm text-slate-500">Tambah kontak untuk memulai</p>
          </div>

          {/* Card Kanan: Promo WhatsApp */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[300px]">
            <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
               <div className="w-20 h-32 bg-purple-100/50 rounded-2xl border-4 border-purple-200 rotate-12 flex items-center justify-center shadow-sm">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">
                    <Smartphone size={20} />
                  </div>
               </div>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Siap untuk Terhubung?</h3>
            <p className="text-sm text-slate-500 px-4">Kirim permintaan pertemanan dan jadwalkan pengingat melalui WhatsApp.</p>
          </div>
        </div>
      ) : (
        /* Tabel Data Kontak - Diberi overflow-x-auto agar responsif di HP */
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-sm w-full">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Nama</th>
                <th className="px-6 py-4 whitespace-nowrap">Email</th>
                <th className="px-6 py-4 whitespace-nowrap">WhatsApp</th>
                <th className="px-6 py-4 whitespace-nowrap">Instagram</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {contacts.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{contact.name}</td>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.whatsapp || '-'}</td>
                  <td className="px-6 py-4">{contact.instagram ? `@${contact.instagram}` : '-'}</td>
                  <td className="px-6 py-4 text-right">
                 <form action={deleteContact}>
                   <input type="hidden" name="id" value={contact.id} />
                   <button type="submit" className="text-slate-400 hover:text-red-500 transition-colors">
                     <Trash2 size={18} />
                   </button>
                 </form>
               </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}