# 🏗️ Implementação: Estrutura de Pastas e Rotas

**Data**: 2026-02-16
**Status**: 📝 **EM IMPLEMENTAÇÃO**
**Objetivo**: Criar foundation escalável e organizada para o FinHub

---

## 📁 Estrutura de Pastas Proposta

```
src/
├── features/                    # Feature-based architecture
│   ├── home/                   # Homepage
│   │   ├── components/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedContent.tsx
│   │   │   ├── TopCreators.tsx
│   │   │   ├── LatestContent.tsx
│   │   │   └── FeaturedBrands.tsx
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   │
│   ├── explore/                # Sistema de exploração
│   │   ├── components/
│   │   │   ├── ExploreFilters.tsx
│   │   │   ├── ExploreGrid.tsx
│   │   │   ├── ExploreSidebar.tsx
│   │   │   └── SortDropdown.tsx
│   │   ├── pages/
│   │   │   ├── ExplorePage.tsx          # /explorar/tudo
│   │   │   ├── ExploreArticlesPage.tsx  # /explorar/artigos
│   │   │   ├── ExploreVideosPage.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useExploreFilters.ts
│   │   │   └── useExploreData.ts
│   │   └── index.ts
│   │
│   ├── creators/               # Sistema de criadores
│   │   ├── components/
│   │   │   ├── CreatorCard.tsx
│   │   │   ├── CreatorHeader.tsx
│   │   │   ├── CreatorStats.tsx
│   │   │   ├── CreatorBio.tsx
│   │   │   ├── CreatorContent.tsx
│   │   │   └── CreatorReviews.tsx
│   │   ├── pages/
│   │   │   ├── CreatorsListPage.tsx     # /criadores
│   │   │   ├── CreatorProfilePage.tsx   # /criadores/:username
│   │   │   └── TopCreatorsPage.tsx      # /criadores/top
│   │   ├── hooks/
│   │   │   ├── useCreatorProfile.ts
│   │   │   └── useFollowCreator.ts
│   │   └── index.ts
│   │
│   ├── content/                # Sistema de conteúdo (artigos, vídeos, etc.)
│   │   ├── components/
│   │   │   ├── ContentCard.tsx
│   │   │   ├── ContentHeader.tsx
│   │   │   ├── ContentBody.tsx
│   │   │   ├── ContentSidebar.tsx
│   │   │   ├── ContentActions.tsx
│   │   │   └── RelatedContent.tsx
│   │   ├── pages/
│   │   │   ├── ArticleDetailPage.tsx    # /artigos/:slug
│   │   │   ├── VideoDetailPage.tsx      # /videos/:slug
│   │   │   ├── CourseDetailPage.tsx
│   │   │   ├── EventDetailPage.tsx
│   │   │   ├── PodcastDetailPage.tsx
│   │   │   └── BookDetailPage.tsx
│   │   ├── hooks/
│   │   │   ├── useContentDetail.ts
│   │   │   ├── useContentLike.ts
│   │   │   └── useContentFavorite.ts
│   │   └── index.ts
│   │
│   ├── brands/                 # Sistema de recursos (brands)
│   │   ├── components/
│   │   │   ├── BrandCard.tsx
│   │   │   ├── BrandHeader.tsx
│   │   │   ├── BrandOverview.tsx
│   │   │   ├── BrandReviews.tsx
│   │   │   └── BrandRelated.tsx
│   │   ├── pages/
│   │   │   ├── BrandsListPage.tsx       # /recursos
│   │   │   ├── BrandDetailPage.tsx      # /recursos/:slug
│   │   │   ├── BrandsBrokersPage.tsx    # /recursos/corretoras
│   │   │   ├── BrandsPlatformsPage.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── useBrandDetail.ts
│   │   └── index.ts
│   │
│   ├── learn/                  # Hub educativo
│   │   ├── components/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── GlossaryList.tsx
│   │   │   └── CourseCard.tsx
│   │   ├── pages/
│   │   │   ├── LearnHubPage.tsx         # /aprender
│   │   │   ├── NewsPage.tsx             # /aprender/noticias
│   │   │   ├── GlossaryPage.tsx         # /aprender/glossario
│   │   │   ├── FreeCoursesPage.tsx
│   │   │   └── GuidesPage.tsx
│   │   └── index.ts
│   │
│   ├── social/                 # Features sociais
│   │   ├── components/
│   │   │   ├── RatingComponent.tsx
│   │   │   ├── RatingBreakdown.tsx
│   │   │   ├── CommentThread.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   ├── CommentForm.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   ├── FavoriteButton.tsx
│   │   │   └── LikeButton.tsx
│   │   ├── hooks/
│   │   │   ├── useRating.ts
│   │   │   ├── useComments.ts
│   │   │   ├── useFollow.ts
│   │   │   └── useFavorite.ts
│   │   └── index.ts
│   │
│   ├── user/                   # Área de utilizador
│   │   ├── components/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserStats.tsx
│   │   │   ├── UserBadges.tsx
│   │   │   └── UserSettings.tsx
│   │   ├── pages/
│   │   │   ├── UserProfilePage.tsx      # /perfil/:username
│   │   │   ├── UserSettingsPage.tsx     # /conta
│   │   │   ├── FavoritesPage.tsx        # /meus-favoritos
│   │   │   ├── FollowingFeedPage.tsx    # /a-seguir
│   │   │   └── NotificationsPage.tsx    # /notificacoes
│   │   └── index.ts
│   │
│   ├── dashboard/              # Creator Dashboard
│   │   ├── components/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── DashboardCharts.tsx
│   │   │   ├── ContentTable.tsx
│   │   │   ├── ContentForm.tsx
│   │   │   └── AnalyticsPanel.tsx
│   │   ├── pages/
│   │   │   ├── DashboardOverviewPage.tsx    # /dashboard
│   │   │   ├── ContentManagementPage.tsx    # /dashboard/conteudo
│   │   │   ├── CreateContentPage.tsx        # /dashboard/criar
│   │   │   ├── AnalyticsPage.tsx            # /dashboard/analytics
│   │   │   ├── FollowersPage.tsx            # /dashboard/seguidores
│   │   │   └── ProfileEditPage.tsx          # /dashboard/perfil
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   └── index.ts
│   │
│   ├── admin/                  # Admin Panel
│   │   ├── components/
│   │   │   ├── AdminStats.tsx
│   │   │   ├── UserTable.tsx
│   │   │   ├── ContentTable.tsx
│   │   │   └── BrandForm.tsx
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.tsx       # /admin
│   │   │   ├── UsersManagementPage.tsx      # /admin/users
│   │   │   ├── ContentModerationPage.tsx    # /admin/conteudo
│   │   │   ├── BrandsManagementPage.tsx     # /admin/recursos
│   │   │   └── StatsPage.tsx                # /admin/stats
│   │   ├── layouts/
│   │   │   └── AdminLayout.tsx
│   │   └── index.ts
│   │
│   └── auth/                   # Autenticação
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   └── RoleSelector.tsx
│       ├── pages/
│       │   ├── LoginPage.tsx            # /login
│       │   └── RegisterPage.tsx         # /registar
│       ├── hooks/
│       │   └── useAuth.ts
│       └── index.ts
│
├── components/                 # Componentes compartilhados
│   ├── ui/                    # Componentes UI primitivos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   ├── Skeleton.tsx
│   │   └── ...
│   │
│   ├── layout/                # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Container.tsx
│   │
│   ├── common/                # Componentes comuns
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ...
│   │
│   └── seo/
│       └── SEOHead.tsx
│
├── layouts/                   # Layouts principais
│   ├── MainLayout.tsx         # Layout público
│   ├── AuthLayout.tsx         # Layout de login/register
│   └── MinimalLayout.tsx      # Layout sem header/footer
│
├── lib/                       # Bibliotecas e utilitários
│   ├── api/
│   │   ├── client.ts          # Axios/Fetch client
│   │   ├── endpoints.ts       # API endpoints
│   │   └── interceptors.ts
│   │
│   ├── hooks/                 # Hooks globais
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── utils/                 # Utilitários
│   │   ├── formatters.ts      # Formatar datas, números, etc.
│   │   ├── validators.ts      # Validações
│   │   ├── constants.ts       # Constantes
│   │   └── helpers.ts
│   │
│   └── types/                 # TypeScript types globais
│       ├── api.ts
│       ├── user.ts
│       ├── content.ts
│       └── ...
│
├── styles/                    # Estilos globais
│   ├── globals.css
│   ├── variables.css          # CSS variables
│   └── themes/
│       ├── light.css
│       └── dark.css
│
├── config/                    # Configurações
│   ├── site.ts               # Site metadata
│   ├── routes.ts             # Rotas da app
│   └── constants.ts
│
├── App.tsx                   # App root
├── main.tsx                  # Entry point
└── router.tsx                # Router configuration
```

