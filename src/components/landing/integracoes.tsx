'use client'

export const Integracoes = () => {
  const logos = [
    { nome: 'Hotmart', cor: '#F04E23', inicial: 'H' },
    { nome: 'Kiwify', cor: '#00C853', inicial: 'K' },
    { nome: 'Ticto', cor: '#00B4D8', inicial: 'T' },
  ]

  return (
    <section className="relative bg-zinc-50 py-16 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-4">
            Integrado com os checkouts que você já usa
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 animate-fade-up">
          {logos.map((l) => (
            <div
              key={l.nome}
              className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shadow-md"
                style={{ backgroundColor: l.cor }}
              >
                {l.inicial}
              </div>
              <span className="text-zinc-900 font-semibold text-[16px] tracking-[-0.01em]">
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
