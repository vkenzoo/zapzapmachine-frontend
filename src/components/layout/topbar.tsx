'use client'

import { useAuth } from '@/hooks/use-auth'
import { MobileSidebar } from './sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'

export const Topbar = () => {
  const { usuario, logout } = useAuth()

  return (
    <header className="h-12 border-b border-border/50 bg-card/60 frosted-glass flex items-center justify-between px-4 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <MobileSidebar />
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-200"
                aria-label="Menu do usuário"
              />
            }
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-to-b from-blue-500 to-blue-600 text-white text-[10px] font-semibold">
                {usuario?.nome?.charAt(0) ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-[13px] font-medium hidden sm:inline">
              {usuario?.nome ?? 'Usuário'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem disabled className="text-[13px] rounded-lg">
              <User className="mr-2 h-4 w-4 opacity-60" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive text-[13px] rounded-lg"
            >
              <LogOut className="mr-2 h-4 w-4 opacity-60" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
