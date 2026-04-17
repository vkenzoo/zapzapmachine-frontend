'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Renderiza layout imediatamente (sem esperar auth).
  // Middleware ja protege rotas nao-autenticadas redirecionando pra /login.
  // Paginas individuais mostram skeleton proprio enquanto dados carregam.
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
