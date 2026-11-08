import { getEventById, getGuests, addGuest } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import CopyLinkButton from './CopyLinkButton'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  // NEXT.js 15+: Await params terlebih dahulu
  const resolvedParams = await params;
  const eventId = resolvedParams.eventId;
  
  // Ambil data event
  const event = await getEventById(eventId);
  
  // Penanganan Error: Jika acara tidak ada atau bukan milik user
  if (!event) {
    return (
      <div className="p-8 text-center text-slate-500 max-w-xl mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Acara tidak ditemukan</h2>
        <p className="mb-6">Acara mungkin telah dihapus atau Anda tidak memiliki akses.</p>
        <Link href="/dashboard/events">
          <Button variant="outline"><ArrowLeft size={16} className="mr-2" /> Kembali ke Daftar Acara</Button>
        </Link>
      </div>
    )
  }

  const guests = await getGuests(eventId)
  
  // Wrapper Server Action yang mengembalikan tipe void untuk menghindari error form
  const handleAddGuest = async (formData: FormData) => {
    "use server";
    await addGuest(eventId, formData);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header & Info Acara */}
      <div>
        <Link href="/dashboard/events" className="inline-flex items-center text-sm text-purple-600 hover:underline mb-4">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Acara
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{event.title}</h1>
        <div className="flex gap-4 text-sm text-slate-600 font-medium">
          <span className="flex items-center gap-1.5"><CalendarDays size={16}/> {new Date(event.event_date).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
          <span className="flex items-center gap-1.5"><MapPin size={16}/> {event.location || '-'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form Tambah Tamu */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200 shadow-sm sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tambah Tamu Baru</CardTitle>
              <CardDescription>Masukkan data tamu untuk membuat link undangan khusus.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleAddGuest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap Tamu</Label>
                  <Input id="name" name="name" placeholder="Misal: Budi Santoso" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">No. WhatsApp (Opsional)</Label>
                  <Input id="phone_number" name="phone_number" placeholder="Misal: 08123456789" />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Simpan Tamu</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Tabel Data Tamu */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Daftar Tamu ({guests.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Nama Tamu</th>
                      <th className="px-6 py-4">No. WA</th>
                      <th className="px-6 py-4">Status RSVP</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {guests.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          Belum ada tamu yang ditambahkan.
                        </td>
                      </tr>
                    ) : (
                      guests.map((guest: any) => (
                        <tr key={guest.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">{guest.name}</td>
                          <td className="px-6 py-4 text-slate-600">{guest.phone_number || '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${guest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${guest.status === 'attending' ? 'bg-green-100 text-green-800' : ''}
                              ${guest.status === 'declined' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {guest.status === 'pending' && 'Menunggu'}
                              {guest.status === 'attending' && 'Hadir'}
                              {guest.status === 'declined' && 'Batal'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <CopyLinkButton slug={event.slug} guestId={guest.id} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}