import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/features/dashboard/layouts/DashboardLayout'
import AdminLayout from '@/features/admin/layouts/AdminLayout'

// Route guards
import {
  requireAuth,
  requireCreator,
  requireAdmin,
  redirectIfAuthenticated,
} from '@/lib/auth/guards'

// Pages - Home
import HomePage from '@/features/home/HomePage'

// Pages - Auth
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'

// Pages - Explore
import ExplorePage from '@/features/explore/pages/ExplorePage'
import ExploreArticlesPage from '@/features/explore/pages/ExploreArticlesPage'
import ExploreVideosPage from '@/features/explore/pages/ExploreVideosPage'
import ExploreCoursesPage from '@/features/explore/pages/ExploreCoursesPage'
import ExploreEventsPage from '@/features/explore/pages/ExploreEventsPage'
import ExplorePodcastsPage from '@/features/explore/pages/ExplorePodcastsPage'
import ExploreBooksPage from '@/features/explore/pages/ExploreBooksPage'

// Pages - Creators
import CreatorsListPage from '@/features/creators/pages/CreatorsListPage'
import CreatorProfilePage from '@/features/creators/pages/CreatorProfilePage'
import TopCreatorsPage from '@/features/creators/pages/TopCreatorsPage'

// Pages - Content (detail pages)
import ArticleDetailPage from '@/features/content/pages/ArticleDetailPage'
import VideoDetailPage from '@/features/content/pages/VideoDetailPage'
import CourseDetailPage from '@/features/content/pages/CourseDetailPage'
import EventDetailPage from '@/features/content/pages/EventDetailPage'
import PodcastDetailPage from '@/features/content/pages/PodcastDetailPage'
import BookDetailPage from '@/features/content/pages/BookDetailPage'

// Pages - Brands
import BrandsListPage from '@/features/brands/pages/BrandsListPage'
import BrandDetailPage from '@/features/brands/pages/BrandDetailPage'
import BrandsBrokersPage from '@/features/brands/pages/BrandsBrokersPage'
import BrandsPlatformsPage from '@/features/brands/pages/BrandsPlatformsPage'
import BrandsExchangesPage from '@/features/brands/pages/BrandsExchangesPage'
import BrandsAppsPage from '@/features/brands/pages/BrandsAppsPage'
import BrandsSitesPage from '@/features/brands/pages/BrandsSitesPage'
import BrandsPodcastsPage from '@/features/brands/pages/BrandsPodcastsPage'
import BrandsLivrosPage from '@/features/brands/pages/BrandsLivrosPage'

// Pages - Learn
import LearnHubPage from '@/features/learn/pages/LearnHubPage'
import NewsPage from '@/features/learn/pages/NewsPage'
import GlossaryPage from '@/features/learn/pages/GlossaryPage'
import FreeCoursesPage from '@/features/learn/pages/FreeCoursesPage'
import GuidesPage from '@/features/learn/pages/GuidesPage'

// Pages - Tools
import ToolsHubPage from '@/features/tools/pages/ToolsHubPage'
import {
  CryptoListPage,
  EtfOverlapPage,
  MarketsHubPage,
  MarketStocksPage,
  MarketWatchlistPage,
  ReitsToolkitPage,
} from '@/features/markets'

// Pages - User
import UserProfilePage from '@/features/user/pages/UserProfilePage'
import UserSettingsPage from '@/features/user/pages/UserSettingsPage'
import FavoritesPage from '@/features/user/pages/FavoritesPage'
import FollowingFeedPage from '@/features/user/pages/FollowingFeedPage'
import NotificationsPage from '@/features/user/pages/NotificationsPage'

// Pages - Dashboard (Creator)
import DashboardOverviewPage from '@/features/dashboard/pages/DashboardOverviewPage'
import ContentManagementPage from '@/features/dashboard/pages/ContentManagementPage'
import CreateContentPage from '@/features/dashboard/pages/CreateContentPage'
import AnalyticsPage from '@/features/dashboard/pages/AnalyticsPage'
import FollowersPage from '@/features/dashboard/pages/FollowersPage'
import ProfileEditPage from '@/features/dashboard/pages/ProfileEditPage'

