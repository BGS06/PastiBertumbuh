'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

export default function CopyLinkButton({ slug, guestId }: { slug: string, guestId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    // Generate URL (Gunakan window.location.origin agar dinamis sesuai domain saat ini)
    const url = `${window.location.origin}/invitation/${slug}?guest=${guestId}`
    
    await navigator.clipboard.writeText(url)
    setCopied(true)
    
    setTimeout(() => setCopied(false), 2000) // Reset icon setelah 2 detik
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleCopy}
      className="text-slate-600 hover:text-purple-600"
    >
      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
      <span className="ml-2">{copied ? 'Tersalin' : 'Salin Link'}</span>
    </Button>
  )
}