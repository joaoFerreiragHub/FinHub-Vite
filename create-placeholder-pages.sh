#!/bin/bash

# Script para criar páginas placeholder para todas as rotas

# Function to create a placeholder page
create_page() {
  local file_path=$1
  local page_name=$2
  local page_title=$3

  cat > "$file_path" <<EOF
/**
 * ${page_title}
 * TODO: Implementar conteúdo completo
 */
export default function ${page_name}() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        ${page_title}
      </h1>
      <p className="text-gray-600">
        Esta página está em construção. Implementação em breve.
      </p>
    </div>
  )
}
EOF

  echo "✅ Created: $file_path"
}

# Base directory
SRC_DIR="src"

# ========================================
# HOME
# ========================================
create_page "$SRC_DIR/features/home/HomePage.tsx" "HomePage" "Homepage"

# ========================================
# AUTH
# ========================================
create_page "$SRC_DIR/features/auth/pages/LoginPage.tsx" "LoginPage" "Login"
create_page "$SRC_DIR/features/auth/pages/RegisterPage.tsx" "RegisterPage" "Criar Conta"

# ========================================
# EXPLORE
# ========================================
create_page "$SRC_DIR/features/explore/pages/ExplorePage.tsx" "ExplorePage" "Explorar Tudo"
create_page "$SRC_DIR/features/explore/pages/ExploreArticlesPage.tsx" "ExploreArticlesPage" "Explorar Artigos"
create_page "$SRC_DIR/features/explore/pages/ExploreVideosPage.tsx" "ExploreVideosPage" "Explorar Vídeos"
create_page "$SRC_DIR/features/explore/pages/ExploreCoursesPage.tsx" "ExploreCoursesPage" "Explorar Cursos"
create_page "$SRC_DIR/features/explore/pages/ExploreEventsPage.tsx" "ExploreEventsPage" "Explorar Eventos"
create_page "$SRC_DIR/features/explore/pages/ExplorePodcastsPage.tsx" "ExplorePodcastsPage" "Explorar Podcasts"
create_page "$SRC_DIR/features/explore/pages/ExploreBooksPage.tsx" "ExploreBooksPage" "Explorar Livros"

# ========================================
# CREATORS
# ========================================
create_page "$SRC_DIR/features/creators/pages/CreatorsListPage.tsx" "CreatorsListPage" "Criadores"
create_page "$SRC_DIR/features/creators/pages/CreatorProfilePage.tsx" "CreatorProfilePage" "Perfil do Criador"
create_page "$SRC_DIR/features/creators/pages/TopCreatorsPage.tsx" "TopCreatorsPage" "Top Criadores"

# ========================================
# CONTENT (detail pages)
# ========================================
create_page "$SRC_DIR/features/content/pages/ArticleDetailPage.tsx" "ArticleDetailPage" "Artigo"
create_page "$SRC_DIR/features/content/pages/VideoDetailPage.tsx" "VideoDetailPage" "Vídeo"
create_page "$SRC_DIR/features/content/pages/CourseDetailPage.tsx" "CourseDetailPage" "Curso"
create_page "$SRC_DIR/features/content/pages/EventDetailPage.tsx" "EventDetailPage" "Evento"
create_page "$SRC_DIR/features/content/pages/PodcastDetailPage.tsx" "PodcastDetailPage" "Podcast"
create_page "$SRC_DIR/features/content/pages/BookDetailPage.tsx" "BookDetailPage" "Livro"

# ========================================
# BRANDS
# ========================================
create_page "$SRC_DIR/features/brands/pages/BrandsListPage.tsx" "BrandsListPage" "Recursos"
create_page "$SRC_DIR/features/brands/pages/BrandDetailPage.tsx" "BrandDetailPage" "Detalhe do Recurso"
create_page "$SRC_DIR/features/brands/pages/BrandsBrokersPage.tsx" "BrandsBrokersPage" "Corretoras"
create_page "$SRC_DIR/features/brands/pages/BrandsPlatformsPage.tsx" "BrandsPlatformsPage" "Plataformas"
create_page "$SRC_DIR/features/brands/pages/BrandsExchangesPage.tsx" "BrandsExchangesPage" "Exchanges"
create_page "$SRC_DIR/features/brands/pages/BrandsAppsPage.tsx" "BrandsAppsPage" "Apps"
create_page "$SRC_DIR/features/brands/pages/BrandsSitesPage.tsx" "BrandsSitesPage" "Sites"
create_page "$SRC_DIR/features/brands/pages/BrandsPodcastsPage.tsx" "BrandsPodcastsPage" "Podcasts Externos"
create_page "$SRC_DIR/features/brands/pages/BrandsLivrosPage.tsx" "BrandsLivrosPage" "Livros Externos"

