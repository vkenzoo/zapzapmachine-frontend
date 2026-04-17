'use client'

import { ProvedorLogo } from '@/components/integracoes/provedor-logo'
import type { ProvedorCheckout } from '@/types'

export const Integracoes = () => {
  const logos: { id: ProvedorCheckout; nome: string }[] = [
    { id: 'HOTMART', nome: 'Hotmart' },
    { id: 'KIWIFY', nome: 'Kiwify' },
    { id: 'TICTO', nome: 'Ticto' },
  ]

  return (
    <section className="relative bg-zinc-50 py-16 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-4">
            Integrado com os checkouts que você já usa
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 animate-fade-up">
          {logos.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 hover:scale-105 transition-transform"
            >
              <ProvedorLogo provedor={l.id} size={48} />
              <span className="text-zinc-900 font-semibold text-[17px] tracking-[-0.01em]">
                {l.nome}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] text-zinc-500 mt-8">
          17 eventos suportados — de compra aprovada a chargeback, boleto gerado a PIX expirado
        </p>
      </div>
    </section>
  )
}
