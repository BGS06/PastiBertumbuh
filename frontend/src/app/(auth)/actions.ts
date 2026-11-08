'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Jika gagal login (password/email salah), sistem tidak akan redirect
  if (error) {
    console.error("Gagal Login:", error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const tier = formData.get('tier') as string || '1'

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error("Gagal Daftar:", error.message)
    return { error: error.message }
  }

  // Mendaftarkan user ke Google Sheets USER_REGISTRY
  try {
    const adminWebAppUrl = 'https://script.google.com/macros/s/AKfycbzOBUPe4dPEpM8LcH3b1AC-bYwgXpMHmBuldR6pmgaanVfhnqlXZYoDdQBsDM1PbA9n/exec' 
    const params = new URLSearchParams({
      action: 'register',
      email: email,
      tier: tier,
      status: tier === '1' ? 'Aktif' : 'Pending Payment' // Kunci akun premium hingga admin memvalidasi pembayaran
    })
    await fetch(`${adminWebAppUrl}?${params.toString()}`, { method: 'GET' })
  } catch (err) {
    console.error("Gagal sinkronisasi pendaftaran ke Sheets:", err)
  }

  // ALUR PEMBAYARAN
  // Jika memilih paket berbayar, arahkan ke halaman checkout
  if (tier === '2' || tier === '3') {
    redirect(`/payment?tier=${tier}&email=${email}`)
  } else {
    // Jika Tier 1 (Gratis), langsung masuk ke dashboard
    revalidatePath('/dashboard')
    redirect('/dashboard')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}