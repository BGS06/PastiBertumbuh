import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

// Daftar email yang memiliki akses Admin Panel
const ADMIN_EMAILS = ['nasg1868@gmail.com', 'bint4ng2403@gmail.com']

async function handleLogout() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // 1. CEK EMAIL USER
  const isUserAdmin = ADMIN_EMAILS.includes(user.email || '')

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 2. KIRIM STATUS KE SIDEBAR */}
      <Sidebar isAdmin={isUserAdmin} />

      <div className="flex-1 ml-64 flex flex-col">
        {/* Header Dashboard */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="text-sm font-semibold text-slate-700">
            {user.email ? `Halo, ${user.email}` : 'Dashboard'}
          </div>

          <form action={handleLogout}>
            <button 
              type="submit"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
              title="Keluar"
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </form>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}