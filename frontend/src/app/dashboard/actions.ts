'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Diubah menjadi getTasks karena mengambil data dari tabel 'tasks'
export async function getTasks() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching tasks:', error)
  return data || []
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title = formData.get('title') as string
  if (!title) return

  const { error } = await supabase
    .from('tasks')
    .insert([{ title, user_id: user.id }])

  if (error) {
    console.error('Error creating task:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/tasks')
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', taskId)

  if (error) {
    console.error('Error toggling task:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/tasks')
}

// Ini adalah fungsi getEvents yang sebenarnya untuk tabel 'events'
export async function getEvents() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching events:', error)
  return data || []
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title = formData.get('title') as string
  const event_date = formData.get('event_date') as string
  const location = formData.get('location') as string

  if (!title || !event_date) return

  // Generate unique slug
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

  const { error } = await supabase
    .from('events')
    .insert([{ title, event_date, location, slug, user_id: user.id }])

  if (error) {
    console.error('Error creating event:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/events')
}

export async function getEventById(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('user_id', user.id) // Proteksi: Hanya pemilik acara yang bisa mengambil data
    .single()

  if (error) {
    console.error('Error fetching event by ID:', error)
    return null
  }
  return data
}

export async function getGuests(eventId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching guests:', error)
  return data || []
}

export async function addGuest(eventId: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const phone_number = formData.get('phone_number') as string

  if (!name) return

  const { error } = await supabase
    .from('guests')
    .insert([{ 
      event_id: eventId, 
      name, 
      phone_number, 
      status: 'pending' 
    }])

  if (error) {
    console.error('Error adding guest:', error)
    return { error: error.message }
  }

  // Revalidasi spesifik ke path halaman acara ini
  revalidatePath(`/dashboard/events/${eventId}`)
}

export async function syncTeamMembersFromSheet(csvUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  try {
    // 1. Ambil data CSV dari Google Sheets
    const res = await fetch(csvUrl, { cache: 'no-store' })
    const csvText = await res.text()
    
    // Pecah baris CSV (Asumsi susunan kolom Excel: Nama, Email, Role, WhatsApp, Telegram)
    const rows = csvText.split('\n').map(row => row.split(','))

    // 2. Ambil daftar email yang sudah ada di database saat ini
    const { data: existingMembers } = await supabase
      .from('team_members')
      .select('email')
      .eq('user_id', user.id)

    // Buat Set email untuk pengecekan duplikat dengan cepat
    const existingEmails = new Set(existingMembers?.map(m => m.email) || [])
    
    // 3. Filter dan bersihkan data dari Excel
    const membersToInsert = rows.slice(1)
      .filter(col => col[0] && col[0].trim() !== '') // Abaikan baris jika Nama kosong
      .map(col => {
        // Hilangkan tanda kutip ganda (") bawaan CSV menggunakan regex
        const cleanName = col[0]?.replace(/^"|"$/g, '').trim()
        const cleanEmail = col[1]?.replace(/^"|"$/g, '').trim()
        const cleanRole = col[2]?.replace(/^"|"$/g, '').trim() || 'member'
        const cleanWhatsapp = col[3]?.replace(/^"|"$/g, '').trim() || null
        const cleanTelegram = col[4]?.replace(/^"|"$/g, '').trim() || null

        return {
          user_id: user.id,
          name: cleanName,
          email: cleanEmail,
          role: cleanRole,
          whatsapp: cleanWhatsapp,
          telegram: cleanTelegram,
        }
      })
      // 4. CEK DUPLIKAT: Hanya ambil data yang emailnya belum terdaftar
      .filter(member => member.email && !existingEmails.has(member.email))

    // Jika semua data dari CSV sudah ada di database, lewati proses insert
    if (membersToInsert.length === 0) return { success: true, count: 0 }

    // 5. Masukkan hanya data yang benar-benar baru
    const { error } = await supabase.from('team_members').insert(membersToInsert)
    if (error) throw error

    revalidatePath('/dashboard/team') 
    return { success: true, count: membersToInsert.length }
  } catch (error: any) {
    console.error('Error syncing team members:', error)
    return { error: error.message }
  }
}

// Fungsi untuk mengambil data anggota tim dari database
export async function getTeamMembers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching team members:', error)
  return data || []
}

