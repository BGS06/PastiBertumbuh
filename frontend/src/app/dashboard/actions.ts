'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// ==========================================
// TASKS & EVENTS (SUPABASE)
// ==========================================
export async function getTasks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  if (error) console.error('Error fetching tasks:', error)
  return data || []
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title = formData.get('title') as string
  if (!title) return

  const { error } = await supabase.from('tasks').insert([{ title, user_id: user.id }])
  if (error) return { error: error.message }
  revalidatePath('/dashboard/tasks')
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({ is_completed: isCompleted }).eq('id', taskId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/tasks')
}

export async function getEvents() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase.from('events').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
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

  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

  const { error } = await supabase.from('events').insert([{ title, event_date, location, slug, user_id: user.id }])
  if (error) return { error: error.message }
  revalidatePath('/dashboard/events')
}

export async function getEventById(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from('events').select('*').eq('id', eventId).eq('user_id', user.id).single()
  if (error) return null
  return data
}

export async function getGuests(eventId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('guests').select('*').eq('event_id', eventId).order('created_at', { ascending: false })
  if (error) console.error('Error fetching guests:', error)
  return data || []
}

export async function addGuest(eventId: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const phone_number = formData.get('phone_number') as string
  if (!name) return

  const { error } = await supabase.from('guests').insert([{ event_id: eventId, name, phone_number, status: 'pending' }])
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/events/${eventId}`)
}

// ==========================================
// TIM & KONTAK
// ==========================================
export async function syncTeamMembersFromSheet(csvUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  try {
    const res = await fetch(csvUrl, { cache: 'no-store' })
    const csvText = await res.text()
    const rows = csvText.split('\n').map(row => row.split(','))

    const { data: existingMembers } = await supabase.from('team_members').select('email').eq('user_id', user.id)
    const existingEmails = new Set(existingMembers?.map(m => m.email) || [])

    const membersToInsert = rows.slice(1)
      .filter(col => col[0] && col[0].trim() !== '')
      .map(col => ({
        user_id: user.id,
        name: col[0]?.replace(/^"|"$/g, '').trim(),
        email: col[1]?.replace(/^"|"$/g, '').trim(),
        role: col[2]?.replace(/^"|"$/g, '').trim() || 'member',
        whatsapp: col[3]?.replace(/^"|"$/g, '').trim() || null,
        telegram: col[4]?.replace(/^"|"$/g, '').trim() || null,
      }))
      .filter(member => member.email && !existingEmails.has(member.email))

    if (membersToInsert.length === 0) return { success: true, count: 0 }

    const { error } = await supabase.from('team_members').insert(membersToInsert)
    if (error) throw error
    revalidatePath('/dashboard/team')
    return { success: true, count: membersToInsert.length }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function getTeamMembers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase.from('team_members').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return data || []
}

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

  await supabase.from('team_members').insert([{ user_id: user.id, name, email, role: role || 'member', whatsapp: whatsapp || null, telegram: telegram || null }])

  try {
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbxFAKpFGCElRdVIWdjFppiRLB0DhUvirNfFbgROGCn2xSojNOuknR8M3GRXZH8Xoa-czw/exec'
    const params = new URLSearchParams({ name, email, role: role || 'member', whatsapp: whatsapp || '', telegram: telegram || '' })
    await fetch(`${webAppUrl}?${params.toString()}`, { method: 'GET' })
  } catch (err) {}
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
  await supabase.from('team_members').update({ name, email, role: role || 'member', whatsapp: whatsapp || null, telegram: telegram || null }).eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/team')
}

export async function deleteTeamMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get('id') as string
  if (!id) return

  const { data: memberData } = await supabase.from('team_members').select('email').eq('id', id).single()
  await supabase.from('team_members').delete().eq('id', id).eq('user_id', user.id)

  if (memberData?.email) {
    try {
      const webAppUrl = 'https://script.google.com/macros/s/AKfycbxFAKpFGCElRdVIWdjFppiRLB0DhUvirNfFbgROGCn2xSojNOuknR8M3GRXZH8Xoa-czw/exec'
      const params = new URLSearchParams({ action: 'delete', email: memberData.email })
      await fetch(`${webAppUrl}?${params.toString()}`, { method: 'GET', redirect: 'follow' })
    } catch (err) {}
  }
  revalidatePath('/dashboard/team')
}

export async function getContacts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase.from('contacts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return data || []
}

export async function addContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const whatsapp = formData.get('whatsapp') as string
  const instagram = formData.get('instagram') as string

  if (!name || !email) return
  await supabase.from('contacts').insert([{ user_id: user.id, name, email, whatsapp: whatsapp || null, instagram: instagram || null }])
  revalidatePath('/dashboard/contacts')
}

export async function deleteContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get('id') as string
  if (!id) return
  await supabase.from('contacts').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/contacts')
}

export async function getFinanceData(param: { sheet?: string, gid?: string } = { sheet: 'Riwayat Transaksi' }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.email) return []

  const webAppUrl = 'https://script.google.com/macros/s/AKfycbwwd7-Kkvl3vXEvlu3FdDzs2Pkh2M6eD0GNCprdAh93HK4PZFx661UFyiK-XgTIdkE3/exec'
  
  try {
    let query = ''
    if (param.gid) query = `?gid=${param.gid}`
    else if (param.sheet) query = `?sheet=${encodeURIComponent(param.sheet)}`

    // PERBAIKAN: Gunakan cache: 'no-store' agar selalu menarik data terbaru tanpa delay 1 jam
    const res = await fetch(`${webAppUrl}${query}`, { 
      cache: 'no-store',
      redirect: 'follow' 
    })
    
    const textData = await res.text()
    
    try {
      const allData = JSON.parse(textData)
      
      // Filter Data Berdasarkan Kolom Email (Smart Mode)
      if (Array.isArray(allData) && allData.length > 1) {
        // Cari baris header yang sebenarnya
        const headerIdx = allData.findIndex(row => {
          return row.filter((cell: any) => cell !== null && cell !== '').length >= 3
        })
        
        const actualHeaderIdx = headerIdx !== -1 ? headerIdx : 0
        const headers = allData[actualHeaderIdx]
        
        // Cari index kolom Email secara fleksibel
        let emailColIdx = headers.findIndex((h: string) => String(h || '').toLowerCase().replace(/\s/g, '') === 'email')
        
        if (emailColIdx !== -1) {
          const userRows = allData.slice(actualHeaderIdx + 1).filter((row: any[]) => {
            const cellEmail = String(row[emailColIdx] || '').trim().toLowerCase()
            return cellEmail === user.email?.toLowerCase()
          })
          return [headers, ...userRows]
        } else {
           console.error(`Kolom Email tidak ditemukan di tab ${param.sheet}! Header terdeteksi:`, headers)
           return []
        }
      }
      return []
    } catch (parseError) {
      return []
    }
  } catch (error) {
    return []
  }
}

export async function getAdminData(sheetName: 'USER_REGISTRY' | 'PAYMENT_LOG' | 'ONBOARDING_LOG') {
  const adminWebAppUrl = 'https://script.google.com/macros/s/AKfycbzOBUPe4dPEpM8LcH3b1AC-bYwgXpMHmBuldR6pmgaanVfhnqlXZYoDdQBsDM1PbA9n/exec'
  try {
    const res = await fetch(`${adminWebAppUrl}?sheet=${sheetName}`, {
      next: { tags: [`admin-${sheetName.toLowerCase()}`], revalidate: 60 },
      redirect: 'follow'
    })
    return JSON.parse(await res.text())
  } catch (error) {
    return []
  }
}

export async function getUserTier(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.email) return 1 

  const registryData = await getAdminData('USER_REGISTRY')
  if (!registryData || registryData.length < 2) return 1

  const headers = registryData[0].map((h: string) => String(h || '').trim().toLowerCase())
  let emailIdx = headers.findIndex((h: string) => h.includes('email'))
  let tierIdx = headers.findIndex((h: string) => h.includes('tier'))

  if (emailIdx === -1) emailIdx = 2 
  if (tierIdx === -1) tierIdx = 5 

  const userRow = registryData.find((row: any[]) => row[emailIdx] === user?.email)
  if (userRow) {
    const rawTier = String(userRow[tierIdx] || '1').toLowerCase()
    const match = rawTier.match(/\d+/)
    if (match) return parseInt(match[0], 10)
  }
  return 1 
}