---

## 🗺️ Sistema de Rotas

### Router Configuration (router.tsx)

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './features/dashboard/layouts/DashboardLayout'
import AdminLayout from './features/admin/layouts/AdminLayout'

// Pages
import HomePage from './features/home/HomePage'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'

// ... (import todas as páginas)

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Homepage
      {
        index: true,
        element: <HomePage />
      },

      // Explorar
      {
        path: 'explorar',
        children: [
          { path: 'tudo', element: <ExplorePage /> },
          { path: 'artigos', element: <ExploreArticlesPage /> },
          { path: 'videos', element: <ExploreVideosPage /> },
          { path: 'cursos', element: <ExploreCoursesPage /> },
          { path: 'eventos', element: <ExploreEventsPage /> },
          { path: 'podcasts', element: <ExplorePodcastsPage /> },
          { path: 'livros', element: <ExploreBooksPage /> }
        ]
      },

      // Criadores
      {
        path: 'criadores',
        children: [
          { index: true, element: <CreatorsListPage /> },
          { path: 'top', element: <TopCreatorsPage /> },
          { path: ':username', element: <CreatorProfilePage /> }
        ]
      },

      // Conteúdo (por tipo)
      {
        path: 'artigos/:slug',
        element: <ArticleDetailPage />
      },
      {
        path: 'videos/:slug',
        element: <VideoDetailPage />
      },
      {
        path: 'cursos/:slug',
        element: <CourseDetailPage />
      },
      {
        path: 'eventos/:slug',
        element: <EventDetailPage />
      },
      {
        path: 'podcasts/:slug',
        element: <PodcastDetailPage />
      },
      {
        path: 'livros/:slug',
        element: <BookDetailPage />
      },

      // Recursos (Brands)
      {
        path: 'recursos',
        children: [
          { index: true, element: <BrandsListPage /> },
          { path: 'corretoras', element: <BrandsBrokersPage /> },
          { path: 'plataformas', element: <BrandsPlatformsPage /> },
          { path: 'exchanges', element: <BrandsExchangesPage /> },
          { path: 'apps', element: <BrandsAppsPage /> },
          { path: 'sites', element: <BrandsSitesPage /> },
          { path: 'podcasts', element: <BrandsPodcastsPage /> },
          { path: 'livros', element: <BrandsLivrosPage /> },
          { path: ':slug', element: <BrandDetailPage /> }
        ]
      },

      // Aprender
      {
        path: 'aprender',
        children: [
          { index: true, element: <LearnHubPage /> },
          { path: 'noticias', element: <NewsPage /> },
          { path: 'glossario', element: <GlossaryPage /> },
          { path: 'cursos-gratuitos', element: <FreeCoursesPage /> },
          { path: 'guias', element: <GuidesPage /> }
        ]
      },

      // User Area (protected)
      {
        path: 'perfil/:username',
        element: <UserProfilePage />
      },
      {
        path: 'conta',
        element: <UserSettingsPage />,
        // loader: requireAuth
      },
      {
        path: 'meus-favoritos',
        element: <FavoritesPage />,
        // loader: requireAuth
      },
      {
        path: 'a-seguir',
        element: <FollowingFeedPage />,
        // loader: requireAuth
      },
      {
        path: 'notificacoes',
        element: <NotificationsPage />,
        // loader: requireAuth
      },

      // Static pages
      { path: 'sobre', element: <AboutPage /> },
      { path: 'contacto', element: <ContactPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'termos', element: <TermsPage /> },
      { path: 'privacidade', element: <PrivacyPage /> }
    ]
  },

  // Auth routes (different layout)
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'registar', element: <RegisterPage /> }
    ]
  },

  // Creator Dashboard (protected)
  {
    path: 'dashboard',
    element: <DashboardLayout />,
    // loader: requireCreator,
    children: [
      { index: true, element: <DashboardOverviewPage /> },
      { path: 'conteudo', element: <ContentManagementPage /> },
      { path: 'criar', element: <CreateContentPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'seguidores', element: <FollowersPage /> },
      { path: 'perfil', element: <ProfileEditPage /> }
    ]
  },

  // Admin Panel (protected)
  {
    path: 'admin',
    element: <AdminLayout />,
    // loader: requireAdmin,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <UsersManagementPage /> },
      { path: 'conteudo', element: <ContentModerationPage /> },
      { path: 'recursos', element: <BrandsManagementPage /> },
      { path: 'stats', element: <StatsPage /> }
    ]
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />
  }
])