# ========================================
# LEARN
# ========================================
create_page "$SRC_DIR/features/learn/pages/LearnHubPage.tsx" "LearnHubPage" "Hub Educativo"
create_page "$SRC_DIR/features/learn/pages/NewsPage.tsx" "NewsPage" "Notícias"
create_page "$SRC_DIR/features/learn/pages/GlossaryPage.tsx" "GlossaryPage" "Glossário"
create_page "$SRC_DIR/features/learn/pages/FreeCoursesPage.tsx" "FreeCoursesPage" "Cursos Gratuitos"
create_page "$SRC_DIR/features/learn/pages/GuidesPage.tsx" "GuidesPage" "Guias"

# ========================================
# USER
# ========================================
create_page "$SRC_DIR/features/user/pages/UserProfilePage.tsx" "UserProfilePage" "Perfil"
create_page "$SRC_DIR/features/user/pages/UserSettingsPage.tsx" "UserSettingsPage" "Configurações"
create_page "$SRC_DIR/features/user/pages/FavoritesPage.tsx" "FavoritesPage" "Meus Favoritos"
create_page "$SRC_DIR/features/user/pages/FollowingFeedPage.tsx" "FollowingFeedPage" "A Seguir"
create_page "$SRC_DIR/features/user/pages/NotificationsPage.tsx" "NotificationsPage" "Notificações"

# ========================================
# DASHBOARD (Creator)
# ========================================
create_page "$SRC_DIR/features/dashboard/pages/DashboardOverviewPage.tsx" "DashboardOverviewPage" "Dashboard Overview"
create_page "$SRC_DIR/features/dashboard/pages/ContentManagementPage.tsx" "ContentManagementPage" "Gestão de Conteúdo"
create_page "$SRC_DIR/features/dashboard/pages/CreateContentPage.tsx" "CreateContentPage" "Criar Conteúdo"
create_page "$SRC_DIR/features/dashboard/pages/AnalyticsPage.tsx" "AnalyticsPage" "Analytics"
create_page "$SRC_DIR/features/dashboard/pages/FollowersPage.tsx" "FollowersPage" "Seguidores"
create_page "$SRC_DIR/features/dashboard/pages/ProfileEditPage.tsx" "ProfileEditPage" "Editar Perfil"

# ========================================
# ADMIN
# ========================================
create_page "$SRC_DIR/features/admin/pages/AdminDashboardPage.tsx" "AdminDashboardPage" "Admin Dashboard"
create_page "$SRC_DIR/features/admin/pages/UsersManagementPage.tsx" "UsersManagementPage" "Gestão de Utilizadores"
create_page "$SRC_DIR/features/admin/pages/ContentModerationPage.tsx" "ContentModerationPage" "Moderação de Conteúdo"
create_page "$SRC_DIR/features/admin/pages/BrandsManagementPage.tsx" "BrandsManagementPage" "Gestão de Recursos"
create_page "$SRC_DIR/features/admin/pages/StatsPage.tsx" "StatsPage" "Estatísticas"

# ========================================
# STATIC PAGES
# ========================================
mkdir -p "$SRC_DIR/pages"
create_page "$SRC_DIR/pages/AboutPage.tsx" "AboutPage" "Sobre o FinHub"
create_page "$SRC_DIR/pages/ContactPage.tsx" "ContactPage" "Contacto"
create_page "$SRC_DIR/pages/FAQPage.tsx" "FAQPage" "Perguntas Frequentes"
create_page "$SRC_DIR/pages/TermsPage.tsx" "TermsPage" "Termos de Uso"
create_page "$SRC_DIR/pages/PrivacyPage.tsx" "PrivacyPage" "Política de Privacidade"
create_page "$SRC_DIR/pages/NotFoundPage.tsx" "NotFoundPage" "Página Não Encontrada"

echo ""
echo "✨ Todas as páginas placeholder foram criadas com sucesso!"
echo "📁 Total de páginas: 50+"
