'use client'

import { useAuth } from '@/hooks/use-auth'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