export default router
```

---

## 🔐 Route Protection

### Auth Guards

```typescript
// lib/auth/guards.ts

import { redirect } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

export function requireAuth() {
  const { isAuthenticated } = useAuthStore.getState()

  if (!isAuthenticated) {
    return redirect('/login?redirect=' + window.location.pathname)
  }

  return null
}

export function requireCreator() {
  const { isAuthenticated, user } = useAuthStore.getState()

  if (!isAuthenticated) {
    return redirect('/login')
  }

  if (user?.role !== 'creator' && user?.role !== 'admin') {
    return redirect('/')
  }

  return null
}

export function requireAdmin() {
  const { isAuthenticated, user } = useAuthStore.getState()

  if (!isAuthenticated) {
    return redirect('/login')
  }

  if (user?.role !== 'admin') {
    return redirect('/')
  }

  return null
}

export function requirePremium() {
  const { isAuthenticated, user } = useAuthStore.getState()

  if (!isAuthenticated) {
    return redirect('/login')
  }

  const allowedRoles = ['premium', 'creator', 'admin']
  if (!allowedRoles.includes(user?.role || '')) {
    return redirect('/upgrade')
  }

  return null
}
```

---

## 📐 Layouts Base

### MainLayout (Layout público)

```typescript
// layouts/MainLayout.tsx

