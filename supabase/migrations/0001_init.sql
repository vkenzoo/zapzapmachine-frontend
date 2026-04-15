-- ============================================================================
-- RoboVendas — Initial Schema
-- Migration: 0001_init
-- Description: Core tables, triggers, and base configuration
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- USUARIOS (extends auth.users)
-- ============================================================================
create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  plano text not null default 'STARTER' check (plano in ('STARTER', 'PRO', 'BUSINESS')),
  status text not null default 'TRIAL' check (status in ('TRIAL', 'ATIVO', 'CANCELADO')),
  criado_em timestamptz not null default now()
);

comment on table public.usuarios is 'Perfil do usuario (estende auth.users)';

-- ============================================================================
-- INTEGRACOES CHECKOUT
-- ============================================================================
create table public.integracoes_checkout (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provedor text not null check (provedor in ('HOTMART', 'KIWIFY', 'TICTO')),
  nome_conta text not null,
  status text not null default 'ATIVO' check (status in ('ATIVO', 'INATIVO', 'ERRO')),
  webhook_secret text not null default encode(gen_random_bytes(16), 'hex'),
  ultimo_recebimento timestamptz,
  criado_em timestamptz not null default now()
);

create index idx_integracoes_checkout_user on public.integracoes_checkout(user_id);

-- ============================================================================
-- BASES DE CONHECIMENTO (criadas antes de agentes pois agentes referencia)
-- ============================================================================
create table public.bases_conhecimento (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  informacoes_produto jsonb not null default '{}'::jsonb,
  persona jsonb not null default '{}'::jsonb,
  faq_objecoes jsonb not null default '[]'::jsonb,
  personalidade_agente jsonb not null default '{}'::jsonb,
  limitacoes jsonb not null default '{}'::jsonb,
  entregaveis jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index idx_bases_conhecimento_user on public.bases_conhecimento(user_id);

-- ============================================================================
-- AGENTES
-- ============================================================================
create table public.agentes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  objetivo text not null check (objetivo in ('VENDAS', 'SUPORTE', 'RECUPERACAO', 'ONBOARDING', 'USO_PESSOAL')),
  descricao text default '',
  avatar_cor text not null default '#3b82f6',
  status text not null default 'ATIVO' check (status in ('ATIVO', 'INATIVO')),
  config jsonb not null default jsonb_build_object(
    'solicitarAjudaHumana', true,
    'usarEmojis', true,
    'restringirTemas', false,
    'dividirRespostaEmPartes', false
  ),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index idx_agentes_user on public.agentes(user_id);

-- ============================================================================
-- PRODUTOS CHECKOUT (depende de integracoes_checkout + agentes)
-- ============================================================================
create table public.produtos_checkout (
  id uuid primary key default gen_random_uuid(),
  integracao_id uuid not null references public.integracoes_checkout(id) on delete cascade,
  id_externo_produto text not null,
  nome_produto text not null,
  agente_vinculado_id uuid references public.agentes(id) on delete set null,
  criado_em timestamptz not null default now()
);

create index idx_produtos_checkout_integracao on public.produtos_checkout(integracao_id);
create index idx_produtos_checkout_agente on public.produtos_checkout(agente_vinculado_id);

-- ============================================================================
-- INSTANCIAS WHATSAPP
-- ============================================================================
create table public.instancias_whatsapp (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome_instancia text not null,
  numero_conectado text,
  status text not null default 'DESCONECTADO' check (status in ('DESCONECTADO', 'CONECTANDO', 'CONECTADO', 'ERRO')),
  evolution_instance_id text,
  criado_em timestamptz not null default now()
);

create index idx_instancias_whatsapp_user on public.instancias_whatsapp(user_id);

-- ============================================================================
-- AGENTES_BASES (junction many-to-many)
-- ============================================================================
create table public.agentes_bases (
  agente_id uuid not null references public.agentes(id) on delete cascade,
  base_id uuid not null references public.bases_conhecimento(id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (agente_id, base_id)
);

create index idx_agentes_bases_base on public.agentes_bases(base_id);

-- ============================================================================
-- CONVERSAS
-- ============================================================================
create table public.conversas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agente_id uuid references public.agentes(id) on delete set null,
  instancia_whatsapp_id uuid references public.instancias_whatsapp(id) on delete set null,
  nome_contato text not null,
  telefone text not null,
  ultima_mensagem text default '',
  ultima_mensagem_em timestamptz not null default now(),
  nao_lidas integer not null default 0,
  modo text not null default 'IA' check (modo in ('IA', 'HUMANO')),
  status text not null default 'AGUARDANDO' check (status in ('AGUARDANDO', 'EM_ATENDIMENTO', 'FINALIZADA')),
  avatar_cor text not null default '#3b82f6',
  criado_em timestamptz not null default now()
);

create index idx_conversas_user_ultima on public.conversas(user_id, ultima_mensagem_em desc);
create index idx_conversas_agente on public.conversas(agente_id);

-- ============================================================================
-- MENSAGENS (user_id denormalized for RLS performance)
-- ============================================================================
create table public.mensagens (
  id uuid primary key default gen_random_uuid(),
  conversa_id uuid not null references public.conversas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('INCOMING', 'OUTGOING_IA', 'OUTGOING_HUMANO')),
  conteudo text not null,
  enviada_em timestamptz not null default now(),
  status text not null default 'ENVIADA' check (status in ('ENVIADA', 'ENTREGUE', 'LIDA'))
);

create index idx_mensagens_conversa on public.mensagens(conversa_id, enviada_em);
create index idx_mensagens_user on public.mensagens(user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: popular public.usuarios apos signup em auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, nome)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Trigger: atualizar atualizado_em automaticamente
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger set_atualizado_em_bases_conhecimento
  before update on public.bases_conhecimento
  for each row
  execute function public.set_atualizado_em();

create trigger set_atualizado_em_agentes
  before update on public.agentes
  for each row
  execute function public.set_atualizado_em();

-- ============================================================================
-- REALTIME (habilitar nas tabelas de conversas)
-- ============================================================================
alter publication supabase_realtime add table public.conversas;
alter publication supabase_realtime add table public.mensagens;
