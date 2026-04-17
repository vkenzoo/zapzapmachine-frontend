'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const CtaFinal = () => {
  return (
    <section className="relative bg-zinc-950 py-24 lg:py-32 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(59,130,246,0.25),transparent)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center animate-fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] text-white/80 font-medium">
            Conectando gente em venda agora mesmo
          </span>
        </div>

        <h2 className="text-[36px] sm:text-[54px] lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.02] text-white mb-5">
          Pare de perder venda{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            por demora
          </span>
        </h2>

        <p className="text-[16px] sm:text-[18px] text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
          Cada minuto que o cliente espera uma resposta é uma chance a menos.
          Conecte seu WhatsApp agora e deixe a IA responder em segundos — 24h por dia.
        </p>

        {/* CTA duplo */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-zinc-950 px-8 py-4 text-[16px] font-bold hover:bg-blue-50 transition-all shadow-2xl shadow-blue-500/30"
          >
            Criar minha conta agora
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 text-white px-8 py-4 text-[16px] font-medium hover:bg-white/10 transition-colors backdrop-blur"
          >
            Já tenho conta
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Sem cartão
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Conecta em 2 min
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Cancela quando quiser
          </span>
        </div>
      </div>
    </section>
  )
}

export const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[16px] font-bold tracking-[-0.03em] text-white">GA</span>
            <span className="text-[11px] font-medium text-white/50">Sales Machine</span>
          </div>
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} GA Sales Machine. Feito com ☕ no Brasil.
          </p>
        </div>
      </div>
    </footer>
  )
}
