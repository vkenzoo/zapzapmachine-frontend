import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface PageHeaderProps {
  titulo: string
  descricao?: string
  breadcrumb?: { label: string; href?: string }[]
  acao?: ReactNode
}

export const PageHeader = ({
  titulo,
  descricao,
  breadcrumb,
  acao,
}: PageHeaderProps) => {
  return (
    <div className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-1 text-[13px] text-muted-foreground mb-3">
          {breadcrumb.map((item, index) => (
            <span key={item.label} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3 opacity-40" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.025em] text-foreground">
            {titulo}
          </h1>
          {descricao && (
            <p className="text-[14px] text-muted-foreground mt-1 leading-relaxed">
              {descricao}
            </p>
          )}
        </div>
        {acao && <div className="shrink-0">{acao}</div>}
      </div>
    </div>
  )
}