import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
```

### DashboardLayout (Creator Dashboard)

```typescript
// features/dashboard/layouts/DashboardLayout.tsx

import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

### AdminLayout (Admin Panel)

```typescript
// features/admin/layouts/AdminLayout.tsx

import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

---

## 🎯 Princípios da Arquitetura

### 1. Feature-Based Organization
- Cada feature é **autossuficiente**
- Componentes, hooks, types e pages juntos
- Fácil de encontrar e manter

### 2. Separation of Concerns
- **UI primitivos** (`components/ui/`) → reutilizáveis em toda a app
- **Layout components** (`components/layout/`) → estrutura da página
- **Feature components** → específicos de cada feature

### 3. Colocation
- Código relacionado fica junto
- Hooks próximos dos componentes que os usam
- Types próximos das features

### 4. Scalability
- Fácil adicionar novas features
- Componentes reutilizáveis
- Imports claros e organizados

### 5. Type Safety
- TypeScript em tudo
- Types centralizados em `lib/types/`
- Props bem tipadas

---

## 🚀 Próximos Passos

### Fase 1: Setup Base ✅
- [x] Definir estrutura de pastas
- [x] Configurar rotas
- [x] Criar layouts base

### Fase 2: Design System (PRÓXIMO)
- [ ] Definir tokens (cores, spacing, tipografia)
- [ ] Criar componentes UI primitivos
- [ ] Configurar Tailwind/CSS variables

### Fase 3: Navigation
- [ ] Header component
- [ ] Navigation menu
- [ ] Mobile menu
- [ ] Footer

### Fase 4: Features Core
- [ ] Homepage
- [ ] Explorar
- [ ] Auth pages

### Fase 5: Content System
- [ ] Content cards
- [ ] Content detail pages
- [ ] Rating & Comments

---

**Status**: 📝 **ESTRUTURA DEFINIDA**
**Próximo**: Implementar layouts base e começar Design System
