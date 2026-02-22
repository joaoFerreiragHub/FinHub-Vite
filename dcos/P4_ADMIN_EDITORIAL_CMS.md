# P4 - Admin Editorial CMS (Conteudo e Curadoria)

Data: 2026-02-22  
Status: PLANEADO (apos fecho de P2 Admin-first operacional).

## 1) Objetivo de negocio
Permitir que o admin opere como "bootstrap creator/editorial" quando a rede de creators ainda e reduzida, garantindo:
- criacao e manutencao de conteudo por tipo;
- curadoria da homepage por secoes;
- controlo de paginas proprias por vertical (com "mostrar todos");
- transicao limpa de ownership quando creators oficiais entrarem na plataforma.

Sem este bloco, o admin consegue moderar e operar seguranca, mas nao consegue escalar aquisicao editorial e discovery de forma consistente.

## 2) Escopo funcional (MVP do Admin CMS)

### 2.1 Conteudo seed pelo admin
1. CRUD admin para:
- artigos
- cursos
- videos
- lives/eventos
- podcasts
- books (se aplicavel ao ciclo)
2. Estado editorial:
- `draft`
- `in_review`
- `scheduled`
- `published`
- `unpublished`
- `archived`
3. Campos comuns obrigatorios:
- titulo, slug, resumo, descricao curta, imagem, tags/categorias
- `sourceType` (`internal`, `external_profile`, `external_content`)
- `ownerType` (`admin_seeded`, `creator_owned`)

### 2.2 Diretorios verticais (brokers/exchanges/apps/sites)
1. CRUD dedicado por vertical:
- corretoras
- exchanges
- sites/portais
- apps financeiras
2. Campos base:
- nome, slug, logo, URL principal, pais/regiao, categorias, status de verificacao
- metadados de rating editorial (opcional no MVP)
3. Controlo de visibilidade:
- `isActive`
- `isFeatured`
- `showInHomeSection`
- `showInDirectory`

### 2.3 Curadoria de homepage
1. Gestao de secoes dinamicas:
- criar secao
- editar metadata (titulo, subtitulo, ordem)
- ativar/desativar secao
2. Gestao de itens em secao:
- adicionar/remover item
- ordenar manualmente (pin + sort order)
- limite por secao (top N)
- janela temporal (`startAt`, `endAt`)
3. Flags editoriais:
- `showOnHome`
- `showOnLanding`
- `showOnShowAll`

### 2.4 Paginas proprias por vertical
1. Configurar se uma vertical tem pagina propria:
- ex.: `/mercados/corretoras`, `/mercados/exchanges`, `/ferramentas/apps`.
2. Definir comportamento:
- `landingEnabled`
- `showAllEnabled`
- template de listagem e filtros.

### 2.5 Fluxo de claim/migracao para creators
1. Marcar ativos como `claimable`.
2. Workflow de claim:
- pedido de claim
- validacao admin
- aprovacao/rejeicao
3. Migracao de ownership:
- `admin_seeded` -> `creator_owned`
- preservar `slug`, historico e auditoria
- desativar duplicados seedados apos claim.

## 3) Escopo nao funcional
1. Auditoria obrigatoria para todas as acoes editoriais admin.
2. RBAC por escopos dedicados (ver secao 4).
3. Guardrails em acoes com impacto:
- confirmacao dupla em publish/unpublish em massa
- motivo obrigatorio em despublicacao/arquivamento
4. Consistencia de URL:
- canonical URL por entidade
- regras anti-duplicado por slug + dominio externo.
5. Performance:
- endpoint de homepage curada com cache control.

## 4) RBAC proposto (novos escopos)
1. `admin.content.create`
2. `admin.content.edit`
3. `admin.content.publish`
4. `admin.content.archive`
5. `admin.home.curate`
6. `admin.directory.manage`
7. `admin.claim.review`
8. `admin.claim.transfer`

Perfis sugeridos:
- `admin.editor`: create/edit + curate (sem transfer ownership)
- `admin.publisher`: publish/archive + curate
- `admin.super`: todos os escopos
- `admin.read_only`: leitura sem escrita

## 5) Modelo de dados (alto nivel)

### 5.1 Entidades novas (propostas)
1. `EditorialSection`
- chave, titulo, subtitulo, tipo, ordem, flags de visibilidade
2. `EditorialSectionItem`
- sectionId, targetType, targetId, sortOrder, pin, startAt, endAt, status
3. `DirectoryEntry`
- verticalType, nome, slug, url, metadata, status, featured
4. `ClaimRequest`
- targetType, targetId, creatorId, status, reviewedBy, reviewedAt, note
5. `OwnershipTransferLog`
- fromOwner, toOwner, target, before/after snapshot

