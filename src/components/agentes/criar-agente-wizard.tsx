'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { ObjetivoAgente, ConfigAgente, BaseConhecimento } from '@/types'
import { OBJETIVOS_AGENTE } from '@/lib/constants'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ObjetivoCard } from './objetivo-card'
import { ConfigToggle } from './config-toggle'
import { BasesMultiSelect } from './bases-multi-select'
import {
  ArrowLeft,
  X,
  Loader2,
  Sparkles,
  UserPlus,
  ShieldCheck,
  Split,
  Bot,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CriarAgenteWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCriado: () => void
}

type Step = 1 | 2 | 3 | 4 | 5

const TOTAL_STEPS = 5

export const CriarAgenteWizard = ({ open, onOpenChange, onCriado }: CriarAgenteWizardProps) => {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [criando, setCriando] = useState(false)

  // Dados do formulario
  const [nome, setNome] = useState('')
  const [objetivo, setObjetivo] = useState<ObjetivoAgente | null>(null)
  const [descricao, setDescricao] = useState('')
  const [config, setConfig] = useState<ConfigAgente>({
    solicitarAjudaHumana: true,
    usarEmojis: true,
    restringirTemas: false,
    dividirRespostaEmPartes: false,
  })
  const [basesIds, setBasesIds] = useState<string[]>([])
  const [bases, setBases] = useState<BaseConhecimento[]>([])

  useEffect(() => {
    if (open) {
      // Reset ao abrir
      setStep(1)
      setNome('')
      setObjetivo(null)
      setDescricao('')
      setConfig({
        solicitarAjudaHumana: true,
        usarEmojis: true,
        restringirTemas: false,
        dividirRespostaEmPartes: false,
      })
      setBasesIds([])
      // Carregar bases
      api.baseConhecimento.listar().then(setBases)
    }
  }, [open])

  const podeAvancar = () => {
    switch (step) {
      case 1:
        return nome.trim().length >= 2
      case 2:
        return !!objetivo
      case 3:
        return true // descricao opcional
      case 4:
        return true
      case 5:
        return true
      default:
        return false
    }
  }

  const handleContinuar = () => {
    if (step < TOTAL_STEPS) {
      setStep((step + 1) as Step)
    }
  }

  const handleVoltar = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
    }
  }

  const handleCriar = async () => {
    if (!objetivo) return
    setCriando(true)
    try {
      const novo = await api.agentes.criar({
        nome: nome.trim(),
        objetivo,
        descricao: descricao.trim(),
        config,
        basesConhecimentoIds: basesIds,
      })
      toast.success('Agente criado com sucesso!')
      onOpenChange(false)
      onCriado()
      router.push(`/agentes/${novo.id}`)
    } catch {
      toast.error('Erro ao criar agente')
    } finally {
      setCriando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg rounded-2xl p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <div className="relative px-6 py-5">
          {step > 1 && (
            <button
              onClick={handleVoltar}
              className="absolute top-4 left-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pt-6">
            {step === 1 && <StepNome nome={nome} onChange={setNome} />}
            {step === 2 && <StepObjetivo objetivo={objetivo} onChange={setObjetivo} />}
            {step === 3 && <StepDescricao descricao={descricao} onChange={setDescricao} />}
            {step === 4 && <StepConfig config={config} onChange={setConfig} />}
            {step === 5 && (
              <StepBases
                bases={bases}
                basesIds={basesIds}
                onChange={setBasesIds}
              />
            )}
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3 border-t border-border/50 pt-4">
          <Button
            onClick={step === TOTAL_STEPS ? handleCriar : handleContinuar}
            disabled={!podeAvancar() || criando}
            className="w-full h-11 rounded-xl text-[14px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15"
          >
            {criando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : step === TOTAL_STEPS ? (
              'Criar agente'
            ) : (
              'Continuar'
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  i + 1 === step ? 'w-6 bg-primary' : i + 1 < step ? 'w-4 bg-primary/60' : 'w-4 bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// === Step 1: Nome ===
const StepNome = ({ nome, onChange }: { nome: string; onChange: (v: string) => void }) => (
  <div className="text-center space-y-5">
    <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
      <Bot className="h-7 w-7 text-white" strokeWidth={1.8} />
    </div>
    <div>
      <h2 className="text-[20px] font-bold tracking-[-0.02em] mb-1">Criar novo agente</h2>
      <p className="text-[13px] text-muted-foreground">
        Seja criativo, escolha o nome que seu agente vai usar para se apresentar
      </p>
    </div>
    <div className="space-y-1.5 text-left">
      <Label className="text-[13px] font-medium">Nome do agente</Label>
      <Input
        autoFocus
        placeholder="Ex: Luna, Rafa, Assistente..."
        value={nome}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl text-[15px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
      />
    </div>
  </div>
)

// === Step 2: Objetivo ===
const StepObjetivo = ({
  objetivo,
  onChange,
}: {
  objetivo: ObjetivoAgente | null
  onChange: (v: ObjetivoAgente) => void
}) => (
  <div className="space-y-5">
    <div className="text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-b from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-3">
        <Sparkles className="h-7 w-7 text-white" strokeWidth={1.8} />
      </div>
      <h2 className="text-[20px] font-bold tracking-[-0.02em] mb-1">
        Qual o objetivo do agente?
      </h2>
      <p className="text-[13px] text-muted-foreground">
        Escolha o que melhor define o que ele vai fazer
      </p>
    </div>
    <div className="grid grid-cols-1 gap-2">
      {OBJETIVOS_AGENTE.map((o) => (
        <ObjetivoCard
          key={o.value}
          icone={o.icon}
          label={o.label}
          descricao={o.descricao}
          cor={o.cor}
          selecionado={objetivo === o.value}
          onClick={() => onChange(o.value)}
        />
      ))}
    </div>
  </div>
)

// === Step 3: Descricao ===
const StepDescricao = ({
  descricao,
  onChange,
}: {
  descricao: string
  onChange: (v: string) => void
}) => (
  <div className="space-y-5">
    <div className="text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
        <Sparkles className="h-7 w-7 text-white" strokeWidth={1.8} />
      </div>
      <h2 className="text-[20px] font-bold tracking-[-0.02em] mb-1">Descreva o agente</h2>
      <p className="text-[13px] text-muted-foreground">
        Uma breve descrição do propósito e abordagem do agente
      </p>
    </div>
    <div className="space-y-1.5">
      <Label className="text-[13px] font-medium">Descrição</Label>
      <Textarea
        placeholder="Ex: Agente vendedora principal. Qualifica leads e fecha vendas com abordagem consultiva..."
        value={descricao}
        onChange={(e) => onChange(e.target.value.slice(0, 500))}
        className="min-h-[120px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none"
      />
      <div className="flex justify-end">
        <span className="text-[11px] text-muted-foreground">{descricao.length}/500</span>
      </div>
    </div>
  </div>
)

// === Step 4: Config ===
const StepConfig = ({
  config,
  onChange,
}: {
  config: ConfigAgente
  onChange: (v: ConfigAgente) => void
}) => (
  <div className="space-y-5">
    <div className="text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
        <Sparkles className="h-7 w-7 text-white" strokeWidth={1.8} />
      </div>
      <h2 className="text-[20px] font-bold tracking-[-0.02em] mb-1">Configurações</h2>
      <p className="text-[13px] text-muted-foreground">
        Defina o comportamento do agente nos atendimentos
      </p>
    </div>
    <div className="space-y-2">
      <ConfigToggle
        id="wizard-humana"
        icone={UserPlus}
        label="Solicitar ajuda humana"
        descricao="Permite que o agente transfira o atendimento quando necessário"
        checked={config.solicitarAjudaHumana}
        onChange={(v) => onChange({ ...config, solicitarAjudaHumana: v })}
      />
      <ConfigToggle
        id="wizard-emojis"
        icone={Sparkles}
        label="Usar emojis nas respostas"
        descricao="O agente poderá utilizar emojis para tornar a conversa mais leve"
        checked={config.usarEmojis}
        onChange={(v) => onChange({ ...config, usarEmojis: v })}
      />
      <ConfigToggle
        id="wizard-temas"
        icone={ShieldCheck}
        label="Restringir temas permitidos"
        descricao="O agente não falará sobre assuntos fora da base de conhecimento"
        checked={config.restringirTemas}
        onChange={(v) => onChange({ ...config, restringirTemas: v })}
      />
      <ConfigToggle
        id="wizard-split"
        icone={Split}
        label="Dividir resposta em partes"
        descricao="Respostas longas serão enviadas em múltiplas mensagens"
        checked={config.dividirRespostaEmPartes}
        onChange={(v) => onChange({ ...config, dividirRespostaEmPartes: v })}
      />
    </div>
  </div>
)

// === Step 5: Bases ===
const StepBases = ({
  bases,
  basesIds,
  onChange,
}: {
  bases: BaseConhecimento[]
  basesIds: string[]
  onChange: (v: string[]) => void
}) => (
  <div className="space-y-5">
    <div className="text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-b from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/20 mb-3">
        <Sparkles className="h-7 w-7 text-white" strokeWidth={1.8} />
      </div>
      <h2 className="text-[20px] font-bold tracking-[-0.02em] mb-1">Bases de conhecimento</h2>
      <p className="text-[13px] text-muted-foreground">
        Selecione as bases que o agente vai consultar nas conversas
      </p>
    </div>
    <BasesMultiSelect bases={bases} selecionadas={basesIds} onChange={onChange} />
  </div>
)
