'use client'

import { GraduationCap, Users, Briefcase, ShoppingBag } from 'lucide-react'

const PERSONAS = [
  {
    icon: GraduationCap,
    titulo: 'Infoprodutores',
    desc: 'Automatiza boas-vindas pós-compra, recupera carrinho abandonado e atende dúvidas dos alunos em segundos.',
  },
  {
    icon: Users,
    titulo: 'Afiliados',
    desc: 'Escala atendimento sem contratar equipe. A IA qualifica o lead e fecha a venda antes do cliente esfriar.',
  },
  {
    icon: Briefcase,
    titulo: 'Serviços & Agências',
    desc: 'Qualifica o lead, agenda chamada e só passa pra você quando o cliente está pronto pra fechar.',
  },
  {
    icon: ShoppingBag,
    titulo: 'E-commerce',
    desc: 'Responde sobre produto, rastreamento e troca 24/7. Reduz tickets em até 70% e aumenta satisfação.',
  },
]

export const ParaQuem = () => {
  return (
    <section className="relative bg-zinc-50 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-fade-up">
          <span className="inline-block text-[12px] font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Para quem é
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] text-zinc-900 leading-[1.1]">
            Feito pra quem vende pelo WhatsApp<br className="hidden sm:block" />{' '}
            e não tem tempo a perder
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERSONAS.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={p.titulo}
                className="group rounded-2xl bg-white border border-zinc-200 p-6 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <div className="inline-flex h-11 w-11 rounded-xl bg-blue-50 items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                  <Icon
                    className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-[16px] font-bold tracking-[-0.01em] text-zinc-900 mb-2">
                  {p.titulo}
                </h3>
                <p className="text-[13px] text-zinc-600 leading-relaxed">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
