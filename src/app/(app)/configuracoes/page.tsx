'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/services/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Camera, Loader2, Save, Bot, ShieldOff } from 'lucide-react'

export default function ConfiguracoesPage() {
  const { usuario, atualizarPerfil } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [fotoUrl, setFotoUrl] = useState(usuario?.fotoUrl ?? '')
  const [agentesDesligados, setAgentesDesligados] = useState(usuario?.agentesDesligados ?? false)
  const [salvando, setSalvando] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [conversasIA, setConversasIA] = useState(0)

  // Sync when usuario loads
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome)
      setFotoUrl(usuario.fotoUrl ?? '')
      setAgentesDesligados(usuario.agentesDesligados ?? false)
    }
  }, [usuario])

  // Count conversas em modo IA
  useEffect(() => {
    api.conversas.listar().then((list) => {
      setConversasIA(list.filter((c) => c.modo === 'IA').length)
    })
  }, [agentesDesligados])

  const handleSalvarNome = async () => {
    if (!nome.trim() || nome === usuario?.nome) return
    setSalvando(true)
    try {
      await api.perfil.atualizar({ nome: nome.trim() })
      atualizarPerfil({ nome: nome.trim() })
      toast.success('Nome atualizado')
    } catch {
      toast.error('Erro ao atualizar nome')
    } finally {
      setSalvando(false)
    }
  }

  const handleFotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (max 5MB)')
      return
    }

    setUploadingFoto(true)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const url = await api.perfil.uploadFoto(base64, file.type)
        setFotoUrl(url)
        atualizarPerfil({ fotoUrl: url })
        toast.success('Foto atualizada')
        setUploadingFoto(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Erro ao enviar foto')
      setUploadingFoto(false)
    }
  }

  const handleToggleAgentes = async (checked: boolean) => {
    setToggling(true)
    try {
      await api.perfil.toggleAgentes(checked)
      setAgentesDesligados(checked)
      atualizarPerfil({ agentesDesligados: checked })
      toast.success(
        checked
          ? 'Agentes desligados. Todas as conversas estão no modo humano.'
          : 'Agentes religados. Conversas voltaram ao modo anterior.'
      )
    } catch {
      toast.error('Erro ao alterar modo dos agentes')
    } finally {
      setToggling(false)
    }
  }

  if (!usuario) return null

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
          Configurações
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Gerencie seu perfil e preferências
        </p>
      </div>

      {/* Perfil */}
      <div className="rounded-2xl bg-card apple-shadow p-6 space-y-6">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em]">Perfil</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <button
            onClick={handleFotoClick}
            disabled={uploadingFoto}
            className="relative group"
            aria-label="Trocar foto de perfil"
          >
            <Avatar className="h-20 w-20 ring-2 ring-border/50">
              {fotoUrl && <AvatarImage src={fotoUrl} alt={usuario.nome} />}
              <AvatarFallback className="bg-gradient-to-b from-blue-500 to-blue-600 text-white text-2xl font-semibold">
                {usuario.nome.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingFoto ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFotoChange}
          />
          <div>
            <p className="text-[14px] font-medium">{usuario.nome}</p>
            <p className="text-[12px] text-muted-foreground">{usuario.email}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Clique na foto para alterar
            </p>
          </div>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label className="text-[13px]">Nome</Label>
          <div className="flex gap-2">
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="rounded-xl text-[14px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSalvarNome()
              }}
            />
            <Button
              onClick={handleSalvarNome}
              disabled={salvando || !nome.trim() || nome === usuario.nome}
              className="rounded-xl shrink-0"
              size="sm"
            >
              {salvando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Email (readonly) */}
        <div className="space-y-2">
          <Label className="text-[13px]">E-mail</Label>
          <Input
            value={usuario.email}
            disabled
            className="rounded-xl text-[14px] bg-muted/30"
          />
          <p className="text-[11px] text-muted-foreground">
            O e-mail não pode ser alterado
          </p>
        </div>
      </div>

      {/* Agentes */}
      <div className="rounded-2xl bg-card apple-shadow p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Bot className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
            Agentes IA
          </h2>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <ShieldOff className="h-4 w-4 text-orange-500" />
              <span className="text-[14px] font-medium">
                Desligar todos os agentes
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Quando ativado, todas as conversas passam para atendimento humano.
              Ao desativar, as conversas voltam ao modo anterior.
            </p>
            {!agentesDesligados && conversasIA > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-700 text-[10px] rounded-md mt-1"
              >
                {conversasIA} conversa{conversasIA !== 1 ? 's' : ''} com IA ativa
              </Badge>
            )}
            {agentesDesligados && (
              <Badge
                variant="secondary"
                className="bg-orange-500/10 text-orange-700 text-[10px] rounded-md mt-1"
              >
                Agentes desligados
              </Badge>
            )}
          </div>
          <div className="shrink-0">
            {toggling ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                checked={agentesDesligados}
                onCheckedChange={handleToggleAgentes}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
