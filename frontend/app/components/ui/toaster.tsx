'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
}

let addToastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function toast(t: Omit<Toast, 'id'>) {
  addToastFn?.(t)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToastFn = (t) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { ...t, id }])
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000)
    }
    return () => { addToastFn = null }
  }, [])

  const colors = {
    success: 'border-l-green-500 bg-green-50',
    error: 'border-l-red-500 bg-red-50',
    warning: 'border-l-yellow-500 bg-yellow-50',
    info: 'border-l-blue-500 bg-blue-50',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div key={t.id} className={`card p-4 border-l-4 shadow-lg animate-slide-up ${colors[t.type]}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sm text-gray-900">{t.title}</p>
              {t.description && <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="text-gray-400 hover:text-gray-600 ml-4">
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
