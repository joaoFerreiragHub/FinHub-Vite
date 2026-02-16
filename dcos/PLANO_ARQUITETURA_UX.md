# 🎨 FinHub - Arquitetura de Informação & UX

**Data**: 2026-02-16
**Objetivo**: Estruturar a navegação, páginas e fluxos da plataforma FinHub

---

## 🎯 Conceito da Plataforma

**FinHub = IMDB + Instagram + Product Hunt... para Literacia Financeira em PT**

**Missão**:
- Dar visibilidade ao melhor conteúdo e aos melhores criadores de literacia financeira em PT
- Ajudar utilizadores a descobrir ferramentas, recursos e conteúdo de qualidade
- Criar comunidade ativa em torno de finanças pessoais

---

## 📐 As 5 Vertentes da Plataforma

### 1️⃣ **Discovery de Recursos** (Brands)
Catálogo de ferramentas, sites, apps, corretoras, livros, podcasts externos, etc.
- **Público-alvo**: Todos (visitors, users, creators)
- **Backend**: Brands (gerido por admins)
- **Funcionalidade**: Browse, filter, rate, comment

### 2️⃣ **Conteúdo de Criadores PT**
Plataforma para criadores partilharem conhecimento
- **Público-alvo**: Visitors (consumo), Creators (publicação)
- **Backend**: Articles, Videos, Courses, Lives, Podcasts, Books
- **Funcionalidade**: Browse por tipo/categoria/creator, rate, comment, follow

### 3️⃣ **Ferramentas Próprias**
Calculadoras, simuladores, trackers, etc. (FUTURO)
- **Público-alvo**: Users premium
- **Backend**: A definir
- **Funcionalidade**: Tools interativos

### 4️⃣ **Sistema Social**
Ratings, comments, follows, likes, notificações
- **Público-alvo**: Users autenticados
- **Backend**: Ratings, Comments, Follows, Favorites, Notifications
- **Funcionalidade**: Engagement tipo redes sociais

### 5️⃣ **Hub Educativo**
Notícias, glossário, cursos básicos gratuitos
- **Público-alvo**: Todos
- **Backend**: News, Glossary (a criar), Educational Courses
- **Funcionalidade**: Aprendizagem estruturada

---

## 🗺️ Mapa do Site (Sitemap)

```
FinHub
│
├── 🏠 Homepage
│   ├── Hero Section
│   ├── Featured Content (carrossel)
│   ├── Top Creators (6-8)
│   ├── Latest Content (grid 3x2)
│   ├── Featured Brands (carrossel)
│   └── CTA (Join / Explorar)
│
├── 🔍 Explorar
│   ├── /explorar/tudo              - Feed geral (todos os tipos misturados)
│   ├── /explorar/artigos           - Só artigos
│   ├── /explorar/videos            - Só vídeos
│   ├── /explorar/cursos            - Só cursos
│   ├── /explorar/eventos           - Lives e eventos
│   ├── /explorar/podcasts          - Só podcasts
│   └── /explorar/livros            - Só livros
│
├── 👥 Criadores
│   ├── /criadores                  - Lista de todos os criadores
│   ├── /criadores/:username        - Perfil do criador
│   │   ├── Overview (bio, stats, badges)
│   │   ├── Conteúdo (tabs: Todos, Artigos, Vídeos, etc.)
│   │   ├── Sobre (bio longa, links sociais)
│   │   └── Reviews (ratings & comments ao criador)
│   └── /criadores/top              - Top creators (leaderboard)
│
├── 🏢 Recursos (Brands)
│   ├── /recursos                   - Browse all brands
│   ├── /recursos/corretoras        - Só corretoras
│   ├── /recursos/plataformas       - Só plataformas
│   ├── /recursos/exchanges         - Só exchanges
│   ├── /recursos/apps              - Apps e ferramentas
│   ├── /recursos/sites             - Websites úteis
│   ├── /recursos/podcasts          - Podcasts externos
│   ├── /recursos/livros            - Livros externos
│   └── /recursos/:slug             - Detalhe de um recurso
│
├── 🎓 Aprender
│   ├── /aprender                   - Hub educativo (overview)
│   ├── /aprender/noticias          - Agregador de notícias
│   ├── /aprender/glossario         - Dicionário financeiro
│   ├── /aprender/cursos-gratuitos  - Cursos básicos da plataforma
│   └── /aprender/guias             - Guias/tutoriais
│
├── 🔧 Ferramentas (FUTURO)
│   ├── /ferramentas                - Overview de tools
│   ├── /ferramentas/calculadoras   - Calculadoras financeiras
│   ├── /ferramentas/simuladores    - Simuladores de investimento
│   └── /ferramentas/trackers       - Portfolio trackers
│
├── 👤 User Area
│   ├── /perfil/:username           - Perfil público
│   ├── /conta                      - Configurações da conta
│   ├── /meus-favoritos             - Conteúdos favoritados
│   ├── /a-seguir                   - Feed de quem sigo
│   └── /notificacoes               - Centro de notificações
│
├── 🎨 Creator Dashboard
│   ├── /dashboard                  - Overview (stats, gráficos)
│   ├── /dashboard/conteudo         - Gestão de conteúdo
│   │   ├── Todos
│   │   ├── Artigos
│   │   ├── Vídeos
│   │   ├── Cursos
│   │   ├── Eventos
│   │   ├── Podcasts
│   │   └── Livros
│   ├── /dashboard/criar            - Criar novo conteúdo
│   ├── /dashboard/analytics        - Analytics detalhadas
│   ├── /dashboard/seguidores       - Gestão de audiência
│   └── /dashboard/perfil           - Editar perfil de creator
│
├── 🛡️ Admin Panel
│   ├── /admin                      - Dashboard admin
│   ├── /admin/users                - Gestão de utilizadores
│   ├── /admin/conteudo             - Moderação de conteúdo
│   ├── /admin/recursos             - Gestão de brands
│   ├── /admin/reports              - Reports e moderação
│   └── /admin/stats                - Estatísticas da plataforma
│
└── 📄 Outras Páginas
    ├── /sobre                      - Sobre o FinHub
    ├── /contacto                   - Contacto
    ├── /faq                        - FAQ
    ├── /termos                     - Termos de Uso
    ├── /privacidade                - Política de Privacidade
    ├── /login                      - Login
    └── /registar                   - Criar conta
```

