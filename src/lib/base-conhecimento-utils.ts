import type { BaseConhecimento, SecaoBaseConhecimento } from '@/types'

export const isSecaoCompleta = (base: BaseConhecimento, secao: SecaoBaseConhecimento): boolean => {
  switch (secao) {
    case 'informacoes': {
      const s = base.informacoesProduto
      return !!(s.nomeProduto && s.descricaoCurta && s.preco && s.tipo)
    }
    case 'persona': {
      const s = base.persona
      return !!(s.nomePersona && s.principaisDores && s.nivelConsciencia)
    }
    case 'faq': {
      const filled = base.faqObjecoes.filter((f) => f.pergunta && f.resposta)
      return filled.length >= 3
    }
    case 'personalidade': {
      const s = base.personalidadeAgente
      return !!(s.tomVoz && s.nomeAgente && s.idiomaPrincipal)
    }
    case 'limitacoes': {
      const s = base.limitacoes
      return !!(s.topicosProibidos || s.instrucoesTransferirHumano)
    }
    case 'entregaveis': {
      const s = base.entregaveis
      return !!(s.tipoEntrega && s.instrucoesAcesso)
    }
    default:
      return false
  }
}

const SECOES: SecaoBaseConhecimento[] = [
  'informacoes', 'persona', 'faq', 'personalidade', 'limitacoes', 'entregaveis',
]

export const calcularCompletudeBase = (base: BaseConhecimento): number => {
  const completadas = SECOES.filter((s) => isSecaoCompleta(base, s)).length
  return Math.round((completadas / SECOES.length) * 100)
}

export const criarBaseConhecimentoVazia = (nome: string): BaseConhecimento => ({
  id: `base_${crypto.randomUUID().slice(0, 8)}`,
  nome,
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString(),
  informacoesProduto: {
    nomeProduto: '',
    descricaoCurta: '',
    preco: null,
    urlVenda: '',
    tipo: '',
    garantia: '',
  },
  persona: {
    nomePersona: '',
    idadeFaixa: '',
    profissao: '',
    principaisDores: '',
    desejosObjetivos: '',
    nivelConsciencia: '',
  },
  faqObjecoes: [
    { id: crypto.randomUUID(), pergunta: '', resposta: '' },
    { id: crypto.randomUUID(), pergunta: '', resposta: '' },
    { id: crypto.randomUUID(), pergunta: '', resposta: '' },
  ],
  personalidadeAgente: {
    tomVoz: '',
    nomeAgente: '',
    instrucoesEspeciais: '',
    usarEmojis: false,
    usarAudios: false,
    idiomaPrincipal: '',
  },
  limitacoes: {
    topicosProibidos: '',
    nuncaMencionarConcorrentes: false,
    naoPrometerResultados: false,
    limiteDescontoMaximo: null,
    instrucoesTransferirHumano: '',
  },
  entregaveis: {
    tipoEntrega: '',
    instrucoesAcesso: '',
    linkAcesso: '',
    suportePosVenda: '',
  },
})
