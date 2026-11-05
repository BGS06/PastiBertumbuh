'use client'

import { useState, useTransition } from 'react'
import { login } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-50/60 via-purple-50/20 to-slate-100/50 px-4 font-sans antialiased">
      <Card className="w-full max-w-md border-slate-200/60 shadow-xl shadow-purple-900/5 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl py-10 px-8 sm:px-12">
        <div className="text-center space-y-2 pb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Masuk ke PastiBertumbuh
          </h1>
          <p className="text-sm text-slate-500 font-normal">
            Silakan login ke akun kamu untuk melanjutkan.
          </p>
        </div>
        
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                Email
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail size={18} strokeWidth={1.8} />
                </span>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  className="pl-11 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 h-12 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock size={18} strokeWidth={1.8} />
                </span>
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  className="pl-11 pr-11 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 h-12 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm font-medium transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <Link href="#" className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  Lupa Password
                </Link>
              </div>
            </div>
            
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium h-12 rounded-full shadow-md shadow-purple-600/20 transition-all text-sm tracking-wide mt-2" 
              disabled={isPending}
            >
              {isPending ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 font-normal">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
              Daftar Sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}