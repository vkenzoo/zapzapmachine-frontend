'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAdmin, usuario } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!usuario) {
      router.replace('/login')
      return
    }
    if (!isAdmin) {
      router.replace('/dashboard')
    }
  }, [isLoading, usuario, isAdmin, router])

  if (isLoading || !usuario || !isAdmin) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