---

## 🧭 Navegação Principal (Top Menu)

### Opção A: 5 Itens Principais (RECOMENDADO)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo] FinHub     Explorar ▼  |  Criadores  |  Recursos ▼  |  Aprender ▼     [Search]  [Login]  [Registar]  │
└─────────────────────────────────────────────────────────────────────┘

Explorar ▼
  ├─ Tudo
  ├─ Artigos
  ├─ Vídeos
  ├─ Cursos
  ├─ Eventos
  ├─ Podcasts
  └─ Livros

Recursos ▼
  ├─ Corretoras
  ├─ Plataformas
  ├─ Exchanges
  ├─ Apps
  ├─ Sites
  ├─ Podcasts
  └─ Livros

Aprender ▼
  ├─ Notícias
  ├─ Glossário
  ├─ Cursos Gratuitos
  └─ Guias
```

**Quando user está logado**, o menu direito muda:
```
[Search]  [Notificações 🔔]  [Avatar ▼]

Avatar ▼
  ├─ Ver Perfil
  ├─ Meus Favoritos
  ├─ A Seguir
  ├─ Configurações
  └─ Sair

Se for Creator:
Avatar ▼
  ├─ Ver Perfil Público
  ├─ Dashboard Creator
  ├─ Criar Conteúdo
  ├─ Meus Favoritos
  ├─ A Seguir
  ├─ Configurações
  └─ Sair
```

---

### Opção B: 7 Itens (Alternativa)

```
[Logo] FinHub   Explorar  Artigos  Vídeos  Cursos  Criadores  Recursos  Aprender   [Search] [User Menu]
```

**Prós**: Acesso direto aos tipos mais populares
**Contras**: Menu mais cheio

---

## 📱 Mobile Navigation

**Hamburger Menu** com estrutura simplificada:

```
☰ Menu
  ├─ 🏠 Início
  ├─ 🔍 Explorar
  │   ├─ Tudo
  │   ├─ Artigos
  │   ├─ Vídeos
  │   ├─ Cursos
  │   └─ ...
  ├─ 👥 Criadores
  ├─ 🏢 Recursos
  ├─ 🎓 Aprender
  ├─ ─────────────
  ├─ 👤 Meu Perfil
  ├─ ❤️ Favoritos
  ├─ 👁️ A Seguir
  ├─ 🔔 Notificações
  └─ ⚙️ Configurações

