'use client'

import { useTransition, useState } from 'react'
import { toggleTask } from '@/app/dashboard/actions'

export default function TaskCheckbox({ 
  taskId, 
  initialCompleted 
}: { 
  taskId: string, 
  initialCompleted: boolean 
}) {
  const [isPending, startTransition] = useTransition()
  const [checked, setChecked] = useState(initialCompleted)

  const handleToggle = () => {
    const newStatus = !checked
    setChecked(newStatus)
    startTransition(() => {
      toggleTask(taskId, newStatus)
    })
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleToggle}
      disabled={isPending}
      className="w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500 disabled:opacity-50 cursor-pointer"
    />
  )
}