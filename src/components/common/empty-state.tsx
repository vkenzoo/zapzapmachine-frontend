import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icone: LucideIcon
  titulo: string
  descricao: string
}

export const EmptyState = ({ icone: Icone, titulo, descricao }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="rounded-2xl bg-muted/60 p-5 mb-5">
        <Icone className="h-7 w-7 text-muted-foreground/60" strokeWidth={1.5} />
      </div>
      <h2 className="text-[17px] font-semibold tracking-[-0.01em] mb-1">{titulo}</h2>
      <p className="text-[14px] text-muted-foreground max-w-xs leading-relaxed">{descricao}</p>
    </div>
  )
}