Bottom Tab Bar (Mobile):
[Home]  [Explorar]  [Criar+]  [Notif]  [Perfil]
```

---

## 📄 Estrutura Detalhada das Páginas Principais

### 🏠 Homepage

**Hero Section**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     Descobre o Melhor Conteúdo                               │
│     de Literacia Financeira em PT                            │
│                                                              │
│     [Input: Pesquisar artigos, criadores, recursos...]       │
│                                                              │
│     [CTA: Explorar Agora]  [CTA: Começar Grátis]             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Featured Content** (Carrossel)
- 5-8 conteúdos destacados (admin curated)
- Card: Imagem, Título, Creator, Rating, Tipo

**Top Creators** (Grid 3x2 ou 4x2)
- Card: Avatar, Nome, Especialidade, Nº Seguidores, Rating, [Seguir]

**Latest Content** (Grid 3x3)
- Mix de todos os tipos
- Card: Imagem, Título, Creator Avatar, Tipo, Rating

**Featured Brands** (Carrossel)
- 8-10 recursos em destaque
- Card: Logo, Nome, Tipo, Rating, [Ver Mais]

**Categories** (Grid de ícones)
- Investimento, Trading, Crypto, Poupança, etc.
- Click → filtra conteúdo por categoria

**Stats da Plataforma**
- "1.234 Criadores" | "5.678 Conteúdos" | "10.000+ Users"

**CTA Final**
- "Junta-te à comunidade" → Register

---

### 🔍 Explorar (/explorar/tudo)

**Filtros (Sidebar Esquerda)**
```
Tipo de Conteúdo
  ☑ Artigos
  ☑ Vídeos
  ☑ Cursos
  ☑ Eventos
  ☑ Podcasts
  ☑ Livros

Categoria
  ○ Investimento
  ○ Trading
  ○ Crypto
  ○ Poupança
  ○ ...

Rating
  ☆☆☆☆☆ 5 estrelas
  ☆☆☆☆ 4+ estrelas
  ☆☆☆ 3+ estrelas

Acesso
  ○ Grátis
  ○ Premium

Criador
  [Input: Pesquisar criador...]
```

**Área Principal**
```
┌─────────────────────────────────────────────────────┐
│  Ordenar: [Mais Recente ▼] [Mais Popular] [Melhor Avaliado]    │
└─────────────────────────────────────────────────────┘

Grid de Cards (3 colunas desktop, 1 coluna mobile)

Card de Conteúdo:
┌────────────────────┐
│ [Cover Image]      │ ← Click → vai para /artigos/:slug
├────────────────────┤
│ 📝 ARTIGO          │ ← Badge do tipo
│ Título do Artigo   │
│ by @criador        │ ← Click → /criadores/:username
│ ⭐ 4.5 (23) | 👁 1.2K │ ← Rating + Views
│ #trading #stocks   │ ← Tags
└────────────────────┘

[Paginação: < 1 2 3 4 5 >]
```

---

### 👥 Perfil de Criador (/criadores/:username)

**Header**
```
┌──────────────────────────────────────────────────────────┐
│  [Cover Image]                                           │
│                                                          │
│  [Avatar]  João Silva                      [Seguir]     │
│            @joaosilva                      1.2K followers│
│            ⭐ 4.8 (156 reviews)            Level 7 👑     │
│                                                          │
│  📝 Especialista em Trading | 🎓 CFA                      │
│  📍 Lisboa, PT                                           │
│  🔗 website.com | twitter | youtube                      │
└──────────────────────────────────────────────────────────┘
```

**Tabs de Navegação**
```
[Conteúdo]  [Sobre]  [Reviews]
```

**Tab: Conteúdo**
```
Sub-tabs: [Todos] [Artigos] [Vídeos] [Cursos] [Eventos] [Podcasts] [Livros]

Stats rápidas:
  • 45 Artigos publicados
  • 1.2M Views totais
  • 12.5% Engagement rate

Grid de conteúdo (igual ao Explorar)
```

**Tab: Sobre**
```
Bio longa (rich text)
Especialidades
Links sociais
Badges desbloqueados
Conquistas
```

**Tab: Reviews**
```
Rating Breakdown:
  ⭐⭐⭐⭐⭐ 120 (77%)
  ⭐⭐⭐⭐   30 (19%)
  ⭐⭐⭐    5 (3%)
  ⭐⭐      1 (1%)
  ⭐       0 (0%)