// Fungsi untuk menyimpan anggota baru dari form pop-up dan mengirimkannya ke Spreadsheet
export async function addTeamMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  const whatsapp = formData.get('whatsapp') as string
  const telegram = formData.get('telegram') as string

  if (!name || !email) return

  // 1. Simpan ke Supabase (Database Web)
  const { error } = await supabase
    .from('team_members')
    .insert([{
      user_id: user.id,
      name,
      email,
      role: role || 'member',
      whatsapp: whatsapp || null,
      telegram: telegram || null
    }])

  if (error) {
    console.error('Error adding team member:', error)
    return
  }

  // 2. Kirim data ke Google Sheets melalui Web App URL (Metode GET yang Anti-Gagal)
  try {
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbxFAKpFGCElRdVIWdjFppiRLB0DhUvirNfFbgROGCn2xSojNOuknR8M3GRXZH8Xoa-czw/exec' 
    
    // Kita tempelkan datanya ke dalam format URL
    const params = new URLSearchParams({
      name,
      email,
      role: role || 'member',
      whatsapp: whatsapp || '',
      telegram: telegram || ''
    })
    
    // Gabungkan URL dengan parameter, lalu gunakan method GET
    await fetch(`${webAppUrl}?${params.toString()}`, {
      method: 'GET'
    })
  } catch (err) {
    console.error("Gagal mengirim ke Google Sheets:", err)
  }

  revalidatePath('/dashboard/team')
}


export async function editTeamMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  const whatsapp = formData.get('whatsapp') as string
  const telegram = formData.get('telegram') as string

  if (!id || !name || !email) return

  const { error } = await supabase
    .from('team_members')
    .update({
      name,
      email,
      role: role || 'member',
      whatsapp: whatsapp || null,
      telegram: telegram || null
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) console.error('Error updating team member:', error)

  revalidatePath('/dashboard/team')
}

// Fungsi untuk menghapus anggota dari Supabase dan Google Sheets
export async function deleteTeamMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get('id') as string
  if (!id) return

  // 1. Ambil data email anggota berdasarkan ID sebelum dihapus (untuk referensi pencarian di Sheets)
  const { data: memberData } = await supabase
    .from('team_members')
    .select('email')
    .eq('id', id)
    .single()

  // 2. Hapus dari database Supabase
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting team member:', error)
    return
  }

  // 3. Kirim sinyal hapus ke Google Sheets menggunakan email
  if (memberData?.email) {
    try {
      const webAppUrl = 'https://script.google.com/macros/s/AKfycbxFAKpFGCElRdVIWdjFppiRLB0DhUvirNfFbgROGCn2xSojNOuknR8M3GRXZH8Xoa-czw/exec' 
      
      const params = new URLSearchParams({
        action: 'delete',
        email: memberData.email
      })
      
      await fetch(`${webAppUrl}?${params.toString()}`, {
        method: 'GET',
        redirect: 'follow'
      })
    } catch (err) {
      console.error("Gagal menghapus data di Google Sheets:", err)
    }
  }

  revalidatePath('/dashboard/team')
}

// Fungsi mengambil data kontak
export async function getContacts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching contacts:', error)
  return data || []
}

// Fungsi menambah kontak manual
export async function addContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const whatsapp = formData.get('whatsapp') as string
  const instagram = formData.get('instagram') as string

  if (!name || !email) return

  const { error } = await supabase
    .from('contacts')
    .insert([{
      user_id: user.id,
      name,
      email,
      whatsapp: whatsapp || null,
      instagram: instagram || null
    }])

  if (error) console.error('Error adding contact:', error)

  // path harus sesusai dengan fodler
  revalidatePath('/dashboard/contacts')
}

