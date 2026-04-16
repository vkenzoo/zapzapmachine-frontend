'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { APP_NAME, SIDEBAR_NAV_ITEMS, SIDEBAR_FOOTER_ITEMS } from '@/lib/constants'
import { LogOut, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname()
  const { usuario, logout } = useAuth()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Integrações': true,
  })

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const handleToggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5">
        <Link
          href="/dashboard"
          className="flex items-baseline gap-1.5 group"
          onClick={onNavigate}
        >
          <span className="font-bold text-[16px] tracking-[-0.03em] text-foreground">GA</span>
          <span className="font-medium text-[13px] tracking-[-0.01em] text-muted-foreground">Sales Machine</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          if (item.children) {
            const isGroupActive = item.children.some((child) =>
              isActive(child.href)
            )
            return (
              <Collapsible
                key={item.label}
                open={openGroups[item.label] ?? false}
                onOpenChange={() => handleToggleGroup(item.label)}
              >
                <CollapsibleTrigger
                  render={
                    <button
                      className={cn(
                        'flex items-center w-full gap-2.5 rounded-xl px-3 py-[7px] text-[13px] font-medium transition-all duration-200',
                        'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
                        isGroupActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    />
                  }
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0 opacity-70" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 transition-transform duration-200 opacity-40',
                      openGroups[item.label] && 'rotate-180'
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-[18px] mt-0.5 space-y-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] transition-all duration-200',
                        isActive(child.href)
                          ? 'bg-primary/[0.08] text-primary font-medium'
                          : 'text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                      )}
                    >
                      <child.icon className="h-[16px] w-[16px] shrink-0" />
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-primary/[0.08] text-primary'
                  : 'text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0 opacity-70" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-3 space-y-0.5">
        <div className="h-px bg-border/50 mx-2 mb-2" />
        {SIDEBAR_FOOTER_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            <item.icon className="h-[16px] w-[16px] shrink-0 opacity-60" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => {
            onNavigate?.()
            logout()
          }}
          className="flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] text-muted-foreground hover:text-destructive transition-all duration-200 w-full"
        >
          <LogOut className="h-[16px] w-[16px] shrink-0 opacity-60" />
          <span>Sair</span>
        </button>

        <div className="flex items-center gap-2.5 px-3 pt-3 pb-1">
          <Avatar className="h-7 w-7">
            {usuario?.fotoUrl && <AvatarImage src={usuario.fotoUrl} alt={usuario.nome} />}
            <AvatarFallback className="bg-gradient-to-b from-blue-500 to-blue-600 text-white text-[10px] font-semibold">
              {usuario?.nome?.charAt(0) ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-medium truncate leading-tight">
              {usuario?.nome ?? 'Usuário'}
            </span>
            <span className="text-[11px] text-muted-foreground truncate leading-tight">
              {usuario?.email ?? ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex w-[252px] border-r border-border/50 bg-sidebar frosted-glass flex-col shrink-0 h-screen sticky top-0">
      <SidebarContent />
    </aside>
  )
}

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 rounded-lg"
            aria-label="Abrir menu"
          />
        }
      >
        <Menu className="h-[18px] w-[18px]" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[252px] p-0 frosted-glass">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
