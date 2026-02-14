# Plano de Arquitetura Frontend - FinHub Platform Professional

**Versão:** 2.0
**Data:** 2026-02-13
**Objetivo:** Reconstruir/Melhorar o frontend de forma profissional, escalável e maintainable

---

## 📋 Índice

1. [Visão Geral e Filosofia](#1-visão-geral-e-filosofia)
2. [Níveis de Utilizadores e Permissões](#2-níveis-de-utilizadores-e-permissões)
3. [Arquitetura de 3 Componentes Principais](#3-arquitetura-de-3-componentes-principais)
4. [Estrutura de Pastas Escalável](#4-estrutura-de-pastas-escalável)
5. [Design System e UI Components](#5-design-system-e-ui-components)
6. [State Management Strategy](#6-state-management-strategy)
7. [Routing e Navegação](#7-routing-e-navegação)
8. [Sistema de Permissões e Guards](#8-sistema-de-permissões-e-guards)
9. [API Layer e Data Fetching](#9-api-layer-e-data-fetching)
10. [Plano de Implementação Modular](#10-plano-de-implementação-modular)
11. [Boas Práticas e Padrões](#11-boas-práticas-e-padrões)
12. [Roadmap Detalhado](#12-roadmap-detalhado)

---

## 1. Visão Geral e Filosofia

### 1.1 Princípios Fundamentais

```
🎯 OBJETIVOS CORE:
├── Escalabilidade → Código que cresce sem fricção
├── Manutenibilidade → Fácil de entender e modificar
├── Performance → Rápido e otimizado
├── Acessibilidade → Inclusivo para todos
├── Type Safety → TypeScript em 100%
└── Developer Experience → Prazer em desenvolver
```

### 1.2 Stack Tecnológica Escolhida

```typescript
// Core
React 19             // UI Framework
TypeScript 5.8       // Type Safety
Vite 6              // Build Tool & Dev Server
vite-plugin-ssr     // Server-Side Rendering

// State & Data
Zustand 5           // Client State (simples, performático)
TanStack Query 5    // Server State (cache, sync, mutations)
Zod 3              // Runtime Validation

// UI & Styling
Tailwind CSS 3.4    // Utility-first CSS
Radix UI            // Headless accessible components
CVA                 // Component Variants (class-variance-authority)
Tailwind Merge      // Merge classes sem conflitos

// Forms
React Hook Form 7   // Form state management
Zod                 // Validation

// Routing
Vite SSR           // File-based routing

// Testing
Vitest             // Unit tests
Testing Library    // Component tests
Playwright         // E2E tests

// Tools
ESLint + Prettier  // Code quality
Husky              // Git hooks
Storybook          // Component documentation
PostHog            // Analytics
```

**Justificação das Escolhas:**
- **Zustand vs Redux:** Mais simples, menos boilerplate, melhor performance
- **TanStack Query:** Melhor ferramenta para server state, cache automático
- **Radix UI:** Acessibilidade nativa, headless (customizável)
- **CVA:** Padrão para variantes de componentes tipadas
- **Vite SSR:** SSR built-in, file-based routing

---

## 2. Níveis de Utilizadores e Permissões

### 2.1 Hierarquia de Utilizadores

```typescript
// src/types/user.ts
export enum UserRole {
  VISITOR = 'visitor',       // Nível 0
  FREE = 'free',            // Nível 1
  PREMIUM = 'premium',      // Nível 2
  CREATOR = 'creator',      // Nível 3
  ADMIN = 'admin'           // Nível 4 (super)
}

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  subscription?: {
    plan: 'free' | 'premium'
    status: 'active' | 'cancelled' | 'expired'
    expiresAt?: Date
  }
  profile: {
    firstName: string
    lastName: string
    avatar?: string
    bio?: string
  }
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}
```

### 2.2 Matriz de Permissões

| Feature | Visitor | Free | Premium | Creator | Admin |
|---------|---------|------|---------|---------|-------|
| **HUB - Conteúdo Público** |
| Ver artigos públicos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver primeiros 3 artigos/mês | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ver todos artigos free | ❌ | ✅ | ✅ | ✅ | ✅ |
| Ver artigos premium | ❌ | ❌ | ✅ | ✅ | ✅ |
| Ver cursos (preview) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Aceder cursos completos | ❌ | Pagos | Todos | ✅ | ✅ |
| Ver perfis de creators | ✅ | ✅ | ✅ | ✅ | ✅ |
| **HUB - Interação** |
| Comentar | ❌ | ✅ | ✅ | ✅ | ✅ |
| Avaliar (rating) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Seguir creators | ❌ | ✅ | ✅ | ✅ | ✅ |
| Guardar favoritos | ❌ | ✅ | ✅ | ✅ | ✅ |
| **FERRAMENTAS** |
| Calculadoras básicas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Guardar cálculos | ❌ | ✅ | ✅ | ✅ | ✅ |
| Exportar resultados | ❌ | ❌ | ✅ | ✅ | ✅ |
| Portfolio tracker | ❌ | ❌ | ✅ | ✅ | ✅ |
| Análise avançada stocks | ❌ | Limitado | ✅ | ✅ | ✅ |
| Alertas personalizados | ❌ | ❌ | ✅ | ✅ | ✅ |
| **SOCIAL** |
| Ver conversas públicas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Participar em fóruns | ❌ | ✅ | ✅ | ✅ | ✅ |
| Chat privado | ❌ | ❌ | ✅ | ✅ | ✅ |
| Criar posts | ❌ | ✅ | ✅ | ✅ | ✅ |
| Partilhar conteúdos | ❌ | ✅ | ✅ | ✅ | ✅ |
| **CREATOR FEATURES** |
| Dashboard de creator | ❌ | ❌ | ❌ | ✅ | ✅ |
| Criar conteúdos | ❌ | ❌ | ❌ | ✅ | ✅ |
| Analytics | ❌ | ❌ | ❌ | ✅ | ✅ |
| Monetização | ❌ | ❌ | ❌ | ✅ | ✅ |
| Gamificação | ❌ | ❌ | ❌ | ✅ | ✅ |
| **ADMIN FEATURES** |
| Gestão de users | ❌ | ❌ | ❌ | ❌ | ✅ |
| Moderação | ❌ | ❌ | ❌ | ❌ | ✅ |
| Analytics global | ❌ | ❌ | ❌ | ❌ | ✅ |
| Configurações sistema | ❌ | ❌ | ❌ | ❌ | ✅ |
| **ADS** |
| Ver anúncios | ✅ | ✅ | ❌ | ❌ | ❌ |

### 2.3 Sistema de Paywall

```typescript
// src/lib/permissions/paywall.ts
export interface PaywallConfig {
  feature: string
  requiredRole: UserRole
  limit?: number // Para free users
  message: string
  upgradeUrl: string
}

// Exemplos
const PAYWALLS: PaywallConfig[] = [
  {
    feature: 'articles.read',
    requiredRole: UserRole.FREE,
    limit: 3, // 3 artigos/mês para visitors
    message: 'Cria uma conta gratuita para ler mais artigos',
    upgradeUrl: '/register'
  },
  {
    feature: 'tools.portfolio',
    requiredRole: UserRole.PREMIUM,
    message: 'Upgrade para Premium para aceder ao Portfolio Tracker',
    upgradeUrl: '/premium'
  },
  {
    feature: 'social.chat',
    requiredRole: UserRole.PREMIUM,
    message: 'Chat privado disponível apenas para Premium',
    upgradeUrl: '/premium'
  }
]
```

---

## 3. Arquitetura de 3 Componentes Principais

### 3.1 Componente HUB (Educação & Pop Cultura)

```
HUB/
├── 📚 Conteúdo Educacional
│   ├── Artigos (Admin + Creators)
│   ├── Cursos (Creators)
│   ├── Vídeos/Playlists (Creators)
│   ├── Podcasts (Creators)
│   ├── Lives/Webinars (Creators)
│   └── E-books/Guias (Admin + Creators)
│
├── 📖 Biblioteca de Recursos
│   ├── Glossário Financeiro
│   ├── Livros Recomendados
│   ├── Websites Úteis
│   ├── Brokers Comparação
│   └── Apps Recomendadas
│
├── 🎭 Pop Cultura Financeira
│   ├── Notícias Financeiras
│   ├── Trends e Memes
│   ├── Comunidade/Fóruns
│   └── Eventos & Parcerias
│
└── 👤 Creators Pages
    ├── Perfil Público
    ├── Portfolio de Conteúdos
    ├── Reviews & Ratings
    └── Seguir/Subscrever
```

**Features Principais:**
- Sistema de descoberta de conteúdo (recommendations)
- Search global
- Filtros por tópico, tipo, nível
- Sistema de ratings e reviews
- Bookmarks/Favoritos
- Progress tracking (cursos)
- Certificados (opcional)

### 3.2 Componente TOOLS (Ferramentas)

```
TOOLS/
├── 💰 Finanças Pessoais
│   ├── Calculadora de Orçamento
│   ├── Fundo de Emergência
│   ├── Controlo de Despesas
│   ├── Debt Snowball/Avalanche
│   ├── Poupança para Objetivos
│   └── Calculadora de Reforma
│
├── 📈 Investimentos
│   ├── Juros Compostos
│   ├── ETF Analyzer
│   ├── REITs Valuation
│   ├── Stocks Intrinsic Value
│   ├── Portfolio Optimizer
│   └── Asset Allocation
│
├── 🎯 Portfolio Management (Premium)
│   ├── Portfolio Tracker
│   ├── Performance Analytics
│   ├── Dividend Tracker
│   ├── Tax Calculator
│   ├── Rebalancing Tool
│   └── Alertas Personalizados
│
└── 📊 Market Analysis (Premium)
    ├── Stock Screener
    ├── Technical Analysis
    ├── Fundamental Analysis
    ├── Earnings Calendar
    └── Macro Dashboard
```

**Features Principais:**
- Guardar cálculos/templates
- Histórico de cálculos
- Exportar resultados (PDF, Excel)
- Comparar cenários
- Alertas e notificações
- Integração com portfolio real (APIs)
- Sync cross-device

### 3.3 Componente SOCIAL

```
SOCIAL/
├── 💬 Comunicação
│   ├── Fóruns por Tópico
│   ├── Chat Privado (Premium)
│   ├── Grupos Privados
│   └── Direct Messages
│
├── 📢 Feed Social
│   ├── Posts/Updates de Creators
│   ├── User Posts
│   ├── Partilhas de Conteúdos
│   └── Achievements/Milestones
│
├── 🤝 Interação
│   ├── Comentários
│   ├── Reações (like, love, etc.)
│   ├── Partilhas (social media)
│   ├── Menções (@username)
│   └── Hashtags (#investing)
│
└── 👥 Comunidade
    ├── Perfis de Utilizadores
    ├── Following/Followers
    ├── Leaderboards/Rankings
    └── Grupos de Interesse
```

**Features Principais:**
- Real-time updates (WebSocket)
- Notificações
- Moderação automática (AI)
- Report system
- Block/Mute users
- Privacy controls
- Search de users/posts

---

## 4. Estrutura de Pastas Escalável

### 4.1 Estrutura Proposta (Feature-Based + Layer Separation)

```
src/
├── app/                          # Application core
│   ├── layouts/                  # Layouts by role
│   │   ├── RootLayout.tsx       # Base layout (SEO, providers)
│   │   ├── PublicLayout.tsx     # For visitors/non-auth
│   │   ├── UserLayout.tsx       # Authenticated users
│   │   ├── CreatorLayout.tsx    # Creators
│   │   └── AdminLayout.tsx      # Admins
│   │
│   ├── providers/               # Global providers
│   │   ├── AppProviders.tsx     # All providers wrapper
│   │   ├── AuthProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ToastProvider.tsx
│   │
│   └── routes/                  # Route definitions
│       ├── public.ts
│       ├── user.ts
│       ├── creator.ts
│       └── admin.ts
│
├── features/                     # Feature modules (domain-driven)
│   ├── auth/                    # Authentication & Authorization
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── PasswordReset.tsx
│   │   │   └── SocialLogin.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── useRegister.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── store/
│   │   │   └── useAuthStore.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── utils/
│   │       ├── validation.ts
│   │       └── tokens.ts
│   │
│   ├── hub/                     # HUB Component
│   │   ├── articles/
│   │   │   ├── components/
│   │   │   │   ├── ArticleCard.tsx
│   │   │   │   ├── ArticleGrid.tsx
│   │   │   │   ├── ArticleDetail.tsx
│   │   │   │   ├── ArticleEditor.tsx
│   │   │   │   └── ArticleFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useArticles.ts
│   │   │   │   ├── useCreateArticle.ts
│   │   │   │   └── useArticlePaywall.ts
│   │   │   ├── api/
│   │   │   │   └── articlesApi.ts
│   │   │   ├── store/
│   │   │   │   └── useArticlesStore.ts
│   │   │   └── types/
│   │   │       └── article.types.ts
│   │   │
│   │   ├── courses/
│   │   ├── videos/
│   │   ├── podcasts/
│   │   ├── books/
│   │   ├── glossary/
│   │   ├── brokers/
│   │   ├── news/
│   │   ├── events/
│   │   └── creators/
│   │       ├── components/
│   │       │   ├── CreatorCard.tsx
│   │       │   ├── CreatorProfile.tsx
│   │       │   ├── CreatorGrid.tsx
│   │       │   └── FollowButton.tsx
│   │       ├── hooks/
│   │       │   ├── useCreators.ts
│   │       │   ├── useFollowCreator.ts
│   │       │   └── useCreatorStats.ts
│   │       └── pages/
│   │           ├── CreatorsListPage.tsx
│   │           └── CreatorProfilePage.tsx
│   │
│   ├── tools/                   # TOOLS Component
│   │   ├── personal-finance/
│   │   │   ├── emergency-fund/
│   │   │   │   ├── EmergencyFundCalculator.tsx
│   │   │   │   ├── useEmergencyFund.ts
│   │   │   │   └── emergencyFund.utils.ts
│   │   │   ├── budget/
│   │   │   ├── debt-snowball/
│   │   │   └── savings-goals/
│   │   │
│   │   ├── investments/
│   │   │   ├── compound-interest/
│   │   │   ├── etf-analyzer/
│   │   │   ├── reits-valuation/
│   │   │   └── stock-valuation/
│   │   │
│   │   ├── portfolio/           # Premium only
│   │   │   ├── tracker/
│   │   │   ├── performance/
│   │   │   ├── rebalancing/
│   │   │   └── dividends/
│   │   │
│   │   ├── market-analysis/     # Premium only
│   │   │   ├── stock-screener/
│   │   │   ├── technical-analysis/
│   │   │   └── earnings-calendar/
│   │   │
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── Calculator.tsx
│   │       │   ├── ResultsPanel.tsx
│   │       │   ├── SaveCalculation.tsx
│   │       │   └── ExportButton.tsx
│   │       └── hooks/
│   │           ├── useCalculation.ts
│   │           └── useSaveResult.ts
│   │
│   ├── social/                  # SOCIAL Component
│   │   ├── feed/
│   │   │   ├── components/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── CreatePost.tsx
│   │   │   │   └── FeedFilters.tsx
│   │   │   └── hooks/
│   │   │       ├── useFeed.ts
│   │   │       └── useCreatePost.ts
│   │   │
│   │   ├── forums/
│   │   │   ├── components/
│   │   │   │   ├── ForumList.tsx
│   │   │   │   ├── ThreadList.tsx
│   │   │   │   ├── ThreadDetail.tsx
│   │   │   │   └── Reply.tsx
│   │   │   └── hooks/
│   │   │       ├── useForums.ts
│   │   │       └── useCreateThread.ts
│   │   │
│   │   ├── chat/                # Premium only
│   │   │   ├── components/
│   │   │   │   ├── ChatList.tsx
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   └── MessageInput.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useChats.ts
│   │   │   │   └── useSendMessage.ts
│   │   │   └── realtime/
│   │   │       └── chatSocket.ts
│   │   │
│   │   ├── comments/
│   │   │   ├── components/
│   │   │   │   ├── CommentSection.tsx
│   │   │   │   ├── Comment.tsx
│   │   │   │   └── CommentForm.tsx
│   │   │   └── hooks/
│   │   │       ├── useComments.ts
│   │   │       └── useAddComment.ts
│   │   │
│   │   └── notifications/
│   │       ├── components/
│   │       │   ├── NotificationBell.tsx
│   │       │   ├── NotificationList.tsx
│   │       │   └── NotificationItem.tsx
│   │       ├── hooks/
│   │       │   ├── useNotifications.ts
│   │       │   └── useMarkAsRead.ts
│   │       └── store/
│   │           └── useNotificationsStore.ts
│   │
│   ├── ratings/                 # Cross-feature: Ratings system
│   │   ├── components/
│   │   │   ├── RatingStars.tsx
│   │   │   ├── RatingForm.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   └── ReviewList.tsx
│   │   ├── hooks/
│   │   │   ├── useRatings.ts
│   │   │   ├── useCreateRating.ts
│   │   │   └── useLikeReview.ts
│   │   └── api/
│   │       └── ratingsApi.ts
│   │
│   ├── dashboard/              # Dashboards by role
│   │   ├── user/
│   │   │   ├── components/
│   │   │   │   ├── FavoritesCard.tsx
│   │   │   │   ├── ActivityCard.tsx
│   │   │   │   └── StatsCard.tsx
│   │   │   └── pages/
│   │   │       └── UserDashboard.tsx
│   │   │
│   │   ├── creator/
│   │   │   ├── analytics/
│   │   │   ├── content-management/
│   │   │   ├── gamification/
│   │   │   ├── marketing/
│   │   │   └── pages/
│   │   │       └── CreatorDashboard.tsx
│   │   │
│   │   └── admin/
│   │       ├── users/
│   │       ├── content/
│   │       ├── moderation/
│   │       ├── analytics/
│   │       └── pages/
│   │           └── AdminDashboard.tsx
│   │
│   └── settings/               # User settings
│       ├── profile/
│       ├── account/
│       ├── preferences/
│       ├── privacy/
│       └── billing/
│
├── shared/                     # Shared across features
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # shadcn/ui style components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   │
│   │   ├── feedback/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── data-display/
│   │   │   ├── Table.tsx
│   │   │   ├── Chart.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   └── form/
│   │       ├── FormField.tsx
│   │       ├── FormError.tsx
│   │       ├── DatePicker.tsx
│   │       └── FileUpload.tsx
│   │
│   ├── hooks/                  # Reusable hooks
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useClickOutside.ts
│   │   └── useCopyToClipboard.ts
│   │
│   └── utils/                  # Utility functions
│       ├── cn.ts              # Tailwind merge
│       ├── format.ts          # Date, number, currency
│       ├── validation.ts      # Common validators
│       └── constants.ts       # App constants
│
├── lib/                        # Core libraries & configs
│   ├── api/                   # API client layer
│   │   ├── client.ts          # Axios instance
│   │   ├── config.ts          # API configuration
│   │   ├── interceptors.ts    # Request/Response interceptors
│   │   └── endpoints.ts       # All endpoints typed
│   │
│   ├── permissions/           # Permission system
│   │   ├── guards.tsx         # Route guards
│   │   ├── hooks.ts           # usePermissions, usePaywall
│   │   ├── config.ts          # Permissions matrix
│   │   └── utils.ts           # Helper functions
│   │
│   ├── analytics/             # Analytics integration
│   │   ├── posthog.ts
│   │   └── events.ts
│   │
│   ├── validation/            # Zod schemas
│   │   ├── auth.schemas.ts
│   │   ├── article.schemas.ts
│   │   └── user.schemas.ts
│   │
│   └── query/                 # TanStack Query config
│       ├── client.ts
│       ├── keys.ts           # Query keys factory
│       └── defaults.ts       # Default options
│
├── stores/                     # Zustand stores
│   ├── useAuthStore.ts        # Auth state
│   ├── useUserStore.ts        # User data
│   ├── useNotificationsStore.ts
│   ├── useUIStore.ts          # UI state (sidebar, modals)
│   └── usePreferencesStore.ts # User preferences
│
├── types/                      # TypeScript types
│   ├── models/                # Data models
│   │   ├── user.ts
│   │   ├── article.ts
│   │   ├── course.ts
│   │   ├── rating.ts
│   │   └── ...
│   │
│   ├── api/                   # API types
│   │   ├── requests.ts
│   │   └── responses.ts
│   │
│   └── common/                # Common types
│       ├── pagination.ts
│       ├── filters.ts
│       └── enums.ts
│
├── pages/                      # Route pages (vite-ssr)
│   ├── index.page.tsx         # Homepage
│   ├── hub/
│   │   ├── articles/
│   │   │   ├── index.page.tsx
│   │   │   └── [slug].page.tsx
│   │   ├── courses/
│   │   ├── creators/
│   │   │   ├── index.page.tsx
│   │   │   └── [username].page.tsx
│   │   └── ...
│   │
│   ├── tools/
│   │   ├── index.page.tsx
│   │   ├── emergency-fund.page.tsx
│   │   ├── compound-interest.page.tsx
│   │   └── ...
│   │
│   ├── social/
│   │   ├── feed.page.tsx
│   │   ├── forums/
│   │   └── chat.page.tsx
│   │
│   ├── dashboard/
│   │   ├── user.page.tsx
│   │   ├── creator.page.tsx
│   │   └── admin.page.tsx
│   │
│   ├── auth/
│   │   ├── login.page.tsx
│   │   ├── register.page.tsx
│   │   └── reset-password.page.tsx
│   │
│   ├── premium.page.tsx       # Premium upgrade
│   ├── about.page.tsx
│   └── _404.page.tsx
│
├── styles/                     # Global styles
│   ├── globals.css            # Tailwind + base styles
│   ├── themes/                # Theme variables
│   │   ├── light.css
│   │   └── dark.css
│   └── animations.css
│
├── assets/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── config/                     # App configuration
    ├── env.ts                 # Environment variables
    ├── routes.ts              # Route definitions
    └── features.ts            # Feature flags
```

---

## 5. Design System e UI Components

### 5.1 Filosofia do Design System

```
Princípios:
├── Consistência → Componentes previsíveis
├── Acessibilidade → WCAG 2.1 AA compliance
├── Flexibilidade → Customizável mas opinionated
├── Performance → Lazy load, code split
└── Developer Experience → Fácil de usar e documentar
```

### 5.2 Component Variants Pattern (CVA)

```typescript
// shared/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 5.3 Design Tokens (Tailwind Config)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Semantic colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '...',
          100: '...',
          // ... 900
        },
        secondary: {...},
        accent: {...},
        destructive: {...},

        // Financial specific
        profit: {
          DEFAULT: 'hsl(142, 71%, 45%)', // Green
          light: 'hsl(142, 71%, 85%)',
        },
        loss: {
          DEFAULT: 'hsl(0, 84%, 60%)',   // Red
          light: 'hsl(0, 84%, 90%)',
        },
      },

      spacing: {
        // Consistent spacing scale
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },

      fontSize: {
        // Typography scale
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        // ...
      },

      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
```

### 5.4 Componentes UI Core (shadcn/ui style)

**Lista Completa de Componentes a Criar:**

```typescript
// Base Components
Button            // Botão com variantes
Card              // Container de conteúdo
Input             // Input de texto
Textarea          // Textarea
Select            // Dropdown select
Checkbox          // Checkbox
RadioGroup        // Radio buttons
Switch            // Toggle switch
Slider            // Range slider
Label             // Form label

// Data Display
Table             // Tabela de dados
Badge             // Badge/Tag
Avatar            // Avatar de utilizador
Tooltip           // Tooltip
Popover           // Popover
Dialog/Modal      // Modal dialog
Sheet             // Side sheet
Tabs              // Tabs
Accordion         // Accordion
Separator         // Divider

// Feedback
Alert             // Alert messages
Toast             // Toast notifications
Progress          // Progress bar
Skeleton          // Loading skeleton
LoadingSpinner    // Spinner

// Navigation
Breadcrumbs       // Breadcrumb navigation
Pagination        // Pagination
NavigationMenu    // Nav menu
Sidebar           // Sidebar

// Financial Specific
PriceDisplay      // Formatação de preços
PercentageChange  // Variação percentual
Chart             // Wrapper para recharts
StockTicker       // Ticker component
```

---

## 6. State Management Strategy

### 6.1 Separação de Responsabilidades

```
CLIENT STATE (Zustand)          SERVER STATE (TanStack Query)
├── UI state                    ├── API data
├── User preferences            ├── Cache management
├── Auth tokens                 ├── Mutations
├── Modal/Sidebar state         ├── Optimistic updates
└── Temporary form data         └── Background refetch

URL STATE (React Router)        LOCAL STORAGE (Zustand Persist)
├── Search params               ├── Theme preference
├── Filters                     ├── Auth tokens
├── Pagination                  ├── User settings
└── Sort order                  └── Recent searches
```

### 6.2 Zustand Stores Pattern

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Actions
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void

  // Computed
  hasRole: (role: UserRole) => boolean
  isPremium: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      hasRole: (role) => get().user?.role === role,
      isPremium: () => get().user?.subscription?.plan === 'premium',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
)
```

### 6.3 TanStack Query Pattern

```typescript
// features/hub/articles/hooks/useArticles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { articlesApi } from '../api/articlesApi'

// Query Keys Factory
export const articlesKeys = {
  all: ['articles'] as const,
  lists: () => [...articlesKeys.all, 'list'] as const,
  list: (filters: ArticleFilters) => [...articlesKeys.lists(), filters] as const,
  details: () => [...articlesKeys.all, 'detail'] as const,
  detail: (id: string) => [...articlesKeys.details(), id] as const,
}

// Hooks
export function useArticles(filters: ArticleFilters) {
  return useQuery({
    queryKey: articlesKeys.list(filters),
    queryFn: () => articlesApi.getArticles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: articlesKeys.detail(id),
    queryFn: () => articlesApi.getArticle(id),
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: articlesApi.createArticle,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: articlesKeys.lists() })
    },
  })
}
```

---

## 7. Routing e Navegação

### 7.1 Estrutura de Rotas

```typescript
// config/routes.ts
export const routes = {
  // Public
  home: '/',
  about: '/about',
  premium: '/premium',

  // Auth
  login: '/auth/login',
  register: '/auth/register',
  resetPassword: '/auth/reset-password',

  // HUB
  hub: {
    articles: '/hub/articles',
    article: (slug: string) => `/hub/articles/${slug}`,
    courses: '/hub/courses',
    course: (id: string) => `/hub/courses/${id}`,
    creators: '/hub/creators',
    creator: (username: string) => `/hub/creators/${username}`,
    news: '/hub/news',
    events: '/hub/events',
    books: '/hub/books',
    glossary: '/hub/glossary',
    brokers: '/hub/brokers',
  },

  // TOOLS
  tools: {
    index: '/tools',
    emergencyFund: '/tools/emergency-fund',
    compoundInterest: '/tools/compound-interest',
    etfAnalyzer: '/tools/etf-analyzer',
    portfolio: '/tools/portfolio', // Premium
    stockScreener: '/tools/stock-screener', // Premium
  },

  // SOCIAL
  social: {
    feed: '/social/feed',
    forums: '/social/forums',
    forum: (id: string) => `/social/forums/${id}`,
    chat: '/social/chat', // Premium
    profile: (username: string) => `/social/users/${username}`,
  },

  // DASHBOARD
  dashboard: {
    user: '/dashboard/user',
    creator: '/dashboard/creator',
    admin: '/dashboard/admin',
  },

  // SETTINGS
  settings: {
    profile: '/settings/profile',
    account: '/settings/account',
    preferences: '/settings/preferences',
    billing: '/settings/billing',
  },
} as const
```

### 7.2 Route Guards

```typescript
// lib/permissions/guards.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { UserRole } from '@/types/user'

export function RequireAuth({ children }: { children?: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export function RequireRole({
  allowedRoles,
  children
}: {
  allowedRoles: UserRole[]
  children?: React.ReactNode
}) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export function RequirePremium({ children }: { children?: React.ReactNode }) {
  const isPremium = useAuthStore((s) => s.isPremium())

  if (!isPremium) {
    return <Navigate to="/premium" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
```

---

## 8. Sistema de Permissões e Guards

### 8.1 Permission Hooks

```typescript
// lib/permissions/hooks.ts
import { useAuthStore } from '@/stores/useAuthStore'
import { UserRole } from '@/types/user'

export function usePermissions() {
  const user = useAuthStore((s) => s.user)

  return {
    canAccess: (feature: string) => {
      // Implementation based on permissions matrix
      return checkPermission(user?.role, feature)
    },

    hasRole: (role: UserRole) => user?.role === role,

    isPremium: () => user?.subscription?.plan === 'premium',

    isCreator: () => user?.role === UserRole.CREATOR || user?.role === UserRole.ADMIN,

    isAdmin: () => user?.role === UserRole.ADMIN,
  }
}

export function usePaywall(feature: string) {
  const user = useAuthStore((s) => s.user)
  const paywallConfig = getPaywallConfig(feature)

  const canAccess = checkPermission(user?.role, feature)
  const limit = paywallConfig?.limit

  return {
    canAccess,
    isLimited: !!limit,
    limit,
    message: paywallConfig?.message,
    upgradeUrl: paywallConfig?.upgradeUrl,
    showPaywall: !canAccess,
  }
}
```

### 8.2 Paywall Component

```typescript
// shared/components/Paywall.tsx
import { Button } from '@/shared/components/ui/Button'
import { usePaywall } from '@/lib/permissions/hooks'

interface PaywallProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Paywall({ feature, children, fallback }: PaywallProps) {
  const paywall = usePaywall(feature)

  if (paywall.canAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <LockIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">Conteúdo Premium</h3>
      <p className="text-muted-foreground mb-6">{paywall.message}</p>
      <Button asChild>
        <a href={paywall.upgradeUrl}>
          Fazer Upgrade
        </a>
      </Button>
    </div>
  )
}

// Usage
<Paywall feature="tools.portfolio">
  <PortfolioTracker />
</Paywall>
```

---

## 9. API Layer e Data Fetching

### 9.1 API Client Configuration

```typescript
// lib/api/client.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
```

### 9.2 API Modules Structure

```typescript
// lib/api/endpoints.ts
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  articles: {
    list: '/articles',
    detail: (id: string) => `/articles/${id}`,
    create: '/articles',
    update: (id: string) => `/articles/${id}`,
    delete: (id: string) => `/articles/${id}`,
  },
  // ... outros endpoints
} as const

// features/hub/articles/api/articlesApi.ts
import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { Article, ArticleFilters } from '../types/article.types'

export const articlesApi = {
  getArticles: async (filters: ArticleFilters) => {
    return apiClient.get<Article[]>(API_ENDPOINTS.articles.list, {
      params: filters,
    })
  },

  getArticle: async (id: string) => {
    return apiClient.get<Article>(API_ENDPOINTS.articles.detail(id))
  },

  createArticle: async (data: Partial<Article>) => {
    return apiClient.post<Article>(API_ENDPOINTS.articles.create, data)
  },

  updateArticle: async (id: string, data: Partial<Article>) => {
    return apiClient.patch<Article>(API_ENDPOINTS.articles.update(id), data)
  },

  deleteArticle: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.articles.delete(id))
  },
}
```

---

## 10. Plano de Implementação Modular

### 10.1 Fases de Desenvolvimento

```
FASE 0: FUNDAÇÃO (2 semanas)
├── Setup do projeto
├── Design System base
├── Auth & Permissions system
└── Layouts & Navigation

FASE 1: HUB - CORE (6 semanas)
├── Articles system
├── Creators profiles
├── Ratings & Reviews
├── News feed
└── Bookmarks/Favorites

FASE 2: TOOLS - ESSENCIAIS (4 semanas)
├── 5 Calculadoras básicas
├── Save/Export functionality
└── Tools dashboard

FASE 3: SOCIAL - BÁSICO (4 semanas)
├── Comments system
├── Forums
├── User profiles
└── Feed

FASE 4: HUB - AVANÇADO (4 semanas)
├── Courses system
├── Videos/Playlists
├── Books library
├── Glossary
└── Events

FASE 5: TOOLS - PREMIUM (3 semanas)
├── Portfolio Tracker
├── Stock Analysis
└── Alertas

FASE 6: SOCIAL - PREMIUM (3 semanas)
├── Chat system (WebSocket)
├── Groups
└── Advanced profiles

FASE 7: DASHBOARDS (4 semanas)
├── User Dashboard
├── Creator Dashboard
├── Admin Dashboard
└── Analytics

FASE 8: POLIMENTO (3 semanas)
├── Performance optimization
├── Accessibility audit
├── SEO
├── Testing
└── Documentation
```

### 10.2 FASE 0: FUNDAÇÃO (Detalhado)

#### Semana 1: Setup & Design System

**Dia 1-2: Project Setup**
```bash
# Setup inicial
- Configurar Vite + TypeScript
- Instalar dependências core
- Configurar ESLint + Prettier
- Setup Husky + lint-staged
- Configurar Tailwind CSS
```

**Dia 3-5: Design System Base**
```bash
# UI Components (shadcn/ui style)
- Button (com CVA variants)
- Card
- Input, Textarea
- Select, Checkbox, Switch
- Dialog, Sheet
- Toast setup
- Loading states (Spinner, Skeleton)
```

**Deliverables:**
- [ ] Projeto configurado e rodando
- [ ] 10+ componentes UI base
- [ ] Storybook configurado
- [ ] Tema claro/escuro funcionando

#### Semana 2: Auth & Foundation

**Dia 1-3: Authentication System**
```bash
# Auth
- Login/Register forms
- Password reset
- Zustand auth store
- API client setup
- Token management
- Protected routes
```

**Dia 4-5: Permissions & Layouts**
```bash
# Permissions
- Permission hooks
- Paywall component
- Role-based guards

# Layouts
- RootLayout (providers)
- PublicLayout
- UserLayout
- CreatorLayout
- AdminLayout
```

**Deliverables:**
- [ ] Sistema de auth completo
- [ ] 5 layouts funcionais
- [ ] Sistema de permissões base
- [ ] Navegação principal

---

### 10.3 FASE 1: HUB - CORE (Detalhado)

#### Módulo 1.1: Articles System (2 semanas)

**Semana 1: Public Articles**
```typescript
// Components a criar
ArticleCard          // Card de artigo
ArticleGrid          // Grid responsivo
ArticleFilters       // Filtros (tópico, autor, etc.)
ArticleSkeleton      // Loading state
EmptyArticles        // Empty state

// Hooks
useArticles(filters) // List com paginação
useArticle(id)       // Detail
useArticlePaywall(id) // Paywall logic

// Pages
/hub/articles        // Lista
/hub/articles/[slug] // Detalhe
```

**Semana 2: Article Creation & Management**
```typescript
// Components
ArticleEditor        // TipTap editor
ImageUpload          // Upload de imagens
PublishDialog        // Confirmar publicação
DeleteDialog         // Confirmar delete

// Hooks (Creators)
useCreateArticle()
useUpdateArticle(id)
useDeleteArticle(id)
useArticleStats(id)  // Views, likes, etc.
```

**Features:**
- [x] Listagem com filtros e paginação
- [x] Detalhe de artigo
- [x] Editor TipTap (creators)
- [x] Upload de imagens
- [x] Paywall (visitors vs free vs premium)
- [x] Bookmarks
- [x] Share buttons
- [x] Read time estimate
- [x] Related articles

#### Módulo 1.2: Ratings & Reviews (1 semana)

```typescript
// Components
RatingStars          // Display de stars
RatingForm           // Form para avaliar
ReviewCard           // Card de review
ReviewList           // Lista de reviews
LikeDislikeButton    // Botões de like/dislike

// Hooks
useRatings(targetType, targetId)
useCreateRating(targetType, targetId)
useUpdateRating(ratingId)
useLikeReview(reviewId)

// Types
type RateableType = 'article' | 'course' | 'creator' | 'book'

interface Rating {
  id: string
  userId: string
  targetType: RateableType
  targetId: string
  rating: 1 | 2 | 3 | 4 | 5
  review?: string
  likes: string[]      // User IDs
  dislikes: string[]   // User IDs
  createdAt: Date
}
```

**Integration Points:**
- Articles detail page
- Courses detail page
- Creator profile page
- Books page

#### Módulo 1.3: Creators Profiles (2 semanas)

**Semana 1: Public Profile**
```typescript
// Components
CreatorCard          // Card compacto
CreatorGrid          // Grid de creators
CreatorProfile       // Perfil completo
CreatorStats         // Estatísticas
CreatorContent       // Conteúdos do creator
FollowButton         // Botão follow/unfollow

// Pages
/hub/creators        // Lista
/hub/creators/[username] // Perfil

// Hooks
useCreators(filters)
useCreator(username)
useFollowCreator(creatorId)
useCreatorStats(creatorId)
```

**Semana 2: Creator Content Display**
```typescript
// Tabs no perfil
Articles Tab         // Artigos do creator
Courses Tab          // Cursos do creator
Videos Tab           // Vídeos/Playlists
About Tab            // Bio e links

// Features
- Filter por tipo de conteúdo
- Sort por data, popularidade
- Ratings overview
- Social links
- Follow count
```

#### Módulo 1.4: News Feed (1 semana)

```typescript
// Já existe! Apenas integrar e melhorar
- Usar useNewsStore existente
- Melhorar UI/UX
- Adicionar categorias
- Adicionar bookmarks
```

**Deliverables Fase 1:**
- [ ] Sistema de artigos completo (CRUD)
- [ ] Sistema de ratings universal
- [ ] Perfis de creators públicos
- [ ] News feed integrado
- [ ] Bookmarks/Favorites funcionando
- [ ] 100% TypeScript
- [ ] Testes unitários core

---

### 10.4 FASE 2: TOOLS - ESSENCIAIS (Detalhado)

#### Módulo 2.1: Calculadoras Base (3 semanas)

**Estrutura Comum para Todas:**
```typescript
// Shared calculator components
CalculatorLayout     // Layout padrão
ResultsPanel         // Painel de resultados
SaveButton           // Guardar cálculo
ExportButton         // Exportar PDF/Excel
CalculationHistory   // Histórico (premium)

// Shared hooks
useCalculation()     // State do cálculo
useSaveCalculation() // Guardar no backend
useCalculationHistory() // Histórico
```

**Semana 1: Fundo de Emergência + Debt Snowball**
```typescript
// Emergency Fund
components/
  EmergencyFundForm.tsx
  ExpensesInput.tsx
  ResultsDisplay.tsx

hooks/
  useEmergencyFund.ts

utils/
  calculations.ts // Lógica de cálculo pura

// Debt Snowball
components/
  DebtSnowballForm.tsx
  DebtInput.tsx
  DebtList.tsx
  PaymentStrategy.tsx

hooks/
  useDebtSnowball.ts
```

**Semana 2: Juros Compostos + ETF Analyzer**
```typescript
// Compound Interest
- Input: inicial, mensal, taxa, anos
- Output: Gráfico de crescimento, total final
- Chart.js para visualização

// ETF Analyzer
- Input: Ticker do ETF
- Fetch: Yahoo Finance API
- Output: Métricas, performance, holdings
```

**Semana 3: REITs Valuation + Tools Dashboard**
```typescript
// REITs Valuation
- Cálculo de valor intrínseco
- Dividend yield analysis
- Comparação com peers

// Tools Dashboard
/tools → Overview de todas as ferramentas
- Quick access cards
- Recent calculations (se logged in)
- Saved calculations (premium)
```

**Features Comuns:**
- [x] Cálculos client-side (performance)
- [x] Guardar cálculos (backend, logged in)
- [x] Histórico (premium)
- [x] Export PDF (premium)
- [x] Export Excel (premium)
- [x] Partilhar cálculo (link único)

---

### 10.5 FASE 3: SOCIAL - BÁSICO (Detalhado)

#### Módulo 3.1: Comments System (1 semana)

```typescript
// Universal comment system para qualquer conteúdo
components/
  CommentSection.tsx   // Container
  Comment.tsx          // Item individual
  CommentForm.tsx      // Form para comentar
  ReplyForm.tsx        // Form para reply
  CommentActions.tsx   // Like, reply, report, delete

hooks/
  useComments(targetType, targetId)
  useAddComment(targetType, targetId)
  useReplyComment(commentId)
  useLikeComment(commentId)
  useDeleteComment(commentId)

types/
  interface Comment {
    id: string
    userId: string
    targetType: 'article' | 'course' | 'book' | 'post'
    targetId: string
    content: string
    parentId?: string  // For replies
    likes: string[]
    replies?: Comment[]
    createdAt: Date
  }
```

**Integration:**
- Articles
- Courses
- Books
- Social posts

#### Módulo 3.2: Forums (2 semanas)

**Semana 1: Forum Structure**
```typescript
// Components
ForumCategoryList.tsx  // Categorias (ETFs, Stocks, etc.)
ThreadList.tsx         // Lista de threads
ThreadCard.tsx         // Card de thread
CreateThreadButton.tsx

// Pages
/social/forums
/social/forums/[category]
/social/forums/[category]/[threadId]

// Hooks
useForumCategories()
useThreads(categoryId)
useCreateThread()
```

**Semana 2: Thread Detail & Interaction**
```typescript
// Components
ThreadDetail.tsx       // Thread completo
ThreadPosts.tsx        // Posts do thread
PostEditor.tsx         // Editor de post
ThreadActions.tsx      // Pin, lock, delete (mods)

// Features
- Upvote/Downvote posts
- Mark as solution (OP only)
- Follow thread (notifications)
- Report inappropriate
- Moderação básica
```

#### Módulo 3.3: User Profiles & Feed (1 semana)

```typescript
// User Profile (diferente de Creator)
/social/users/[username]

Components:
  UserProfile.tsx
  UserActivity.tsx    // Recent posts, comments
  UserStats.tsx       // Contributions
  FollowButton.tsx

// Social Feed
/social/feed

Components:
  FeedPost.tsx        // Post card
  CreatePost.tsx      // Criar post
  FeedFilters.tsx     // Following, Popular, Recent

Hooks:
  useFeed(filters)
  useCreatePost()
  useUserProfile(username)
```

---

## 11. Boas Práticas e Padrões

### 11.1 Code Style Guidelines

```typescript
// ✅ BOAS PRÁTICAS

// 1. Componentes sempre PascalCase
export function ArticleCard({ article }: ArticleCardProps) {
  // ...
}

// 2. Hooks sempre useCamelCase
export function useArticles(filters: ArticleFilters) {
  // ...
}

// 3. Types/Interfaces sempre PascalCase
export interface Article {
  id: string
  title: string
  // ...
}

// 4. Constants sempre UPPER_SNAKE_CASE
export const MAX_ARTICLES_PER_PAGE = 20

// 5. File naming
// Components: PascalCase.tsx
// Hooks: useCamelCase.ts
// Utils: camelCase.ts
// Types: camelCase.types.ts

// 6. Exports
// Prefer named exports
export { ArticleCard } from './ArticleCard'
// Use barrel exports (index.ts) em cada feature
export * from './components'
export * from './hooks'

// 7. Props destructuring
function Component({
  title,
  description,
  onSubmit,
  ...rest
}: ComponentProps) {
  // ...
}

// 8. Early returns
function Component({ data }: Props) {
  if (!data) return <EmptyState />
  if (error) return <ErrorState />

  return <SuccessState data={data} />
}

// 9. Conditional rendering
{isLoading && <LoadingSkeleton />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// 10. Event handlers
const handleClick = () => { /* ... */ }
const handleSubmit = (e: FormEvent) => { /* ... */ }
```

### 11.2 Performance Best Practices

```typescript
// 1. Lazy loading de pages
const ArticlePage = lazy(() => import('./ArticlePage'))

// 2. Code splitting por feature
const CreatorDashboard = lazy(() =>
  import('@/features/dashboard/creator')
)

// 3. Memoization quando necessário
const ExpensiveComponent = memo(({ data }) => {
  // ...
})

const memoizedValue = useMemo(() =>
  computeExpensiveValue(a, b),
  [a, b]
)

const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])

// 4. Virtualization para listas longas
import { useVirtualizer } from '@tanstack/react-virtual'

// 5. Image optimization
import { Image } from '@/shared/components/Image'
<Image
  src={url}
  alt={alt}
  loading="lazy"
  width={400}
  height={300}
/>

// 6. Debounce em inputs de search
const debouncedSearch = useDebounce(searchTerm, 500)
```

### 11.3 Accessibility Guidelines

```typescript
// 1. Semantic HTML
<article>
  <header>
    <h1>{title}</h1>
  </header>
  <main>{content}</main>
  <footer>{metadata}</footer>
</article>

// 2. ARIA labels quando necessário
<button aria-label="Fechar modal">
  <XIcon />
</button>

// 3. Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Click me
</div>

// 4. Focus management
const modalRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus()
  }
}, [isOpen])

// 5. Color contrast
// Usar Tailwind colors que passam WCAG AA
// Testar com ferramentas como Lighthouse
```

### 11.4 Error Handling

```typescript
// 1. Error Boundaries
export class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}

// 2. Try-catch em async operations
try {
  const data = await fetchData()
  setData(data)
} catch (error) {
  handleError(error)
  toast.error('Erro ao carregar dados')
}

// 3. TanStack Query error handling
const { data, error, isError } = useQuery({
  queryKey: ['articles'],
  queryFn: fetchArticles,
  retry: 3,
  onError: (error) => {
    toast.error(error.message)
  }
})

if (isError) {
  return <ErrorState error={error} />
}
```

---

## 12. Roadmap Detalhado

### 12.1 Timeline Completo (33 semanas ~ 8 meses)

```
MÊS 1-2 (8 semanas)
├── Semana 1-2: FASE 0 - Fundação
├── Semana 3-8: FASE 1 - HUB Core
│   ├── Semana 3-4: Articles
│   ├── Semana 5: Ratings
│   ├── Semana 6-7: Creators
│   └── Semana 8: News

MÊS 3 (4 semanas)
└── Semana 9-12: FASE 2 - Tools Essenciais
    ├── Semana 9-10: 3 Calculadoras
    ├── Semana 11: 2 Calculadoras
    └── Semana 12: Tools Dashboard

MÊS 4 (4 semanas)
└── Semana 13-16: FASE 3 - Social Básico
    ├── Semana 13: Comments
    ├── Semana 14-15: Forums
    └── Semana 16: Profiles & Feed

MÊS 5 (4 semanas)
└── Semana 17-20: FASE 4 - HUB Avançado
    ├── Semana 17-18: Courses
    ├── Semana 19: Videos/Books/Glossary
    └── Semana 20: Events

MÊS 6 (3 semanas)
└── Semana 21-23: FASE 5 - Tools Premium
    ├── Semana 21-22: Portfolio Tracker
    └── Semana 23: Stock Analysis

MÊS 7 (3 semanas)
└── Semana 24-26: FASE 6 - Social Premium
    ├── Semana 24-25: Chat (WebSocket)
    └── Semana 26: Groups

MÊS 8 (7 semanas)
├── Semana 27-30: FASE 7 - Dashboards
│   ├── Semana 27: User Dashboard
│   ├── Semana 28-29: Creator Dashboard
│   └── Semana 30: Admin Dashboard
│
└── Semana 31-33: FASE 8 - Polimento
    ├── Semana 31: Performance & A11y
    ├── Semana 32: Testing & Bug fixes
    └── Semana 33: Documentation & Deploy prep
```

### 12.2 Milestones & Deliverables

#### Milestone 1: MVP (Mês 2)
**Features:**
- ✅ Auth completo
- ✅ Articles CRUD
- ✅ Ratings system
- ✅ Creator profiles
- ✅ News feed
- ✅ 3 Calculadoras básicas

**Status:** Pronto para alpha testing

#### Milestone 2: Beta (Mês 4)
**Features:**
- ✅ Todas as ferramentas financeiras
- ✅ Social básico (comments, forums, feed)
- ✅ Courses system
- ✅ Books library

**Status:** Pronto para beta users

#### Milestone 3: Premium Features (Mês 6)
**Features:**
- ✅ Portfolio Tracker
- ✅ Advanced stock analysis
- ✅ Chat system
- ✅ Premium paywalls ativos

**Status:** Monetização ativa

#### Milestone 4: Production Ready (Mês 8)
**Features:**
- ✅ Todos os dashboards
- ✅ Performance otimizada
- ✅ Tests completos (>80% coverage)
- ✅ SEO otimizado
- ✅ A11y compliant

**Status:** Ready for launch 🚀

---

## 📊 Métricas de Sucesso

### Desenvolvimento
- [ ] 100% TypeScript
- [ ] >80% test coverage
- [ ] Lighthouse score >90
- [ ] Zero critical bugs
- [ ] <3s initial load time

### Features
- [ ] 5 tipos de utilizadores funcionais
- [ ] 3 componentes principais (HUB, TOOLS, SOCIAL)
- [ ] 100+ componentes UI reutilizáveis
- [ ] 50+ páginas

### Code Quality
- [ ] 0 ESLint errors
- [ ] 0 TypeScript errors
- [ ] WCAG AA compliance
- [ ] Documentação completa (Storybook)

---

## 🎯 Próximos Passos Imediatos

1. **Revisar este plano** contigo
2. **Ajustar prioridades** conforme necessário
3. **Começar FASE 0** - Fundação
4. **Setup do repo** com toda a estrutura
5. **Primeira PR** - Design System base

---

**Versão:** 2.0
**Última Atualização:** 2026-02-13
**Status:** Aguardando aprovação para início 🚀
