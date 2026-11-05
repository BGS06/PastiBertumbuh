import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getAdminData } from '@/app/dashboard/actions'
import { Users, CreditCard, Activity } from 'lucide-react'
import { Suspense } from 'react' // Import Suspense dari React

const ADMIN_EMAILS = ['nasg1868@gmail.com', 'bint4ng2403@gmail.com']

// --- KOMPONEN BANTUAN TABEL ---
const AdminTable = ({ title, data, icon: Icon }: { title: string, data: any[], icon: any }) => {
  if (!data || data.length === 0) return null
  const headers = data[0]
  const rows = data.slice(1)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-700">
          <Icon size={18} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <span className="ml-auto bg-slate-200 text-slate-600 py-1 px-3 rounded-full text-xs font-bold">
          {rows.length} Data
        </span>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              {headers.map((head: string, idx: number) => (
                <th key={idx} className="px-6 py-4 font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any[], rowIdx: number) => (
              <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                {row.map((cell: any, cellIdx: number) => (
                  <td key={cellIdx} className="px-6 py-4 max-w-[200px] lg:max-w-[250px] truncate" title={String(cell || '-')}>
                    {String(cell || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- KOMPONEN ASYNC YANG BERAT (DISEMBUNYIKAN DI BELAKANG SUSPENSE) ---
async function DataTablesWrapper() {
  const [userRegistry, paymentLog, onboardingLog] = await Promise.all([
    getAdminData('USER_REGISTRY'),
    getAdminData('PAYMENT_LOG'),
    getAdminData('ONBOARDING_LOG')
  ])

  return (
    <>
      <AdminTable title="User Registry" data={userRegistry} icon={Users} />
      <AdminTable title="Payment & Subscription Log" data={paymentLog} icon={CreditCard} />
      <AdminTable title="Onboarding Activity" data={onboardingLog} icon={Activity} />
    </>
  )
}

// --- KOMPONEN LOADING SKELETON ---
function TableSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-slate-200/50 rounded-2xl border border-slate-200 w-full"></div>
      ))}
    </div>
  )
}

// --- HALAMAN UTAMA (RENDERING INSTAN) ---
export default async function AdminPanelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/dashboard')
  }

  return (
    <div className="grid grid-cols-1 w-full gap-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">System Admin Panel</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitoring sentral SaaS PastiBertumbuh (Live Sync with Spreadsheet).
          </p>
        </div>
      </div>

      {/* RAHASIANYA ADA DI SINI: */}
      {/* Suspense akan merender kerangka halaman secara instan, lalu menunggu DataTablesWrapper selesai mengambil data */}
      <Suspense fallback={<TableSkeleton />}>
        <DataTablesWrapper />
      </Suspense>
      
    </div>
  )
}