Lista de reviews (ordenado por: Recentes | Mais Úteis)
  [Avatar] Nome User
  ⭐⭐⭐⭐⭐
  "Excelente criador, conteúdo de qualidade..."
  👍 15 pessoas acharam útil
  [Reply] (se tiver respostas)
```

---

### 🏢 Detalhe de Recurso (/recursos/:slug)

**Exemplo: Corretora XTB**

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]  XTB - Corretora Online                          │
│          ⭐ 4.5 (234 reviews)                             │
│          🏢 Corretora | 🌍 Portugal | ✅ Verificado        │
│                                                          │
│  [Visitar Site]  [Favoritar ❤️]                          │
└──────────────────────────────────────────────────────────┘

Tabs: [Overview] [Reviews] [Relacionado]

Tab: Overview
  ├─ Descrição (rich text)
  ├─ Destaques
  │   • CFDs, Forex, Ações
  │   • Regulado pela CMVM
  │   • Plataforma xStation 5
  ├─ Prós & Contras (de reviews agregados)
  ├─ Links úteis
  └─ Tags: #forex #cfds #stocks

Tab: Reviews
  ├─ Rating breakdown
  ├─ [Escrever Review]
  └─ Lista de reviews

Tab: Relacionado
  └─ Outros recursos similares (outras corretoras)
```

---

### 📝 Detalhe de Conteúdo (/artigos/:slug)

**Exemplo: Artigo**

```
┌──────────────────────────────────────────────────────────┐
│  [Cover Image - Full Width]                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Como Investir em ETFs: Guia Completo                    │
│                                                          │
│  [Avatar] João Silva (@joaosilva)  [Seguir]              │
│  Publicado em 15 Fev 2026 • 8 min leitura               │
│  ⭐ 4.8 (45) | 👁 2.3K views | 💬 12 comentários          │
│  #etfs #investimento #passivo                            │
│                                                          │
│  [❤️ Favoritar]  [👍 Like]  [💬 Comentar]  [🔗 Partilhar]   │
└──────────────────────────────────────────────────────────┘

Conteúdo (rich text com imagens, vídeos embeds)

Secção de Rating (se user autenticado):
  ┌──────────────────────────────────┐
  │  Gostaste deste artigo?          │
  │  Deixa a tua avaliação:          │
  │  ☆☆☆☆☆                           │
  │  [Opcional: Escrever review]     │
  │  [Submeter]                      │
  └──────────────────────────────────┘

Secção de Comentários:
  ┌──────────────────────────────────┐
  │  12 Comentários                  │
  │  [Escrever comentário...]        │
  │                                  │
  │  [Avatar] User 1                 │
  │  ⭐⭐⭐⭐⭐ Há 2 dias              │
  │  Excelente artigo! ...           │
  │  👍 5  [Responder]                │
  │                                  │
  │    └─ [Avatar] João Silva        │
  │       Obrigado! ...              │
  │       👍 2                        │
  └──────────────────────────────────┘

Sidebar (Desktop):
  ├─ Sobre o Criador
  │   [Avatar] João Silva
  │   Bio curta
  │   ⭐ 4.8 | 1.2K followers
  │   [Seguir]
  │
  ├─ Mais deste Criador (3 artigos)
  └─ Artigos Relacionados (3-5)
```

---

### 🎨 Creator Dashboard (/dashboard)

**Overview**
```
┌──────────────────────────────────────────────────────────┐
│  Bem-vindo, João! 👋                                      │
│  Level 7 👑 | 12,543 XP (próximo: 15,000)                │
│  ████████░░ 85%                                          │
└──────────────────────────────────────────────────────────┘

Stats Cards (4 cards):
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 45       │ │ 123.4K   │ │ 1.2K     │ │ 4.8 ⭐   │
  │ Conteúdos│ │ Views    │ │ Followers│ │ Rating   │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘

Gráfico de Views (últimos 30 dias)
  [Line chart]

Conteúdo Recente (últimos 5)
  [Lista com: Título, Tipo, Views, Likes, Comments, Rating]

Atividade Recente
  • João deu follow (há 2h)
  • Maria comentou em "Como investir..." (há 4h)
  • Pedro deu 5★ em "ETFs explicados" (há 1d)
```