### 5.2 Campos adicionais em conteudo existente
1. `ownerType: admin_seeded | creator_owned`
2. `sourceType: internal | external_profile | external_content`
3. `claimable: boolean`
4. `editorialVisibility`:
- `showOnHome`
- `showOnLanding`
- `showOnShowAll`

## 6) API alvo (MVP)

### 6.1 Curadoria homepage
1. `GET /api/admin/editorial/sections`
2. `POST /api/admin/editorial/sections`
3. `PATCH /api/admin/editorial/sections/:id`
4. `POST /api/admin/editorial/sections/:id/items`
5. `PATCH /api/admin/editorial/sections/:id/items/reorder`
6. `DELETE /api/admin/editorial/sections/:id/items/:itemId`

### 6.2 Diretorios
1. `GET /api/admin/directories/:vertical`
2. `POST /api/admin/directories/:vertical`
3. `PATCH /api/admin/directories/:vertical/:id`
4. `POST /api/admin/directories/:vertical/:id/publish`
5. `POST /api/admin/directories/:vertical/:id/archive`

### 6.3 Claim e ownership
1. `GET /api/admin/claims`
2. `POST /api/admin/claims/:id/approve`
3. `POST /api/admin/claims/:id/reject`
4. `POST /api/admin/ownership/transfer`

### 6.4 Leitura publica (consumo frontend)
1. `GET /api/editorial/home`
2. `GET /api/editorial/:vertical`
3. `GET /api/editorial/:vertical/show-all`

## 7) Frontend admin alvo
1. Novo modulo no painel admin: `Editorial/CMS`.
2. Submodulos:
- `Secoes Home`
- `Diretorios`
- `Conteudo Seed`
- `Claims`
3. UX minima:
- tabela + filtros + drawer de edicao
- preview de secao
- drag/drop de ordenacao (ou ordem por input no MVP)
- confirmacao dupla para publish/unpublish/archive

## 8) Fases de execucao sugeridas

### Fase A - Fundacao (bloqueante)
1. schema + migrações
2. escopos RBAC + auditoria
3. contrato OpenAPI dos endpoints

### Fase B - Curadoria Home
1. CRUD de secoes
2. CRUD/reorder de itens
3. endpoint publico `/api/editorial/home`

### Fase C - Diretorios verticais
1. CRUD de `DirectoryEntry`
2. visibilidade/destaque
3. landing/show-all por vertical

### Fase D - Seed content + claim
1. ownerType/sourceType/claimable
2. fluxo de claim review
3. transfer de ownership com log

### Fase E - Hardening
1. E2E de fluxo editorial completo
2. rate limits e guardrails de bulk
3. playbook operacional de rollback

## 9) Criterios de aceite (definition of done)
1. Admin consegue criar/publicar conteudo seed de pelo menos 4 tipos (article/video/podcast/evento).
2. Admin consegue montar homepage com secoes dinamicas sem deploy.
3. Admin consegue gerir diretorios (corretoras/exchanges/apps/sites) com landing e show-all.
4. Claim de creator transfere ownership sem quebrar slug/canonical URL.
5. Todas as acoes sensiveis deixam trilha de auditoria.
6. Gates tecnicos verdes:
- backend: `typecheck`, `build`, `contract:openapi`
- frontend: `typecheck:p1`, `lint`, `test`, `build`, `test:e2e`

## 10) Riscos e mitigacoes
1. Risco: duplicacao de entidades seed vs creator.
- Mitigacao: chave canonical por URL externa + workflow de merge.
2. Risco: homepage degradar performance.
- Mitigacao: cache por secao + invalidador por update editorial.
3. Risco: abuso operacional de publish em massa.
- Mitigacao: limites por batch + confirmacao dupla + motivo + auditoria.
4. Risco: claims fraudulentos.
- Mitigacao: prova de posse de canal/link oficial + revisao humana.

## 11) Dependencias
1. Base P2 (RBAC/auditoria/guardrails) ja entregue.
2. Alinhamento de modelos de conteudo e profiles de creator.
3. Priorizacao de produto para ordenar:
- P3 (Analise Rapida)
- P4 Admin CMS
- P4 restantes itens legados.

## 12) Sequencia pragmatica recomendada
1. Finalizar fecho tecnico de P3.
2. Iniciar Fase A e B do Admin CMS em paralelo de design de UX.
3. Entrar em diretorios + claim apos estabilidade da curadoria home.