// Pages - Admin
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'
import UsersManagementPage from '@/features/admin/pages/UsersManagementPage'
import CreatorsRiskBoardPage from '@/features/admin/pages/CreatorsRiskBoardPage'
import ContentModerationPage from '@/features/admin/pages/ContentModerationPage'
import EditorialCmsPage from '@/features/admin/pages/EditorialCmsPage'
import BrandsManagementPage from '@/features/admin/pages/BrandsManagementPage'
import StatsPage from '@/features/admin/pages/StatsPage'
import AssistedSessionsPage from '@/features/admin/pages/AssistedSessionsPage'

// Static pages
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import FAQPage from '@/pages/FAQPage'
import TermsPage from '@/pages/TermsPage'
import PrivacyPage from '@/pages/PrivacyPage'
import NotFoundPage from '@/pages/NotFoundPage'

/**
 * Router configuration for FinHub
 *
 * Structure:
 * - MainLayout: Public pages (home, explore, creators, brands, learn)
 * - AuthLayout: Login, Register
 * - DashboardLayout: Creator dashboard (protected)
 * - AdminLayout: Admin panel (protected)
 */
const router = createBrowserRouter([
  // ========================================
  // PUBLIC ROUTES (MainLayout)
  // ========================================
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Homepage
      {
        index: true,
        element: <HomePage />,
      },

      // ========================================
      // EXPLORAR (Browse content)
      // ========================================
      {
        path: 'explorar',
        children: [
          {
            path: 'tudo',
            element: <ExplorePage />,
          },
          {
            path: 'artigos',
            element: <ExploreArticlesPage />,
          },
          {
            path: 'videos',
            element: <ExploreVideosPage />,
          },
          {
            path: 'cursos',
            element: <ExploreCoursesPage />,
          },
          {
            path: 'eventos',
            element: <ExploreEventsPage />,
          },
          {
            path: 'podcasts',
            element: <ExplorePodcastsPage />,
          },
          {
            path: 'livros',
            element: <ExploreBooksPage />,
          },
        ],
      },

      // ========================================
      // CRIADORES (Creators)
      // ========================================
      {
        path: 'criadores',
        children: [
          {
            index: true,
            element: <CreatorsListPage />,
          },
          {
            path: 'top',
            element: <TopCreatorsPage />,
          },
          {
            path: ':username',
            element: <CreatorProfilePage />,
          },
        ],
      },

      // ========================================
      // CONTEÚDO (Content detail pages by type)
      // ========================================
      {
        path: 'artigos/:slug',
        element: <ArticleDetailPage />,
      },
      {
        path: 'videos/:slug',
        element: <VideoDetailPage />,
      },
      {
        path: 'cursos/:slug',
        element: <CourseDetailPage />,
      },
      {
        path: 'eventos/:slug',
        element: <EventDetailPage />,
      },
      {
        path: 'podcasts/:slug',
        element: <PodcastDetailPage />,
      },
      {
        path: 'livros/:slug',
        element: <BookDetailPage />,
      },

      // ========================================
      // RECURSOS (Brands)
      // ========================================
      {
        path: 'recursos',
        children: [
          {
            index: true,
            element: <BrandsListPage />,
          },
          {
            path: 'corretoras',
            element: <BrandsBrokersPage />,
          },
          {
            path: 'plataformas',
            element: <BrandsPlatformsPage />,
          },
          {
            path: 'exchanges',
            element: <BrandsExchangesPage />,
          },
          {
            path: 'apps',
            element: <BrandsAppsPage />,
          },
          {
            path: 'sites',
            element: <BrandsSitesPage />,
          },
          {
            path: 'podcasts',
            element: <BrandsPodcastsPage />,
          },
          {
            path: 'livros',
            element: <BrandsLivrosPage />,
          },
          {
            path: ':slug',
            element: <BrandDetailPage />,
          },
        ],
      },

      // ========================================
      // APRENDER (Education hub)
      // ========================================
      {
        path: 'aprender',
        children: [
          {
            index: true,
            element: <LearnHubPage />,
          },
          {
            path: 'noticias',
            element: <NewsPage />,
          },
          {
            path: 'glossario',
            element: <GlossaryPage />,
          },
          {
            path: 'cursos-gratuitos',
            element: <FreeCoursesPage />,
          },
          {
            path: 'guias',
            element: <GuidesPage />,
          },
        ],
      },

      // ========================================
      // MERCADOS (Market tools)
      // ========================================
      {
        path: 'mercados',
        children: [
          {
            index: true,
            element: <MarketsHubPage />,
          },
          {
            path: 'acoes',
            element: <MarketStocksPage />,
          },
          {
            path: 'etfs',
            element: <EtfOverlapPage />,
          },
          {
            path: 'reits',
            element: <ReitsToolkitPage />,
          },
          {
            path: 'cripto',
            element: <CryptoListPage />,
          },
          {
            path: 'watchlist',
            element: <MarketWatchlistPage />,
          },
        ],
      },
      {
        path: 'stocks',
        element: <Navigate to="/mercados/acoes" replace />,
      },

      // ========================================
      // FERRAMENTAS
      // ========================================
      {
        path: 'ferramentas',
        element: <ToolsHubPage />,
      },

      // ========================================
      // USER AREA (some protected, some public)
      // ========================================
      {
        path: 'perfil/:username',
        element: <UserProfilePage />,
      },
      {
        path: 'conta',
        element: <UserSettingsPage />,
        loader: requireAuth,
      },
      {
        path: 'meus-favoritos',
        element: <FavoritesPage />,
        loader: requireAuth,
      },
      {
        path: 'a-seguir',
        element: <FollowingFeedPage />,
        loader: requireAuth,
      },
      {
        path: 'notificacoes',
        element: <NotificationsPage />,
        loader: requireAuth,
      },

      // ========================================
      // STATIC PAGES
      // ========================================
      {
        path: 'sobre',
        element: <AboutPage />,
      },
      {
        path: 'contacto',
        element: <ContactPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'termos',
        element: <TermsPage />,
      },
      {
        path: 'privacidade',
        element: <PrivacyPage />,
      },
    ],
  },

  // ========================================
  // AUTH ROUTES (AuthLayout)
  // ========================================
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
        loader: redirectIfAuthenticated,
      },
      {
        path: 'registar',
        element: <RegisterPage />,
        loader: redirectIfAuthenticated,
      },
    ],
  },

  // ========================================
  // CREATOR DASHBOARD (Protected)
  // ========================================
  {
    path: 'dashboard',
    element: <DashboardLayout />,
    loader: requireCreator,
    children: [
      {
        index: true,
        element: <DashboardOverviewPage />,
      },
      {
        path: 'conteudo',
        element: <ContentManagementPage />,
      },
      {
        path: 'criar',
        element: <CreateContentPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'seguidores',
        element: <FollowersPage />,
      },
      {
        path: 'perfil',
        element: <ProfileEditPage />,
      },
    ],
  },

  // ========================================
  // ADMIN PANEL (Protected)
  // ========================================
  {
    path: 'admin',
    element: <AdminLayout />,
    loader: requireAdmin,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'users',
        element: <UsersManagementPage />,
      },
      {
        path: 'creators',
        element: <CreatorsRiskBoardPage />,
      },
      {
        path: 'conteudo',
        element: <ContentModerationPage />,
      },
      {
        path: 'editorial',
        element: <EditorialCmsPage />,
      },
      {
        path: 'suporte',
        element: <AssistedSessionsPage />,
      },
      {
        path: 'recursos',
        element: <BrandsManagementPage />,
      },
      {
        path: 'stats',
        element: <StatsPage />,
      },
    ],
  },

  // ========================================
  // 404 NOT FOUND
  // ========================================
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