// Fungsi menghapus kontak
export async function deleteContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get('id') as string
  if (!id) return

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // RLS: Pastikan hanya kontak miliknya yang dihapus

  if (error) console.error('Error deleting contact:', error)

  // Sesuaikan path ini dengan folder kamu (/dashboard/contacts atau /dashboard/teman)
  revalidatePath('/dashboard/contacts')
}


// Ubah fungsi getFinanceData menjadi seperti ini:
export async function getFinanceData(param: { sheet?: string, gid?: string } = { sheet: 'Riwayat Transaksi' }) {
  // Pastikan URL di bawah ini adalah URL Web App Keuangan kamu yang aktif!
  const webAppUrl = 'https://script.google.com/macros/s/AKfycbxphwxa07qPBFqx2jLZlrVF7maP43Z3v-mg54qwA658gflbq3BwkboOZkvsYvTBHElO8A/exec'
  
  try {
    let query = ''
    if (param.gid) query = `?gid=${param.gid}`
    else if (param.sheet) query = `?sheet=${encodeURIComponent(param.sheet)}`

    const res = await fetch(`${webAppUrl}${query}`, {
      next: { tags: [`finance-${param.gid || param.sheet}`], revalidate: 3600 },
      redirect: 'follow'
    })
    
    const textData = await res.text() 
    try {
      return JSON.parse(textData)
    } catch (parseError) {
      console.error("Bukan JSON:", textData)
      return [] 
    }
  } catch (error) {
    console.error("Gagal menarik data keuangan:", error)
    return []
  }
}

// Fungsi untuk mengambil data Admin dari Spreadsheet
export async function getAdminData(sheetName: 'USER_REGISTRY' | 'PAYMENT_LOG' | 'ONBOARDING_LOG') {
  // TODO: GANTI URL DI BAWAH DENGAN URL WEB APP ADMIN YANG BARU KAMU COPY
  const adminWebAppUrl = 'https://script.google.com/macros/s/AKfycbzOBUPe4dPEpM8LcH3b1AC-bYwgXpMHmBuldR6pmgaanVfhnqlXZYoDdQBsDM1PbA9n/exec'
  
  try {
    // Kita sisipkan nama tab yang ingin ditarik ke dalam URL
    const targetUrl = `${adminWebAppUrl}?sheet=${sheetName}`
    
    const res = await fetch(targetUrl, {
      next: { tags: [`admin-${sheetName.toLowerCase()}`], revalidate: 60 }, // Cache direfresh tiap 60 detik
      redirect: 'follow'
    })
    
    const textData = await res.text() 
    const data = JSON.parse(textData)
    return data
    
  } catch (error) {
    console.error(`Gagal menarik data admin untuk tab ${sheetName}:`, error)
    return []
  }
}

// --- FUNGSI DETEKSI TIER USER ---
export async function getUserTier(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.email) return 1 // Default ke Tier 1 (19k)
  
  // Tarik data dari USER_REGISTRY
  const registryData = await getAdminData('USER_REGISTRY')
  if (!registryData || registryData.length < 2) return 1
  
  const headers = registryData[0].map((h: any) => String(h || '').trim().toLowerCase())
  let emailIdx = headers.findIndex((h: string) => h.includes('email'))
  let tierIdx = headers.findIndex((h: string) => h.includes('tier'))
  
  // Fallback indeks jika header tidak terdeteksi
  if (emailIdx === -1) emailIdx = 2 // Kolom C
  if (tierIdx === -1) tierIdx = 5   // Kolom F
  
  // Cari baris data milik user yang sedang login
  const userRow = registryData.find((row: any[]) => row[emailIdx] === user?.email)
  
  if (userRow) {
    const rawTier = String(userRow[tierIdx] || '1').toLowerCase()
    // Ekstrak angka dari string (Misal: "Tier 2" akan dibaca 2, "4" akan dibaca 4)
    const match = rawTier.match(/\d+/)
    if (match) return parseInt(match[0], 10)
  }
  
  return 1 // Jika data tidak ditemukan, kunci di Tier 1
}