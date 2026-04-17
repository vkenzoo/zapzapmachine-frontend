'use client'

import { Bot, Zap, MessageSquare, Database, ShieldCheck } from 'lucide-react'

/**
 * Demo 1: Lista de conversas com filtro por número
 */
const DemoConversas = () => (
  <div className="relative rounded-2xl bg-zinc-950 border border-white/10 p-4 shadow-2xl overflow-hidden">
    {/* Header fake */}
    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
      <span className="text-white text-[13px] font-semibold">Conversas</span>
      <span className="text-[10px] text-white/40">24 ativas</span>
    </div>

    {/* Dropdown de instância simulado */}
    <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 mb-2 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-400" />
      <span className="text-white text-[11px] font-medium">Principal</span>
      <span className="text-white/50 text-[10px]">+55 11 99...</span>
    </div>

    {/* Lista de conversas */}
    <div className="space-y-1">
      {[
        { nome: 'Ana Paula', msg: 'Oi, tem desconto?', hora: '14:52', cor: 'bg-pink-500', unread: 2 },
        { nome: 'Pedro H.', msg: 'Beleza, vou comprar', hora: '14:41', cor: 'bg-blue-500', unread: 0 },
        { nome: 'Marina', msg: 'Funciona pra iniciante?', hora: '14:23', cor: 'bg-orange-500', unread: 1 },
        { nome: 'Lucas', msg: 'Valeu, obrigado!', hora: '13:10', cor: 'bg-emerald-500', unread: 0 },
      ].map((c) => (
        <div key={c.nome} className="flex items-center gap-2.5 py-1.5 px-1.5 rounded-lg hover:bg-white/5">
          <div className={`h-8 w-8 rounded-full ${c.cor} flex items-center justify-center text-white text-[11px] font-semibold shrink-0`}>
            {c.nome.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-white text-[11px] font-medium truncate">{c.nome}</span>
              <span className="text-white/40 text-[9px] shrink-0 ml-2">{c.hora}</span>
            </div>
            <span className="text-white/50 text-[10px] truncate block">{c.msg}</span>
          </div>
          {c.unread > 0 && (
            <span className="shrink-0 h-4 min-w-4 px-1 rounded-full bg-blue-500 text-white text-[9px] font-medium flex items-center justify-center">
              {c.unread}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
)

/**
 * Demo 2: Agentes com config
 */
const DemoAgentes = () => (
  <div className="relative rounded-2xl bg-zinc-950 border border-white/10 p-4 shadow-2xl overflow-hidden">
    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
      <span className="text-white text-[13px] font-semibold">Agentes IA</span>
      <span className="rounded-full bg-blue-500/20 text-blue-300 text-[9px] px-2 py-0.5 font-medium">
        3 ativos
      </span>
    </div>

    <div className="space-y-2">
      {[
        { nome: 'Bia · Vendas', obj: 'Vender produto', cor: '#3b82f6', ativo: true },
        { nome: 'Carla · Suporte', obj: 'Resolver dúvidas', cor: '#10b981', ativo: true },
        { nome: 'Léo · Recuperação', obj: 'Reativar leads', cor: '#f59e0b', ativo: true },
      ].map((a) => (
        <div key={a.nome} className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: a.cor }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[11px] font-semibold">{a.nome}</p>
            <p className="text-white/50 text-[10px]">{a.obj}</p>
          </div>
          <div className="shrink-0">
            <div className="relative w-8 h-4 rounded-full bg-blue-500">
              <span className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Base de conhecimento indicador */}
    <div className="mt-4 rounded-xl bg-blue-500/10 border border-blue-500/20 p-2.5 flex items-center gap-2">
      <Database className="h-3.5 w-3.5 text-blue-400" />
      <span className="text-blue-300 text-[10px] font-medium">
        6 bases de conhecimento treinadas
      </span>
    </div>
  </div>
)

/**
 * Demo 3: Automações por evento
 */
const DemoAutomacoes = () => (
  <div className="relative rounded-2xl bg-zinc-950 border border-white/10 p-4 shadow-2xl overflow-hidden">
    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
      <span className="text-white text-[13px] font-semibold">Automações</span>
      <div className="flex items-center gap-1 rounded-full bg-orange-500/20 text-orange-300 text-[9px] px-2 py-0.5 font-medium">
        <Zap className="h-2.5 w-2.5" />
        5 ativas
      </div>
    </div>

    <div className="space-y-2">
      {[
        { nome: 'Boas-vindas pós compra', trigger: 'COMPRA_APROVADA', delay: 'Imediato', cor: 'bg-emerald-500/15 text-emerald-300' },
        { nome: 'Lembrete boleto', trigger: 'BOLETO_GERADO', delay: '2h depois', cor: 'bg-yellow-500/15 text-yellow-300' },
        { nome: 'Recuperar PIX expirado', trigger: 'PIX_EXPIRADO', delay: '10min depois', cor: 'bg-orange-500/15 text-orange-300' },
        { nome: 'Chargeback alert', trigger: 'CHARGEBACK', delay: 'Imediato', cor: 'bg-red-500/15 text-red-300' },
      ].map((a) => (
        <div key={a.nome} className="rounded-xl bg-white/5 border border-white/10 p-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-[11px] font-semibold">{a.nome}</span>
            <Zap className="h-3 w-3 text-orange-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`rounded-md text-[9px] px-1.5 py-0.5 ${a.cor}`}>
              {a.trigger}
            </span>
            <span className="text-white/40 text-[9px]">· {a.delay}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const DemosTelas = () => {
  const features = [
    {
      titulo: 'Todas as conversas num lugar',
      desc: 'Chat multi-número, filtro por instância, agente IA respondendo ou você assumindo quando quiser — tudo em tempo real.',
      icon: MessageSquare,
      demo: <DemoConversas />,
      cor: 'from-blue-500 to-cyan-500',
    },
    {
      titulo: 'Agentes IA treinados com seu produto',
      desc: 'Crie agentes por objetivo (vendas, suporte, recuperação). Cada um com sua base de conhecimento e personalidade.',
      icon: Bot,
      demo: <DemoAgentes />,
      cor: 'from-purple-500 to-pink-500',
    },
    {
      titulo: 'Automações acionadas por eventos',
      desc: '17 gatilhos: compra aprovada, boleto gerado, PIX expirado, chargeback, assinatura. Delay em minutos ou horas.',
      icon: Zap,
      demo: <DemoAutomacoes />,
      cor: 'from-orange-500 to-yellow-500',
    },
  ]

  return (
    <section className="relative bg-zinc-950 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block text-[12px] font-semibold text-blue-400 uppercase tracking-wider mb-3">
            Conheça o sistema
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] text-white leading-[1.1] mb-4">
            Tudo que você precisa pra vender<br className="hidden sm:block" />{' '}
            no automático
          </h2>
          <p className="text-[16px] text-white/60 max-w-2xl mx-auto">
            Conectado ao seu WhatsApp real. IA que não parece IA. E você no controle
            quando quiser.
          </p>
        </div>

        <div className="space-y-24 lg:space-y-32">
          {features.map((f, i) => {
            const Icon = f.icon
            const reverse = i % 2 === 1
            return (
              <div
                key={f.titulo}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center animate-fade-up ${
                  reverse ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Texto */}
                <div>
                  <div
                    className={`inline-flex h-10 w-10 rounded-xl bg-gradient-to-br ${f.cor} items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.02em] text-white leading-[1.15] mb-3">
                    {f.titulo}
                  </h3>
                  <p className="text-[15px] text-white/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                {/* Demo */}
                <div className="relative">
                  {/* Glow behind */}
                  <div className={`absolute -inset-4 bg-gradient-to-br ${f.cor} opacity-20 blur-3xl rounded-3xl`} />
                  <div className="relative">{f.demo}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-24 rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <ShieldCheck className="h-10 w-10 text-emerald-400 shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white text-[15px] font-semibold mb-0.5">
                Seus dados, seu WhatsApp, seu controle.
              </p>
              <p className="text-white/60 text-[13px]">
                Conexão via QR Code oficial. Você pode desconectar, assumir a conversa
                ou pausar a IA a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