**Gestão de Conteúdo** (/dashboard/conteudo)
```
┌──────────────────────────────────────────────────────────┐
│  [+ Criar Novo]                                          │
│                                                          │
│  Filtros: [Todos ▼] [Status ▼] [Ordenar ▼]  [🔍 Pesquisar]│
└──────────────────────────────────────────────────────────┘

Tabela:
  Título | Tipo | Status | Views | Rating | Publicado | [Ações ⋮]

[Ações]:
  • Ver
  • Editar
  • Publicar/Despublicar
  • Eliminar
  • Ver Stats
```

**Criar Conteúdo** (/dashboard/criar)
```
Escolhe o tipo de conteúdo:
  [📝 Artigo]  [🎥 Vídeo]  [📚 Curso]  [📅 Evento]  [🎙️ Podcast]  [📖 Livro]

(Após escolher, form específico de cada tipo)

Form Artigo:
  • Título *
  • Cover Image (upload)
  • Categoria *
  • Tags
  • Conteúdo (Rich Text Editor)
  • É Premium? ☑
  • [Guardar Rascunho]  [Publicar]
```

**Analytics** (/dashboard/analytics)
```
Período: [Últimos 30 dias ▼]

KPIs:
  • Total Views
  • Unique Viewers
  • Engagement Rate
  • New Followers
  • Average Rating

Gráficos:
  • Views over time (line)
  • Engagement by content type (bar)
  • Top performing content (table)
  • Traffic sources (pie)
  • Audience demographics (se disponível)

Export: [CSV]  [PDF]
```

---

### 🛡️ Admin Panel (/admin)

**Dashboard**
```
Stats Globais:
  • Total Users (visitors, free, premium, creators)
  • Total Content
  • Total Brands
  • Total Reviews/Comments

Gráficos:
  • User Growth
  • Content Published (by type)
  • Engagement Metrics

Recent Activity:
  • New users
  • New content
  • Reports pendentes
```

**Gestão de Recursos** (/admin/recursos)
```
[+ Adicionar Novo Recurso]

Filtros: [Tipo ▼] [Status ▼] [Ordenar ▼]

Tabela:
  Nome | Tipo | Rating | Reviews | Status | [Ações]

[Ações]:
  • Ver
  • Editar
  • Toggle Active
  • Toggle Featured
  • Toggle Verified
  • Eliminar
```

---

## 🎭 User Journeys (Fluxos de Utilizador)

### Journey 1: Visitor → Descoberta → Sign Up

```
1. Visitor acede Homepage
   └→ Vê featured content, top creators, brands

2. Visitor clica num artigo
   └→ Lê artigo completo
   └→ Vê rating/comments (locked: "Faz login para comentar")

3. Visitor clica "Registar"
   └→ Form: Email, Password, Nome, Username
   └→ Escolhe role: Free User ou Creator
   └→ Regista

4. User logado é redirecionado
   └→ Se Free User → /explorar
   └→ Se Creator → /dashboard (wizard setup)
```

### Journey 2: User → Explorar → Engage

```
1. User logado acede /explorar
   └→ Filtra por "Crypto" + "Vídeos"

2. User clica num vídeo
   └→ Vê vídeo embed
   └→ Dá rating 5★ + escreve review

3. User clica no criador
   └→ Vê perfil do criador
   └→ Clica [Seguir]
   └→ Favorita 2 vídeos

4. User recebe notificação
   └→ "João Silva publicou novo vídeo"
   └→ Clica → vai para o vídeo
```

### Journey 3: Creator → Publicar Conteúdo

```
1. Creator acede /dashboard
   └→ Clica [+ Criar Novo]

2. Creator escolhe "Artigo"
   └→ Preenche form (título, cover, conteúdo, tags)
   └→ Clica [Publicar]

3. Sistema:
   └→ Gera slug
   └→ Calcula reading time
   └→ Notifica followers (se ativado)
   └→ +50 XP ao creator

4. Creator vai para /artigos/:slug
   └→ Vê artigo publicado
   └→ Partilha link nas redes sociais
```

### Journey 4: User → Descobrir Recursos → Avaliar

```
1. User acede /recursos
   └→ Filtra "Corretoras"

2. User clica "XTB"
   └→ Lê overview, vê reviews

3. User escreve review
   └→ Dá 4★
   └→ Escreve: "Boa corretora, mas spreads poderiam ser melhores"
   └→ Submete

4. Sistema:
   └→ +2 XP ao user
   └→ Atualiza rating médio da XTB
   └→ Review aparece na lista
```

---

## 🎨 Componentes UI Principais

