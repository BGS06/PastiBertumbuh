import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'PastiBertumbuh - Platform Manajemen Acara & Produktivitas',
  description: 'Kelola acara, undangan digital, dan tugas dalam satu platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} antialiased bg-slate-50 text-slate-800`}>
        {children}
      </body>
    </html>
  )
}