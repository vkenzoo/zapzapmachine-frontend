'use client'

import type { LucideIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ConfigToggleProps {
  id: string
  icone: LucideIcon
  label: string
  descricao: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const ConfigToggle = ({
  id,
  icone: Icon,
  label,
  descricao,
  checked,
  onChange,
}: ConfigToggleProps) => {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-4">
      <div className="h-9 w-9 rounded-lg bg-card border border-border/50 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <Label htmlFor={id} className="text-[13px] font-semibold cursor-pointer block">
          {label}
        </Label>
        <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
          {descricao}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-1" />
    </div>
  )
}