### Content Card (Reutilizável)
```
┌────────────────────┐
│ [Cover Image]      │
│ [Badge: Tipo]      │ ← Premium badge se isPremium
├────────────────────┤
│ Título             │
│ by @creator [★]    │ ← Link para criador
│ ⭐ 4.5 (23) 👁 1.2K │
│ #tag1 #tag2        │
│ [❤️] [💬]          │ ← Favorite + Comments count
└────────────────────┘
```

### Creator Card
```
┌────────────────────┐
│    [Avatar]        │
│                    │
│  João Silva        │
│  @joaosilva        │
│  ⭐ 4.8 | 1.2K seg  │
│  📝 Trading Expert  │
│                    │
│  [Seguir]          │
└────────────────────┘
```

### Brand Card
```
┌────────────────────┐
│    [Logo]          │
│                    │
│  XTB               │
│  Corretora         │
│  ⭐ 4.5 (234)       │
│  ✅ Verificado      │
│                    │
│  [Ver Mais]        │
└────────────────────┘
```

### Rating Component
```
Avaliação Geral: ⭐ 4.5 (234 reviews)

Breakdown:
  ⭐⭐⭐⭐⭐ ████████████████░░░░ 180 (77%)
  ⭐⭐⭐⭐   ███░░░░░░░░░░░░░░░░░ 40  (17%)
  ⭐⭐⭐    █░░░░░░░░░░░░░░░░░░░ 10  (4%)
  ⭐⭐      ░░░░░░░░░░░░░░░░░░░░ 3   (1%)
  ⭐       ░░░░░░░░░░░░░░░░░░░░ 1   (0%)

[Escrever Review]
```

### Comment Thread
```
[Avatar] João Silva           ⭐⭐⭐⭐⭐  Há 2 dias
Excelente artigo, muito bem explicado!
👍 12  [Responder]  [⋮]

  └─ [Avatar] Maria Costa     Há 1 dia
     Concordo! Muito útil.
     👍 3  [Responder]

     └─ [Avatar] João Silva  Há 1 dia
        Obrigado! 😊
        👍 1
```

### Stats Card (Dashboard)
```
┌────────────────────┐
│  123.4K            │ ← Valor grande
│  ↑ 12.5%           │ ← Variação (verde se +, vermelho se -)
│  Total Views       │ ← Label
│  vs. mês anterior  │ ← Contexto
└────────────────────┘
```

---

## 🎯 Prioridades de Implementação (Front-End)

### Fase 1: Core Pages (MVP)
1. **Homepage** - Hero + Featured + Latest
2. **Explorar** - Grid de conteúdo com filtros
3. **Detalhe de Conteúdo** - Layout artigo/vídeo/etc.
4. **Perfil de Criador** - Overview + conteúdo
5. **Auth Pages** - Login, Register

### Fase 2: Social Features
1. **Rating Component** - Stars + reviews
2. **Comment System** - Threading, likes
3. **Notifications** - Centro de notificações
4. **Following Feed** - Feed de quem sigo

### Fase 3: Creator Tools
1. **Dashboard Creator** - Overview + stats
2. **Content Management** - Lista + edição
3. **Create Forms** - Forms por tipo
4. **Analytics** - Gráficos e métricas

### Fase 4: Discovery
1. **Recursos (Brands)** - Browse + detalhe
2. **Search Global** - Pesquisa universal
3. **Filters Avançados** - Multi-filtros
4. **Recommendations** - "Pode interessar"

### Fase 5: Education Hub
1. **News Aggregator** - Feed de notícias
2. **Glossário** - Dicionário A-Z
3. **Cursos Gratuitos** - Learning paths
4. **Guias** - Tutoriais step-by-step

---

## 📊 Métricas de Sucesso (UX)

**Engagement:**
- % de visitors que fazem sign up
- % de users que seguem creators
- % de users que dão ratings/comments
- Tempo médio na plataforma

**Discovery:**
- Nº de conteúdos vistos por sessão
- Taxa de clique em recommendations
- % de users que exploram múltiplos tipos

**Creator Success:**
- % de creators que publicam regularmente
- Média de views por conteúdo
- Taxa de crescimento de followers

**Retention:**
- DAU/MAU ratio
- Bounce rate
- Return visitor rate

---

**Status**: 📝 **PLANEAMENTO COMPLETO**
**Próximo**: Wireframes detalhados + Design System + Implementação
