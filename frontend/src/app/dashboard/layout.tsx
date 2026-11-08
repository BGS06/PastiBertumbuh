import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getUserTier } from '@/app/dashboard/actions'

const ADMIN_EMAILS = ['nasg1868@gmail.com', 'bint4ng2403@gmail.com']

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isUserAdmin = ADMIN_EMAILS.includes(user.email || '')
  // Tarik tier user dari Google Sheets/Database (1, 2, atau 3)
  const currentTier = await getUserTier() 

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex">
      {/* Oper data ke Sidebar */}
      <Sidebar isAdmin={isUserAdmin} userTier={currentTier} userEmail={user.email || ''} />
      
      <main className="flex-1 w-full pt-16 md:pt-0 md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}