-- ============================================================================
-- RoboVendas — Row Level Security
-- Migration: 0002_rls
-- Description: Multi-tenant isolation policies
-- ============================================================================

-- ============================================================================
-- USUARIOS (id = auth.uid())
-- ============================================================================
alter table public.usuarios enable row level security;

create policy "usuarios_select_own" on public.usuarios
  for select using (auth.uid() = id);
create policy "usuarios_update_own" on public.usuarios
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================================
-- INTEGRACOES CHECKOUT
-- ============================================================================
alter table public.integracoes_checkout enable row level security;

create policy "integracoes_select_own" on public.integracoes_checkout
  for select using (auth.uid() = user_id);
create policy "integracoes_insert_own" on public.integracoes_checkout
  for insert with check (auth.uid() = user_id);
create policy "integracoes_update_own" on public.integracoes_checkout
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "integracoes_delete_own" on public.integracoes_checkout
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- PRODUTOS CHECKOUT (via parent integracao)
-- ============================================================================
alter table public.produtos_checkout enable row level security;

create policy "produtos_select_via_integracao" on public.produtos_checkout
  for select using (
    exists (
      select 1 from public.integracoes_checkout i
      where i.id = integracao_id and i.user_id = auth.uid()
    )
  );
create policy "produtos_insert_via_integracao" on public.produtos_checkout
  for insert with check (
    exists (
      select 1 from public.integracoes_checkout i
      where i.id = integracao_id and i.user_id = auth.uid()
    )
  );
create policy "produtos_update_via_integracao" on public.produtos_checkout
  for update using (
    exists (
      select 1 from public.integracoes_checkout i
      where i.id = integracao_id and i.user_id = auth.uid()
    )
  );
create policy "produtos_delete_via_integracao" on public.produtos_checkout
  for delete using (
    exists (
      select 1 from public.integracoes_checkout i
      where i.id = integracao_id and i.user_id = auth.uid()
    )
  );

-- ============================================================================
-- INSTANCIAS WHATSAPP
-- ============================================================================
alter table public.instancias_whatsapp enable row level security;

create policy "whatsapp_select_own" on public.instancias_whatsapp
  for select using (auth.uid() = user_id);
create policy "whatsapp_insert_own" on public.instancias_whatsapp
  for insert with check (auth.uid() = user_id);
create policy "whatsapp_update_own" on public.instancias_whatsapp
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "whatsapp_delete_own" on public.instancias_whatsapp
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- BASES DE CONHECIMENTO
-- ============================================================================
alter table public.bases_conhecimento enable row level security;

create policy "bases_select_own" on public.bases_conhecimento
  for select using (auth.uid() = user_id);
create policy "bases_insert_own" on public.bases_conhecimento
  for insert with check (auth.uid() = user_id);
create policy "bases_update_own" on public.bases_conhecimento
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bases_delete_own" on public.bases_conhecimento
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- AGENTES
-- ============================================================================
alter table public.agentes enable row level security;

create policy "agentes_select_own" on public.agentes
  for select using (auth.uid() = user_id);
create policy "agentes_insert_own" on public.agentes
  for insert with check (auth.uid() = user_id);
create policy "agentes_update_own" on public.agentes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "agentes_delete_own" on public.agentes
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- AGENTES_BASES (via parent agente)
-- ============================================================================
alter table public.agentes_bases enable row level security;

create policy "agentes_bases_select_via_agente" on public.agentes_bases
  for select using (
    exists (
      select 1 from public.agentes a
      where a.id = agente_id and a.user_id = auth.uid()
    )
  );
create policy "agentes_bases_insert_via_agente" on public.agentes_bases
  for insert with check (
    exists (
      select 1 from public.agentes a
      where a.id = agente_id and a.user_id = auth.uid()
    )
  );
create policy "agentes_bases_delete_via_agente" on public.agentes_bases
  for delete using (
    exists (
      select 1 from public.agentes a
      where a.id = agente_id and a.user_id = auth.uid()
    )
  );

-- ============================================================================
-- CONVERSAS
-- ============================================================================
alter table public.conversas enable row level security;

create policy "conversas_select_own" on public.conversas
  for select using (auth.uid() = user_id);
create policy "conversas_insert_own" on public.conversas
  for insert with check (auth.uid() = user_id);
create policy "conversas_update_own" on public.conversas
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "conversas_delete_own" on public.conversas
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- MENSAGENS (user_id denormalizado)
-- ============================================================================
alter table public.mensagens enable row level security;

create policy "mensagens_select_own" on public.mensagens
  for select using (auth.uid() = user_id);
create policy "mensagens_insert_own" on public.mensagens
  for insert with check (auth.uid() = user_id);
create policy "mensagens_update_own" on public.mensagens
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mensagens_delete_own" on public.mensagens
  for delete using (auth.uid() = user_id);
