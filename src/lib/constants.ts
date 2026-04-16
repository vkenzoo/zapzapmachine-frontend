import type { ProvedorCheckout, ProvedorInfo, TipoProduto, NivelConsciencia, TomVoz, IdiomaAgente, TipoEntrega, SecaoBaseConhecimento, ObjetivoAgente, SecaoAgente } from '@/types'
import {
  LayoutDashboard,
  Plug,
  MessageSquare,
  Database,
  Bot,
  HelpCircle,
  Settings,
  CreditCard,
  Package,
  UserCircle,
  MessageCircleQuestion,
  ShieldAlert,
  PackageCheck,
  TrendingUp,
  Headphones,
  RotateCcw,
  Sparkles,
  User,
  Settings2,
  Sliders,
  MessageCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export const APP_NAME = 'RoboVendas'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  children?: { label: string; href: string; icon: LucideIcon }[]
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Integrações',
    href: '/integracoes',
    icon: Plug,
    children: [
      { label: 'Checkout', href: '/integracoes/checkout', icon: CreditCard },
      { label: 'WhatsApp', href: '/integracoes/whatsapp', icon: MessageSquare },
    ],
  },
  {
    label: 'Conversas',
    href: '/conversas',
    icon: MessageSquare,
  },
  {
    label: 'Base de Conhecimento',
    href: '/base-conhecimento',
    icon: Database,
  },
  {
    label: 'Agentes',
    href: '/agentes',
    icon: Bot,
  },
  {
    label: 'Automações',
    href: '/automacoes',
    icon: Zap,
  },
]

export const SIDEBAR_FOOTER_ITEMS: NavItem[] = [
  { label: 'Ajuda', href: '#', icon: HelpCircle },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
]

export const PROVEDORES: Record<ProvedorCheckout, ProvedorInfo> = {
  HOTMART: {
    id: 'HOTMART',
    nome: 'Hotmart',
    descricao: 'Colete todas as transações integrando o checkout da Hotmart',
    corPrimaria: '#F04E23',
    inicial: 'H',
  },
  KIWIFY: {
    id: 'KIWIFY',
    nome: 'Kiwify',
    descricao: 'Colete todas as transações integrando o checkout da Kiwify',
    corPrimaria: '#00C853',
    inicial: 'K',
  },
  TICTO: {
    id: 'TICTO',
    nome: 'Ticto',
    descricao: 'Colete todas as transações integrando o checkout da Ticto',
    corPrimaria: '#00B4D8',
    inicial: 'T',
  },
}

export const PROVEDORES_LISTA = Object.values(PROVEDORES)

// === Base de Conhecimento ===

export const TIPOS_PRODUTO: { value: TipoProduto; label: string }[] = [
  { value: 'curso', label: 'Curso' },
  { value: 'mentoria', label: 'Mentoria' },
  { value: 'ebook', label: 'E-book' },
  { value: 'software', label: 'Software' },
  { value: 'servico', label: 'Serviço' },
  { value: 'outro', label: 'Outro' },
]

export const NIVEIS_CONSCIENCIA: { value: NivelConsciencia; label: string }[] = [
  { value: 'inconsciente', label: 'Inconsciente' },
  { value: 'consciente_problema', label: 'Consciente do problema' },
  { value: 'consciente_solucao', label: 'Consciente da solução' },
  { value: 'consciente_produto', label: 'Consciente do produto' },
  { value: 'mais_consciente', label: 'Mais consciente' },
]

export const TONS_VOZ: { value: TomVoz; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'informal', label: 'Informal' },
  { value: 'amigavel', label: 'Amigável' },
  { value: 'profissional', label: 'Profissional' },
  { value: 'descontraido', label: 'Descontraído' },
]

export const IDIOMAS_AGENTE: { value: IdiomaAgente; label: string }[] = [
  { value: 'portugues', label: 'Português' },
  { value: 'ingles', label: 'Inglês' },
  { value: 'espanhol', label: 'Espanhol' },
]

export const TIPOS_ENTREGA: { value: TipoEntrega; label: string }[] = [
  { value: 'acesso_imediato', label: 'Acesso imediato' },
  { value: 'envio_email', label: 'Envio por email' },
  { value: 'link_download', label: 'Link de download' },
  { value: 'area_membros', label: 'Acesso à área de membros' },
]

export const TABS_BASE_CONHECIMENTO: { value: SecaoBaseConhecimento; label: string; icon: LucideIcon }[] = [
  { value: 'informacoes', label: 'Produto', icon: Package },
  { value: 'persona', label: 'Persona', icon: UserCircle },
  { value: 'faq', label: 'FAQ', icon: MessageCircleQuestion },
  { value: 'personalidade', label: 'Agente', icon: Bot },
  { value: 'limitacoes', label: 'Limites', icon: ShieldAlert },
  { value: 'entregaveis', label: 'Entrega', icon: PackageCheck },
]

// === Agentes ===

export const OBJETIVOS_AGENTE: { value: ObjetivoAgente; label: string; descricao: string; icon: LucideIcon; cor: string }[] = [
  { value: 'VENDAS', label: 'Vendas', descricao: 'Qualifica leads e fecha vendas', icon: TrendingUp, cor: '#10b981' },
  { value: 'SUPORTE', label: 'Suporte', descricao: 'Atende dúvidas e resolve problemas', icon: Headphones, cor: '#3b82f6' },
  { value: 'RECUPERACAO', label: 'Recuperação', descricao: 'Recupera carrinho abandonado e PIX', icon: RotateCcw, cor: '#f59e0b' },
  { value: 'ONBOARDING', label: 'Onboarding', descricao: 'Boas-vindas e ativação pós-compra', icon: Sparkles, cor: '#8b5cf6' },
  { value: 'USO_PESSOAL', label: 'Uso pessoal', descricao: 'Assistente personalizado', icon: User, cor: '#6b7280' },
]

export const TABS_AGENTE: { value: SecaoAgente; label: string; icon: LucideIcon }[] = [
  { value: 'geral', label: 'Geral', icon: Settings2 },
  { value: 'configuracoes', label: 'Configurações', icon: Sliders },
  { value: 'bases', label: 'Bases', icon: Database },
  { value: 'teste', label: 'Testar', icon: MessageCircle },
]

export const CORES_AVATAR_AGENTE = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
  '#ec4899', '#14b8a6', '#ef4444', '#6366f1',
]
