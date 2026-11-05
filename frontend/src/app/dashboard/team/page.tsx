import { getTeamMembers, syncTeamMembersFromSheet, addTeamMember, editTeamMember, deleteTeamMember } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

export default async function TeamPage() {
  const members = await getTeamMembers()

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYRs2rZvvkECHJXwuSrlbvl7zvmEK7NpfVf2gnNyhAgXbSCgdubF3kWDug3coUh1HJifqdmAQvwYka/pub?output=csv"

  async function handleSync() {
    'use server'
    await syncTeamMembersFromSheet(SHEET_CSV_URL)
  }

  return (
    <div className="w-full">
      {/* Bagian Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-slate-900">Anggota Tim</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Anggota mendaftar sendiri di grup dengan register Nama email@kamu.com. Halaman ini untuk melihat & mengelola anggota; kamu juga bisa menambah lebih awal via email (email yang sama akan tergabung saat mereka daftar di grup).
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <form action={handleSync}>
            <Button type="submit" variant="outline" className="border-slate-300">
              Sync dari Excel
            </Button>
          </form>

          {/* Modal Tambah Anggota */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 text-white hover:bg-slate-800">
                + Tambah Anggota
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Anggota</DialogTitle>
              </DialogHeader>
              <form action={addTeamMember} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="add-name">Nama</Label>
                  <Input id="add-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-email">Email (untuk kalender)</Label>
                  <Input id="add-email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-role">Role</Label>
                  <Select name="role" defaultValue="member">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">member</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-whatsapp">Nomor WhatsApp</Label>
                  <Input id="add-whatsapp" name="whatsapp" placeholder="628xxxxxxxxxx" />
                  <p className="text-[11px] text-slate-500">Format internasional tanpa "+", mis. 6281234567890.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-telegram">Username Telegram</Label>
                  <Input id="add-telegram" name="telegram" placeholder="username (tanpa @)" />
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Email adalah kunci pencocokan. Nomor/username opsional (terisi otomatis saat anggota daftar di grup).
                  </p>
                </div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Batal</Button>
                  </DialogClose>
                  <Button type="submit" className="bg-slate-900 text-white">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabel Data Anggota */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-6">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Nama</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">WhatsApp</th>
              <th className="px-6 py-4 font-medium">Telegram</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Belum ada anggota. Tambahkan yang pertama.
                </td>
              </tr>
            ) : (
              members.map((member: any) => (
                <tr key={member.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-900">{member.name}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-600">{member.whatsapp || '-'}</span>
                      {member.whatsapp && <span className="text-orange-500 font-bold leading-3 mt-1">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-600">
                        {member.telegram ? `@${member.telegram}` : '-'}
                      </span>
                      {member.telegram && <span className="text-orange-500 font-bold leading-3 mt-1">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-4">
                      
                      {/* Modal Edit Anggota */}
                      <Dialog>
                        <DialogTrigger className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                          Edit
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Anggota</DialogTitle>
                          </DialogHeader>
                          <form action={editTeamMember} className="space-y-4 py-4 text-left">
                            {/* Input hidden untuk mengirim ID ke database */}
                            <input type="hidden" name="id" value={member.id} />
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-name-${member.id}`}>Nama</Label>
                              <Input id={`edit-name-${member.id}`} name="name" defaultValue={member.name} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-email-${member.id}`}>Email (untuk kalender)</Label>
                              <Input id={`edit-email-${member.id}`} name="email" type="email" defaultValue={member.email} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-role-${member.id}`}>Role</Label>
                              <Select name="role" defaultValue={member.role}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="member">member</SelectItem>
                                  <SelectItem value="admin">admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-whatsapp-${member.id}`}>Nomor WhatsApp</Label>
                              <Input id={`edit-whatsapp-${member.id}`} name="whatsapp" defaultValue={member.whatsapp || ''} placeholder="628xxxxxxxxxx" />
                              <p className="text-[11px] text-slate-500">Format internasional tanpa "+", mis. 6281234567890.</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-telegram-${member.id}`}>Username Telegram</Label>
                              <Input id={`edit-telegram-${member.id}`} name="telegram" defaultValue={member.telegram || ''} placeholder="username (tanpa @)" />
                              <p className="text-[11px] text-slate-500 leading-tight">
                                Email adalah kunci pencocokan. Nomor/username opsional (terisi otomatis saat anggota daftar di grup).
                              </p>
                            </div>
                            <DialogFooter className="pt-4">
                              <DialogClose asChild>
                                <Button type="button" variant="ghost">Batal</Button>
                              </DialogClose>
                              <Button type="submit" className="bg-slate-900 text-white">Simpan</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      {/* Tombol Hapus */}
                      <form action={deleteTeamMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <button type="submit" className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                          Hapus
                        </button>
                      </form>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}