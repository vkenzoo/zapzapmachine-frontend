'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Shield,
  Users,
  Sparkles,
  DollarSign,
  FileText,
  CreditCard,
  LogOut,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
}

const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: Shield },
  { label: 'Usuários', href: '/admin/usuarios', icon: Users },
  { label: 'Controle IA', href: '/admin/ia/controle', icon: Sparkles },
  { label: 'Gastos IA', href: '/admin/ia/gastos', icon: DollarSign },
  { label: 'Auditoria IA', href: '/admin/ia/logs', icon: FileText },
  { label: 'Auditoria Checkout', href: '/admin/checkout/logs', icon: CreditCard },
]

export const AdminSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, usuario } = useAuth()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href) ?? false
  }

  return (
    <div className="flex flex-col h-full w-[240px] shrink-0 border-r border-border/50 bg-card/60">
      <div className="px-5 pt-6 pb-5">
        <Link href="/admin" className="flex items-baseline gap-1.5" onClick={onNavigate}>
          <span className="font-bold text-[16px] tracking-[-0.03em] text-foreground">GA</span>
          <span className="font-medium text-[12px] tracking-[-0.01em] text-orange-600">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] transition-all duration-200',
                active
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-[16px] w-[16px] shrink-0 opacity-70" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t border-border/40 pt-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full transition-all"
        >
          <ArrowLeft className="h-[16px] w-[16px] shrink-0 opacity-60" />
          <span>Voltar ao app</span>
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] text-muted-foreground hover:text-destructive w-full transition-all"
        >
          <LogOut className="h-[16px] w-[16px] shrink-0 opacity-60" />
          <span>Sair</span>
        </button>
        {usuario && (
          <div className="px-3 pt-2 text-[11px] text-muted-foreground truncate">
            {usuario.email}
          </div>
        )}
      </div>
    </div>
  )
}
