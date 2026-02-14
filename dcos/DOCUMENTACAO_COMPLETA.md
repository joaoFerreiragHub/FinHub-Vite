# Documentação Completa - Financial Hub Platform

## 📋 Índice
1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura e Stack Tecnológica](#arquitetura-e-stack-tecnológica)
3. [Sistema de Utilizadores e Roles](#sistema-de-utilizadores-e-roles)
4. [Funcionalidades por Tipo de Utilizador](#funcionalidades-por-tipo-de-utilizador)
5. [Modelos de Dados (API)](#modelos-de-dados-api)
6. [Ferramentas Financeiras](#ferramentas-financeiras)
7. [Sistema de Conteúdos](#sistema-de-conteúdos)
8. [Sistema de Eventos e Parcerias](#sistema-de-eventos-e-parcerias)
9. [Sistema de Ratings e Reviews](#sistema-de-ratings-e-reviews)
10. [Sistema de Notificações](#sistema-de-notificações)
11. [Sistema de Livros](#sistema-de-livros)
12. [Sistema de Brokers/Corretoras](#sistema-de-brokerscorretoras)
13. [Homepage e Navegação](#homepage-e-navegação)
14. [Páginas de Conteúdo Dinâmico](#páginas-de-conteúdo-dinâmico)
15. [Sistema de Métricas e Analytics](#sistema-de-métricas-e-analytics)
16. [Estrutura de Rotas (Frontend)](#estrutura-de-rotas-frontend)
17. [API Endpoints](#api-endpoints)
18. [Integrações e Serviços Externos](#integrações-e-serviços-externos)

---

## 1. Visão Geral do Projeto

### 📝 Descrição
Financial Hub é uma plataforma educacional focada em finanças pessoais e investimentos. A plataforma conecta criadores de conteúdo financeiro com utilizadores interessados em aprender sobre tópicos financeiros diversos.

### 🎯 Objetivo Principal
Criar um ecossistema onde:
- **Criadores** podem partilhar conhecimento através de artigos, cursos, playlists e eventos
- **Utilizadores** podem aprender sobre finanças, usar ferramentas de cálculo e acompanhar criadores favoritos
- **Admins** gerem conteúdo, utilizadores e mantêm a qualidade da plataforma

### 🔑 Características Principais
- Sistema multi-role (Regular, Creator, Admin)
- Ferramentas financeiras interativas
- Sistema de conteúdos educacionais (cursos, artigos, vídeos)
- Sistema de eventos e parcerias
- Glossário financeiro
- Biblioteca de livros recomendados
- Sistema de métricas e analytics
- Sistema de ratings e engagement

---

## 2. Arquitetura e Stack Tecnológica

### Frontend (App)
```
Tecnologia: React 18.2.0
Framework: Create React App
UI Libraries:
  - PrimeReact (componentes principais)
  - React Bootstrap
  - Material-UI (@mui/material)

State Management:
  - Redux Toolkit (@reduxjs/toolkit)
  - Context API (UserContext)

Routing: React Router DOM v6

Principais Dependências:
  - draft-js (editor de texto)
  - react-draft-wysiwyg (WYSIWYG editor)
  - quill (editor alternativo)
  - react-player (reprodução de vídeo)
  - react-youtube (integração YouTube)
  - fullcalendar (calendário de eventos)
  - chart.js (gráficos)
  - formik + yup (validação de formulários)
  - react-toastify (notificações)
  - axios (requisições HTTP)
  - react-helmet (SEO)
  - moment (manipulação de datas)
```

### Backend (API)
```
Tecnologia: Node.js + Express 4.19.2
Database: MongoDB (Mongoose 7.6.12)

Principais Dependências:
  - bcrypt (encriptação de passwords)
  - jsonwebtoken (autenticação JWT)
  - multer + multer-s3 (upload de ficheiros)
  - aws-sdk (integração AWS)
  - helmet (segurança HTTP)
  - cors (cross-origin resource sharing)
  - express-rate-limit (rate limiting)
  - express-validator (validação de dados)
  - sanitize-html + xss (segurança contra XSS)
  - winston (logging)
  - node-cron (tarefas agendadas)
  - puppeteer (web scraping)
  - nodemailer (envio de emails)
  - slugify (geração de slugs)
  - swagger-ui-express (documentação API)
```

### Infraestrutura
- **Storage**: AWS S3 (ficheiros e imagens)
- **Database**: MongoDB
- **Autenticação**: JWT (JSON Web Tokens)
- **Documentação API**: Swagger/OpenAPI (doc.yml)

---

## 3. Sistema de Utilizadores e Roles

### 3.1 Tipos de Utilizadores

#### 🟢 Regular User (RegularUser)
**Permissões:**
- Visualizar conteúdos públicos
- Seguir criadores
- Avaliar cursos, artigos e conteúdos
- Usar ferramentas financeiras
- Participar em eventos
- Gerir perfil e preferências
- Acesso ao dashboard pessoal

**Campos Específicos:**
- Lista de tópicos favoritos
- Histórico de interações (likes, comments, shares)
- Cursos inscritos
- Criadores seguidos

#### 🔵 Creator User (CreatorUser)
**Permissões (herda de Regular + )**
- Criar e gerir artigos
- Criar e gerir cursos
- Criar e gerir playlists (regular, shorts, podcast)
- Fazer anúncios
- Gerir eventos
- Upload de ficheiros (PDFs, Excel, etc.)
- Ver métricas de engagement
- Gerir links de redes sociais

**Campos Específicos:**
- Bio
- Foto de perfil
- Links de redes sociais (YouTube, Instagram, Facebook, etc.)
- Lista de plataformas onde é famoso
- Controlo de visibilidade de conteúdos
- Métricas de engagement
- Followers/Following

#### 🔴 Admin User (AdminUser)
**Permissões Totais:**
- Gestão completa de utilizadores (CRUD)
- Gestão de conteúdos (aprovação, edição, remoção)
- Gestão de eventos e parcerias
- Acesso a estatísticas e relatórios
- Ferramentas de marketing
- Gestão técnica da plataforma
- Ferramentas de suporte ao cliente
- Configurações de segurança
- Opções de customização

### 3.2 Modelo de Dados do Utilizador

```javascript
User Schema {
  // Campos Básicos (todos os roles)
  username: String (unique, required)
  email: String (unique, required)
  firstname: String (required)
  lastname: String (required)
  password: String (required, hashed)
  role: enum ['regular', 'creator', 'admin', 'moderator']
  isPremium: Boolean

  // Tópicos de Interesse
  topics: Array<enum> [
    'ETFs', 'Ações', 'Reits', 'Cryptos',
    'Finanças Pessoais', 'Poupança', 'Imobiliário',
    'Obrigações', 'Fundos mútuos', 'Empreendedorismo',
    'Futuros e Opções', 'Trading'
  ]

  // Activity Tracking
  activity: {
    loginHistory: [{timestamp: Date}]
    sessionDurations: [{duration: Number, timestamp: Date}]
  }

  // Interações
  interactions: {
    likes: [{contentId: ObjectId, timestamp: Date}]
    comments: [{contentId: ObjectId, text: String, timestamp: Date}]
    shares: [{contentId: ObjectId, timestamp: Date}]
  }

  // Engagement (para Regular Users)
  engagement: {
    follows: [{userId: ObjectId, timestamp: Date}]
    followers: [{followerId: ObjectId, timestamp: Date}]
  }

  // Course Interactions
  courseInteractions: {
    enrolledCourses: [{courseId: ObjectId, timestamp: Date}]
    likedCourses: [{courseId: ObjectId, timestamp: Date}]
  }

  // Campos Creator-Specific
  bio: String
  profilePicture: String
  famous: Array<enum> ['Youtube', 'Spotify', 'Instagram', 'Facebook', 'Tiktok', 'Twitter', 'other']
  socialMediaLinks: [SocialMediaLinkSchema]

  // Content Visibility (Creators)
  contentVisibility: {
    announcements: Boolean
    courses: Boolean
    articles: Boolean
    events: Boolean
    files: Boolean
    playlists: {
      regular: Boolean
      shorts: Boolean
      podcast: Boolean
    }
    content: Boolean
  }

  // Conteúdos do Creator
  content: [{contentId: ObjectId, type: enum, timestamp: Date}]
  playlists: [{playlistId: ObjectId, timestamp: Date}]
  courses: [{coursesId: ObjectId, timestamp: Date}]
  articles: [{articleId: ObjectId, timestamp: Date}]
  events: [{eventId: ObjectId, timestamp: Date}]
  files: [{fileId: ObjectId, timestamp: Date}]
  announcements: [{announcementsId: ObjectId, timestamp: Date}]

  // Metrics
  engagementMetrics: ObjectId (ref: UserEngagementMetrics)
}
```

---

## 4. Funcionalidades por Tipo de Utilizador

### 4.1 Dashboard Regular User

**Localização:** `/dashboard/regular`

#### Funcionalidades:
1. **Conteúdos Favoritos** (`/dashboard/regular/favorites`)
   - Lista de artigos favoritos
   - Lista de cursos favoritos
   - Lista de criadores seguidos

2. **Dados e Subscrições** (`/dashboard/regular/edit`)
   - Edição de informações pessoais
   - Gestão de subscrições
   - Preferências de tópicos

3. **Notificações** (`/dashboard/regular/notifications`)
   - Configurações de notificações
   - Preferências de email
   - Alertas de novos conteúdos

### 4.2 Dashboard Creator User

**Localização:** `/dashboard/creator`

#### Tabs Principais:

##### Tab 1: Informações do Criador
- Edição de perfil (nome, bio, foto)
- Gestão de tópicos de expertise
- Gestão de links de redes sociais
  - YouTube
  - Instagram
  - Facebook
  - Spotify
  - TikTok
  - Twitter
  - Telegram

##### Tab 2: Content Management
**Componentes:**
1. **Editor de Artigos** (MyEditor)
   - Editor WYSIWYG (Draft.js)
   - Upload de imagens inline
   - Preview de artigo
   - Seleção de tópico
   - Publicação/Draft

2. **Gestão de Cursos** (CourseForm + CourseList)
   - Criação de curso
   - Nome, descrição, preço
   - Banner do curso
   - Link de compra
   - Tópico
   - Status (draft/published/archived)
   - isFeatured flag
   - Moderação de comentários

3. **Gestão de Playlists**
   - Tipo: Regular, Shorts, Podcast
   - Nome da playlist
   - Lista de vídeos (links YouTube)
   - Tópico
   - Seleção de destaque

4. **Gestão de Ficheiros** (FileUpload)
   - Upload de PDFs
   - Upload de Excel
   - Descrição
   - Tópico
   - Controlo de acesso (public/private)

5. **Anúncios** (AnnouncementCreator)
   - Texto curto (max 255 caracteres)
   - Publicação instantânea

6. **Gestão de Eventos** (EventsDashboard)
   - Criação de eventos
   - Título, descrição
   - Data/hora início e fim
   - Tipo: Online ou Presencial
   - Link online ou morada
   - Categoria do evento
   - Imagem de capa
   - Link de registo
   - Informações de contacto

##### Tab 3: Interaction & Engagement
- Estatísticas de views
- Estatísticas de likes, comments, shares
- Top performing content
- Followers growth
- Engagement rate

### 4.3 Dashboard Admin User

**Localização:** `/dashboard/AdminUser`

#### 10 Tabs de Gestão:

##### 1. User Management
- Lista completa de utilizadores
- CRUD operations
- Pesquisa de utilizadores
- Alteração de roles
- Ban/Unban utilizadores

##### 2. Content Management
- Aprovação de conteúdos pendentes
- Edição de conteúdos
- Remoção de conteúdos
- Gestão de conteúdos reportados

##### 3. Statistics and Reporting
- Métricas da plataforma
- Utilizadores ativos
- Conteúdos mais visualizados
- Creators top performers
- Crescimento de utilizadores
- Engagement global

##### 4. User Engagement Tools
- Ferramentas de retenção
- Campanhas de email
- Push notifications
- Gamification settings

##### 5. Subscription and Payments
- Gestão de subscriptions premium
- Relatórios financeiros
- Processamento de pagamentos
- Refunds

##### 6. Marketing Tools
- Campanhas promocionais
- SEO settings
- Email marketing
- Social media integration

##### 7. Technical Management
- Configurações de sistema
- Gestão de APIs
- Logs de erro
- Performance monitoring
- Database backups

##### 8. Customer Support Tools
- Tickets de suporte
- FAQ management
- Chat support
- Email templates

##### 9. Security Features
- Rate limiting config
- IP blocking
- 2FA settings
- Security logs
- Content moderation tools

##### 10. Customization Options
- Tema da plataforma
- Configurações de UI
- Homepage customization
- Feature flags

---

## 5. Modelos de Dados (API)

### 5.1 Course (Cursos)
```javascript
{
  courseName: String (required)
  description: String (required)
  price: Number (required)
  bannerImage: String (URL)
  purchaseLink: String (URL)
  creator: ObjectId (ref: User, required)
  contents: [ObjectId] (ref: Content)
  topic: enum [ETFs, Ações, REITs, Cripto Moedas, Finanças Pessoais, etc.]
  engagementMetrics: ObjectId (ref: UserEngagementMetrics)
  viewsCount: Number (default: 0)
  isFeatured: Boolean (default: false)
  status: enum ['draft', 'published', 'archived']
  expirationDate: Date
  isCommentsModerated: Boolean (default: true)
  averageRating: Number (default: 0)
  ratingsCount: Number (default: 0)
  ratings: [ObjectId] (ref: Rating)
  timestamps: true
}

Methods:
- updateAverageRating(): calcula média de ratings
```

### 5.2 Article (Artigos)
```javascript
{
  title: String (required)
  content: String (required) // HTML/Rich text
  imageUrls: [String] // Array de URLs de imagens
  contents: [ObjectId] (ref: Content)
  topic: enum [mesmos tópicos]
  author: ObjectId (ref: User, required)
  averageRating: Number (default: 0)
  ratingsCount: Number (default: 0)
  timestamps: true
}

Methods:
- updateAverageRating()
- getAverageRating()
```

### 5.3 Playlist
```javascript
{
  playlistName: String (required)
  videoLinks: [{}] // Array de objetos com links
  isSelected: Boolean (default: false) // Destacado
  creator: ObjectId (ref: User, required)
  contents: [ObjectId] (ref: Content)
  engagementMetrics: ObjectId (ref: UserEngagementMetrics)
  viewsCount: Number (default: 0)
  type: enum ['regular', 'shorts', 'podcast'] (required)
  topic: enum [mesmos tópicos] (required)
  timestamps: true
}
```

### 5.4 File (Ficheiros)
```javascript
{
  originalName: String (required)
  cleanOriginalName: String (required)
  mimeType: String (required)
  size: Number (required)
  filePath: String (required)
  creator: ObjectId (ref: User, required)
  access: enum ['public', 'private'] (default: private)
  description: String
  topic: enum [mesmos tópicos] (required)
  createdAt: Date
  updatedAt: Date
}

Methods:
- getAverageRating()
```

### 5.5 Announcement (Anúncios)
```javascript
{
  text: String (required, maxlength: 255)
  creator: ObjectId (ref: User, required)
  createdAt: Date (default: now)
}
```

### 5.6 AdminEvent (Eventos e Parcerias)
```javascript
{
  title: String (required)
  description: String (required)
  startTime: Date (required)
  endTime: Date (required)
  locationType: enum ['online', 'presencial'] (required)
  address: String (required if presencial)
  onlineLink: String (required if online)
  registrationLink: String
  slug: String (unique, auto-generated)
  eventCreatorName: String (required)
  coverImage: String (URL)
  status: enum ['pending', 'approved', 'declined'] (default: pending)
  isAdvertised: Boolean (default: false)

  advertisement: {
    promoted: Boolean
    startDate: Date
    endDate: Date
    cost: Number
    notes: String
    placement: enum ['homepage', 'sidebar', 'dedicated-section']
  }

  feedback: String
  processedBy: ObjectId (ref: User)
  eventCategory: enum ['Finanças Pessoais', 'Investimentos', 'Contabilidade', 'Other']
  expectedAttendees: Number
  accessibilityOptions: [String]
  contactEmail: String
  contactPhone: String
  termsAccepted: Boolean (required)
  eventCreator: ObjectId (ref: User, required)
  clickCount: Number (default: 0) // Reset semanalmente via cron
  createdAt: Date
}

Pre-save Hook:
- Gera slug único a partir do título
```

### 5.7 Content (Modelo Universal de Conteúdo)
```javascript
{
  // Basic Info
  title: String (required)
  description: String (required)
  videoLink: String
  isSelected: Boolean (default: false)
  creator: ObjectId (ref: User, required)

  // Engagement
  viewsCount: Number (default: 0)
  averageRating: Number (default: 0)
  ratings: [{userId: ObjectId, rating: Number}]
  engagementMetrics: ObjectId (ref: UserEngagementMetrics)

  // Reports & Moderation
  reports: [{userId: ObjectId, description: String}]

  // Social Features
  likes: [{userId: ObjectId, timestamp: Date}]
  comments: [{userId: ObjectId, text: String, timestamp: Date}]
  shares: [{userId: ObjectId, timestamp: Date}]

  // Analytics
  views: [{userId: ObjectId, timestamp: Date}]

  // Content Settings
  isFeatured: Boolean (default: false)
  status: enum ['draft', 'published', 'archived']
  expirationDate: Date
  isCommentsModerated: Boolean (default: true)

  // Sharing & Downloads
  sharesCount: Number (default: 0)
  downloadsCount: Number (default: 0)

  // Type
  contentType: enum ['video', 'article', 'podcast', 'course', 'other']

  timestamps: true
}
```

### 5.8 Glossary (Glossário)
```javascript
{
  term: String (required, unique)
  description: String (required)
  createdAt: Date (default: now)
  updatedAt: Date (auto-updated)
}
```

### 5.9 Website (Websites Recomendados)
```javascript
{
  name: String (required, unique)
  description: String (required)
  websiteLink: String (required)
  logo: String (URL)
  categories: [enum] // Mesmos tópicos
  trustworthinessRating: Number (0-5)
  languages: [String]
  freeOrPaid: enum ['Free', 'Paid', 'Freemium']
  socialMedia: [Mixed]
  userEngagementFeatures: [String] // 'Forum', 'Live Chat', 'Comments'
  educationalMaterials: [String] // 'Articles', 'Videos', 'Courses'
}
```

### 5.10 HighlightedBook (Livros em Destaque)
```javascript
{
  bookId: ObjectId (ref: Book, required)
  highlightedAt: Date (default: now)
  duration: Number (default: 7 dias)
}
```

### 5.11 SocialMediaLink (Schema Embebido)
```javascript
{
  type: String // youtube, facebook, instagram, spotify, tiktok, twitter, telegram
  link: String (URL)
}
```

---

## 6. Ferramentas Financeiras

**Localização:** `/ferramentas`

### 6.1 Lista de Ferramentas

#### 1. Emergency Fund Calculator (Fundo de Emergência)
**Rota:** `/ferramentas/emergencyfund`

**Funcionalidade:**
- Input de despesas mensais por categoria:
  - Supermercado
  - Combustíveis
  - Renda
  - Contas da casa
  - Internet
  - Educação
  - Outros
- Cálculo para 3 meses consecutivos
- Resultados:
  - Total mensal de cada mês
  - Média dos 3 meses
  - Fundo de emergência 6 meses
  - Fundo de emergência 12 meses

**Componentes:**
- `EmergencyFund.js`
- `ExpensesInput.js`
- Integrado com `DebtCalculator`

#### 2. Compound Interest Calculator (Juros Compostos)
**Rota:** `/ferramentas/juroscompostos`

**Inputs:**
- Investimento inicial
- Contribuição anual
- Contribuição mensal
- Taxa de juro anual
- Frequência de capitalização (anual/mensal)
- Anos
- Meses
- Taxa de imposto
- Taxa de inflação

**Outputs:**
- Saldo final (Ending Balance)
- Total de principal
- Total de contribuições
- Total de juros
- Juros do investimento inicial
- Juros das contribuições

**Componentes:**
- `CompoundInterest.js`
- `CompoundInterestInput.js`
- `CompoundInterestResult.js`

#### 3. ETF Analyzer (Análise de ETFs)
**Rota:** `/ferramentas/etf`

**Funcionalidade:**
- Análise de ETFs
- Avaliação de performance
- Métricas financeiras

**Componentes:**
- `AvaliarETF.js`

#### 4. REITs Intrinsic Value (Valor Intrínseco de REITs)
**Rota:** `/ferramentas/reits`

**Funcionalidade:**
- Cálculo de valor intrínseco de REITs
- Análise de dividendos
- Avaliação de investimento

**Componentes:**
- `AvaliarREITS.js`

#### 5. Debt Snowball (Controlo de Despesas e Poupança)
**Rota:** `/ferramentas/savings`

**Funcionalidade:**
- Método Snowball para pagamento de dívidas
- Lista de dívidas
- Priorização de pagamentos
- Simulação de pagamento acelerado

**Componentes:**
- `DebtSnowball.js`
- `debtCalculator.js`
- `Debinput.js`
- `DebtList.js`

#### 6. Stocks Intrinsic Value
**Rota:** `/ferramentas/stocks` (planeado)

**Funcionalidade:**
- Cálculo de valor intrínseco de ações
- Análise fundamentalista

---

## 7. Sistema de Conteúdos

### 7.1 Artigos

**Página Pública:** `/artigos`

**Funcionalidades:**
- Grid de artigos publicados
- Filtro por tópico
- Pesquisa
- Rating de artigos
- Visualização de artigo completo
- Autor do artigo (link para perfil do creator)

**Creator Features:**
- Editor WYSIWYG (Draft.js)
- Upload de imagens
- Rich text formatting
- Preview antes de publicar
- Publicar/Draft

### 7.2 Cursos

**Página Pública:** `/cursos`

**Funcionalidades:**
- Lista de cursos disponíveis
- Filtro por tópico
- Filtro por preço
- Rating de cursos
- Featured courses (destaque)
- Detalhes do curso:
  - Nome
  - Descrição
  - Preço
  - Banner
  - Creator
  - Link de compra
  - Reviews

**Creator Features:**
- Criação de curso
- Gestão de conteúdos do curso
- Precificação
- Controlo de visibilidade
- Moderação de comentários

### 7.3 Playlists de Vídeo

**Tipos:**
1. **Regular** - Vídeos normais
2. **Shorts** - Vídeos curtos
3. **Podcast** - Conteúdo em formato podcast

**Funcionalidades:**
- Integração com YouTube
- Player incorporado
- Lista de vídeos da playlist
- Tópico da playlist
- Creator da playlist

### 7.4 Criadores Financeiros

**Página:** `/criadoresfinanceiros`

**Funcionalidades:**
- Carrossel de criadores
- Card de criador:
  - Nome
  - Foto de perfil
  - Bio
  - Tópicos
  - Links de redes sociais
  - Rating médio
  - Número de followers
  - Plataformas onde é famoso

**Modal de Criador:**
- Informação completa
- Todos os cursos
- Todos os artigos
- Todas as playlists
- Botão de follow
- Rating do criador

**Página Individual:** `/creators/:username`

### 7.5 Ficheiros (PDFs, Excel, etc.)

**Creator Features:**
- Upload de ficheiros
- Categorização por tópico
- Controlo de acesso (público/privado)
- Descrição do ficheiro

**User Features:**
- Download de ficheiros públicos
- Rating de ficheiros

---

## 8. Sistema de Eventos e Parcerias

**Página Pública:** `/eventosparcerias`

### 8.1 Funcionalidades

#### Para Visitantes:
- Lista de eventos aprovados
- Filtro por categoria
- Filtro por tipo (online/presencial)
- Eventos em destaque (advertised)
- Detalhes do evento (`/events/:slug`)

#### Para Creators:
- Submissão de eventos
- Dashboard de eventos criados
- Status do evento (pending/approved/declined)
- Feedback do admin
- Edição de eventos pendentes
- Tracking de clicks

#### Para Admins:
- Aprovação/Rejeição de eventos
- Adicionar feedback
- Marcar como advertised
- Configurar publicidade:
  - Placement (homepage/sidebar/dedicated-section)
  - Datas de promoção
  - Custo
  - Notas

### 8.2 Características dos Eventos

- **Informação Básica:**
  - Título
  - Descrição
  - Data e hora (início/fim)
  - Imagem de capa

- **Localização:**
  - Online (link)
  - Presencial (morada)

- **Registo:**
  - Link de registo
  - Contacto (email/telefone)

- **Categorização:**
  - Categoria (Finanças Pessoais, Investimentos, etc.)
  - Número esperado de participantes

- **Acessibilidade:**
  - Wheelchair Access
  - Sign Language Interpreter
  - Other

- **Analytics:**
  - Click count (resetado semanalmente via cron)

---

## 9. Sistema de Ratings e Reviews

### 9.1 Visão Geral
Sistema universal de avaliações que permite aos utilizadores avaliar diversos tipos de conteúdo e criadores na plataforma.

### 9.2 Modelo de Dados - Rating
```javascript
{
  userId: ObjectId (ref: User, required)
  rateableType: enum ['Creator', 'Course', 'Article', 'Book', 'EbookFile'] (required)
  rateableId: ObjectId (dynamic ref based on rateableType, required)
  rating: Number (1-5, required)
  review: String (required se rating < 3 ou rating > 4)
  likes: [ObjectId] (ref: User) // Likes na review
  dislikes: [ObjectId] (ref: User) // Dislikes na review
  createdAt: Date
  updatedAt: Date
}

Index: {userId, rateableType, rateableId} (unique)
// Um utilizador só pode avaliar cada item uma vez
```

### 9.3 Funcionalidades

#### Tipos de Conteúdo Avaliável:
1. **Creators** - Avaliar criadores de conteúdo
2. **Courses** - Avaliar cursos
3. **Articles** - Avaliar artigos
4. **Books** - Avaliar livros
5. **EbookFiles** - Avaliar ficheiros ebook

#### Features de Ratings:
- **Rating obrigatório:** 1-5 estrelas
- **Review obrigatória:** Para ratings extremos (< 3 ou > 4)
- **Like/Dislike em Reviews:** Utilizadores podem votar em reviews de outros
- **Create or Update:** Sistema de atualização automática (se já existir rating, atualiza)
- **Cálculo de Average Rating:** Calculado automaticamente para cada item
- **Individual Rating:** Obter rating específico de um utilizador para um item

### 9.4 API Endpoints de Ratings
```
POST   /v1/ratings/                              - Criar rating
POST   /v1/ratings/course/createOrUpdate         - Criar ou atualizar rating de curso
POST   /v1/ratings/article/createOrUpdate        - Criar ou atualizar rating de artigo
POST   /v1/ratings/creator                       - Avaliar creator
POST   /v1/ratings/:reviewId/like                - Like em review
POST   /v1/ratings/:reviewId/dislike             - Dislike em review

GET    /v1/ratings/:type/:id                     - Obter todos os ratings de um item
GET    /v1/ratings/:type/:id/reviews             - Obter ratings com reviews
GET    /v1/ratings/:rateableType/:id/user/:userId - Rating individual de utilizador

GET    /v1/ratings/creator/:creatorId/average-rating
GET    /v1/ratings/course/:courseId/average-rating
GET    /v1/ratings/article/:articleId/average-rating

PUT    /v1/ratings/:id                           - Atualizar rating
DELETE /v1/ratings/:id                           - Eliminar rating
```

### 9.5 Regras de Negócio
- Um utilizador só pode avaliar cada item uma vez (constraint unique)
- Reviews são obrigatórias para ratings baixos (< 3) ou altos (> 4)
- Likes e dislikes em reviews são mutuamente exclusivos
- Average rating é recalculado automaticamente após cada nova avaliação
- Todos os endpoints de criação/edição requerem autenticação
- Rate limiting aplicado para prevenir abuse

---

## 10. Sistema de Notificações

### 10.1 Visão Geral
Sistema completo de notificações que permite aos utilizadores receberem atualizações sobre novos conteúdos dos criadores que seguem.

### 10.2 Modelo de Dados - Notification
```javascript
{
  recipient: ObjectId (ref: User, required)
  message: String (required)
  link: String (required) // Link para o conteúdo
  sender: ObjectId (ref: User, required) // Creator que gerou a notificação
  title: String (required)
  createdAt: Date (default: now)
  read: Boolean (default: false)
}
```

### 10.3 Modelo de Dados - NotificationSettings
```javascript
{
  user: ObjectId (ref: User, required)

  // Configurações Globais
  notificationsEnabled: Boolean (default: true)
  notificationsOnMobileAndDesktop: Boolean (default: true)
  notificationsViaEmail: Boolean (default: true)
  emailLanguage: String (default: 'en')

  // Preferências por Tipo de Conteúdo
  contentPreferences: {
    playlists: Boolean (default: true)
    courses: Boolean (default: true)
    articles: Boolean (default: true)
    events: Boolean (default: true)
    files: Boolean (default: true)
    announcements: Boolean (default: true)
  }

  lastUpdated: Date (default: now)
}

// Preferências específicas por Creator
CreatorNotificationSettings: {
  creatorId: ObjectId (ref: CreatorUser, required)
  preferences: [{
    contentType: enum ['courses', 'articles', 'events', 'files', 'playlists']
    notify: Boolean (default: true)
  }]
}
```

### 10.4 Funcionalidades

#### Para Regular Users:
- **Receber notificações** quando creators seguidos publicam novo conteúdo
- **Configurar preferências globais:**
  - Ativar/desativar todas as notificações
  - Escolher canais (mobile/desktop, email)
  - Idioma das notificações por email

- **Configurar por tipo de conteúdo:**
  - Escolher que tipos de conteúdo quer ser notificado (cursos, artigos, eventos, etc.)

- **Configurar por creator:**
  - Para cada creator seguido, escolher que tipos de conteúdo quer receber notificações

- **Gerir notificações:**
  - Marcar como lidas/não lidas
  - Ver histórico de notificações
  - Links diretos para o conteúdo

#### Para Creators:
- **Anúncios automáticos:** Quando publicam conteúdo, followers são notificados automaticamente
- **Criar announcements:** Notificações manuais para followers

### 10.5 API Endpoints de Notificações
```
GET    /v1/notification/notifications            - Obter notificações do utilizador
GET    /v1/notification/preferences              - Obter preferências de notificações

POST   /v1/notification/updatePreferences        - Atualizar preferências globais
POST   /v1/notification/toggleContentTypeNotifications - Toggle por tipo de conteúdo/creator
POST   /v1/notification/markNotificationsRead    - Marcar como lidas
POST   /v1/notification/announcements            - Criar announcement (creators)
```

### 10.6 Fluxo de Notificações
1. **Creator publica conteúdo** (artigo, curso, playlist, etc.)
2. **Sistema identifica followers** do creator
3. **Para cada follower:**
   - Verifica se tem notificações ativadas globalmente
   - Verifica preferências de tipo de conteúdo
   - Verifica preferências específicas para aquele creator
   - Se todas as checks passarem, cria notificação

4. **Utilizador recebe notificação:**
   - In-app (mobile/desktop)
   - Email (se configurado)

---

## 11. Sistema de Livros

### 11.1 Visão Geral
Biblioteca de livros recomendados sobre finanças pessoais e desenvolvimento pessoal, com sistema de ratings, comentários e livros em destaque.

### 11.2 Modelo de Dados - Book
```javascript
{
  title: String (required)
  author: String (required)
  coverImage: String (URL, required)
  summary: String
  keyPhrases: [String] // Frases-chave do livro

  // Comentários embutidos
  comments: [{
    userId: ObjectId (ref: User)
    comment: String (required)
    timestamp: Date (default: now)
  }]

  // Categorização
  genres: [enum] (required) [
    'Desenvolvimento Pessoal',
    'Psicologia e comunicação',
    'Ciencias sociais e humanas',
    'Psicologia',
    'Biografia',
    'Economia',
    'Finanças',
    'Ficção',
    'Gestão e Organização',
    'Mentalidade',
    'Finanças e Contabilidade',
    'Finanças Pessoais para Crianças e Jovens',
    'Sucesso profissional e pessoal',
    'Liberdade financeira'
  ]

  averageRating: Number (default: 0)
  createdAt: Date (default: now)
  updatedAt: Date (default: now)
}
```

### 11.3 Modelo de Dados - Comment (para livros)
```javascript
{
  text: String (required)
  bookId: ObjectId (ref: Book, required)
  userId: ObjectId (ref: User, required)

  // Sistema de Respostas
  replies: [{
    text: String
    userId: ObjectId (ref: User)
    createdAt: Date (default: now)
  }]

  createdAt: Date (default: now)
}
```

### 11.4 Modelo de Dados - HighlightedBook
```javascript
{
  bookId: ObjectId (ref: Book, required)
  highlightedAt: Date (default: now)
  duration: Number (default: 7 dias)
}
```

### 11.5 Modelo de Dados - HighlightListBook
```javascript
{
  // Lista de livros em destaque (curada)
  highlights: [{
    bookId: ObjectId (ref: Book)
    // ... outros metadados
  }]
}
```

### 11.6 Funcionalidades da Página de Livros

**Rota:** `/livros`

#### Seção "Destaques da Semana"
- Livros selecionados manualmente (HighlightListBook)
- Rotação semanal
- Destacados visualmente

#### Seção "Todos os Livros"
- **Pesquisa:** Por título ou autor
- **Filtros:**
  - Mais recentes (ordenação por createdAt)
  - Por género/categoria

- **Card de Livro:**
  - Imagem da capa
  - Título
  - Autor
  - Resumo
  - Rating médio
  - Botão para ver detalhes

#### Página de Detalhes do Livro
- Informação completa
- Frases-chave (key phrases)
- Sistema de ratings (integrado)
- **Sistema de comentários:**
  - Comentar livro
  - Responder a comentários (nested replies)
  - Ver todos os comentários

### 11.7 API Endpoints de Livros
```
GET    /v1/books/                                - Listar todos os livros
GET    /v1/books/:id                             - Obter livro específico
POST   /v1/books/                                - Adicionar livro (admin)
PUT    /v1/books/:id                             - Atualizar livro (admin)
DELETE /v1/books/:id                             - Eliminar livro (admin)

GET    /v1/highlightedbooks/                     - Livros em destaque individual
GET    /v1/highlightedlistbooks/                 - Lista curada de destaques

GET    /v1/commentsBookRouter/book/:bookId       - Comentários de um livro
POST   /v1/commentsBookRouter/                   - Adicionar comentário
POST   /v1/commentsBookRouter/:commentId/reply   - Responder a comentário
DELETE /v1/commentsBookRouter/:commentId         - Eliminar comentário
```

---

## 12. Sistema de Brokers/Corretoras

### 12.1 Visão Geral
Sistema de comparação de corretoras (brokers) para ajudar utilizadores a escolher a melhor plataforma de investimento.

### 12.2 Modelo de Dados - BrokerExchange
```javascript
{
  nome: String (required)
  description: String (required)

  // Custos e Taxas (todos String para flexibilidade)
  comissaoTransacao: String (required)
  taxaCambio: String (required)
  manutencao: String (required)
  depositoMinimo: String (required)
  comissaoDepositoLevantamento: String (required)
  jurosGerados: String (required)

  // Proteção e Segurança
  garantiaAtivos: String (required)
  garantiaDinheiro: String (required)

  // Features
  acoesFracionadas: Boolean (required)
  formularioW8ben: Boolean (required)

  // Regulação
  regulamentacao: String (required) // Ex: "CMVM, SEC, FCA"

  // Marketing
  logo: String (URL)
  brokerLink: String (URL)
  promoCode: String
}
```

### 12.3 Funcionalidades

#### Homepage - Carrossel de Brokers
- Carrossel horizontal com todos os brokers
- Cards compactos com informação essencial
- Click para ver detalhes completos

#### BrokerCard - Informações Exibidas:
- Logo do broker
- Nome
- Descrição breve
- **Destaque de taxas:**
  - Comissão de transação
  - Taxa de câmbio
  - Depósito mínimo

- **Badges:**
  - ✅ Ações fracionadas
  - ✅ Formulário W8-BEN

- **Regulamentação**
- Link para site do broker
- Código promocional (se disponível)

#### Comparação Detalhada:
- Tabela comparativa de todos os brokers
- Filtros por características
- Ordenação por diferentes critérios

### 12.4 API Endpoints de Brokers
```
GET    /v1/brokerRouter/                         - Listar todos os brokers
GET    /v1/brokerRouter/:id                      - Obter broker específico
POST   /v1/brokerRouter/                         - Adicionar broker (admin)
PUT    /v1/brokerRouter/:id                      - Atualizar broker (admin)
DELETE /v1/brokerRouter/:id                      - Eliminar broker (admin)
```

### 12.5 Características Comparadas

| Característica | Descrição |
|----------------|-----------|
| **Comissões** | Custo por transação |
| **Taxa de Câmbio** | Spread em conversões de moeda |
| **Manutenção** | Custos mensais/anuais |
| **Depósito Mínimo** | Valor mínimo para abertura de conta |
| **Depósito/Levantamento** | Custos de transferências |
| **Juros** | Rendimento sobre cash não investido |
| **Garantias** | Proteção de ativos e dinheiro |
| **Ações Fracionadas** | Possibilidade de comprar frações |
| **W8-BEN** | Formulário fiscal para não-residentes US |
| **Regulação** | Entidades reguladoras |

---

## 13. Homepage e Navegação

### 13.1 Homepage (`/home`)

#### Estrutura da Homepage:
```
┌─────────────────────────────────────────────┐
│  Navbar (colapsável, sticky on scroll)     │
├─────────────────────────────────────────────┤
│  Banner (imagem de cabeçalho)               │
├─────────────────────────────────────────────┤
│  Navegação Principal (tabs)                 │
│  [Home] [Educadores] [Eventos] ...          │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Os Criadores Mais Cotados               │
│  [Carrossel de Top Ranked Creators]         │
│  [Botão: Ver Todos]                         │
│                                             │
│  👥 Criadores de Conteúdos                  │
│  [Carrossel com Todos os Creators]          │
│                                             │
│  🏦 Corretoras                               │
│  [Carrossel de Brokers]                     │
│                                             │
│  🌐 Sites e Ferramentas Úteis               │
│  [Carrossel de Websites Recomendados]       │
│                                             │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

#### Carrosséis da Homepage:

##### 1. Top Ranked Creators
- **Source:** `GET /users/top-ranked-creators`
- **Critério:** Baseado em CreatorRank (total views, likes, comments, shares)
- **Componente:** `CarouselCreators`

##### 2. Todos os Creators
- **Source:** `GET /users/creators/complete`
- **Mostra:** Todos os creators ativos
- **Componente:** `CarouselCreators`

##### 3. Novos Creators (não usado atualmente mas implementado)
- **Source:** `GET /users/new-creators`
- **Critério:** Creators recentemente registados

##### 4. Brokers
- **Source:** `GET /brokerRouter/`
- **Componente:** `ShowBrokers` (Lazy loaded)
- **Cards:** Informação comparativa de corretoras

##### 5. Sites e Ferramentas Úteis
- **Source:** `GET /websitesRouter/`
- **Componente:** `ShowWebsites` (Lazy loaded)
- **Cards:** Websites recomendados com ratings

### 13.2 Navbar (Sistema de Navegação)

#### Características:
- **Tipo:** Colapsável/Toggle
- **Comportamento:**
  - No topo da página: Botão de menu (☰)
  - Ao fazer scroll: Botão muda para scroll-to-top (↑)
  - Click: Toggle menu ou volta ao topo

#### Conteúdo do Navbar (quando aberto):
```
┌─────────────────────────────────────────────┐
│  [Avatar + Username]  [Logo]  [Ações User]  │
│   Rank: X                                   │
└─────────────────────────────────────────────┘
```

**Coluna 1 (Esquerda):**
- Avatar do utilizador
- Username
- Rank (nível do utilizador)
- Link para dashboard

**Coluna 2 (Centro):**
- Logo da plataforma
- Link para home

**Coluna 3 (Direita):**
- **UserActions:**
  - Botão de Editar Perfil (vai para dashboard)
  - Botão de Logout

#### Navegação Dashboard (por Role):
- **AdminUser** → `/dashboard/AdminUser`
- **RegularUser** → `/dashboard/regular/favorites`
- **CreatorUser** → `/dashboard/creator`

### 13.3 Layout - Tabs de Navegação Principal

Sempre visível após o Banner:
```
┌────────────────────────────────────────────────────────┐
│ [Página Inicial] [Educadores] [Eventos de Parcerias]  │
│ [Ferramentas] [Glossário] [Cursos e Formações]        │
│ [Artigos] [Literacia Financeira]                      │
└────────────────────────────────────────────────────────┘
```

**Mapeamento de Tabs:**
- **Página Inicial** → `/home`
- **Educadores** → `/criadoresfinanceiros`
- **Eventos de Parcerias** → `/eventosparcerias`
- **Ferramentas** → `/ferramentas`
- **Glossário** → `/glossario`
- **Cursos e Formações** → `/cursos`
- **Artigos** → `/artigos`
- **Literacia Financeira** → `/livros`

### 13.4 Banner
- Componente visual de cabeçalho
- Imagem de fundo com gradient fade
- Branding da plataforma

### 13.5 Footer
- Informações da empresa
- Links importantes
- Redes sociais
- Copyright

---

## 14. Páginas de Conteúdo Dinâmico

### 14.1 Dynamic Content por Tópico

**Rota:** `/dynamic-content/:topic`

#### Conceito:
Páginas geradas dinamicamente para cada tópico financeiro, agregando todo o conteúdo relacionado num só lugar.

#### Estrutura da Página:
```
┌─────────────────────────────────────────────┐
│  Conteúdos sobre [TÓPICO]                   │
│  - Descrição simples do tópico              │
│  - Informação educacional                   │
│                                             │
│  📹 Lista de vídeos sobre [TÓPICO]          │
│  [YouTube Carousel]                         │
│                                             │
│  🎙️ Podcasts interessantes sobre [TÓPICO]  │
│  [Podcast Carousel]                         │
│                                             │
│  👥 Criadores que falam sobre [TÓPICO]     │
│  [Lista de creators especializados]        │
│                                             │
│  🌐 Sites úteis - [TÓPICO]                  │
│  [Lista de websites relacionados]           │
│                                             │
│  📚 Livros sobre [TÓPICO]                   │
│  [Lista de livros recomendados]             │
│                                             │
│  📱 Apps úteis para [TÓPICO]                │
│  [Lista de aplicações móveis]               │
│                                             │
│  💬 Feedback Form                           │
│  [Formulário para sugestões]                │
└─────────────────────────────────────────────┘
```

#### Funcionalidades:

##### 1. Vídeos YouTube
- **Componente:** `YoutubeCarousel`
- **Source:** Content API filtrado por tópico
- **Features:**
  - Player incorporado
  - Navegação por carrossel
  - Links diretos para YouTube

##### 2. Podcasts
- **Componente:** `PodcastCarousel`
- **Source:** Content API (podcasts por tópico)
- **Features:**
  - Player de podcast
  - Episódios relacionados
  - Links para plataformas de podcast

##### 3. Criadores Especializados
- Lista de creators que criam conteúdo sobre aquele tópico específico
- Filtrados pelos `topics` do perfil do creator

##### 4. Sites Úteis
- Websites da base de dados filtrados por categoria/tópico
- Cards com logo, descrição, rating

##### 5. Livros
- Livros da biblioteca filtrados por género/tópico
- Com ratings e reviews

##### 6. Apps (Planeado)
- Aplicações móveis recomendadas
- (Funcionalidade não implementada completamente)

##### 7. Feedback Form
- **Componente:** `FeedbackForm` (do glossário)
- Permite utilizadores sugerirem:
  - Novos conteúdos
  - Correções
  - Melhorias na página do tópico

### 14.2 Acesso às Páginas Dinâmicas

#### Origem 1: Glossário
- Utilizador pesquisa termo no glossário
- Click no termo
- Redireciona para `/dynamic-content/:termo`

#### Origem 2: Navegação direta
- Links internos de outros conteúdos
- Filtros por tópico

### 14.3 Content API para Dynamic Pages
```javascript
GET /v1/content/list

Response: {
  content: [{
    id: String
    youtube: [String] // Links de vídeos
    podcast: [String] // Links de podcasts
    content: String // Descrição
    // ... outros campos
  }]
}
```

### 14.4 Funcionalidades Planeadas (Comentários no Código)
```javascript
// Documentaries and Movies:
//   Financial documentaries or movies that illustrate
//   historical events or financial crises.

// TED Talks and Talks from Conferences:
//   Inspirational or educational talks from TED events
//   or financial conferences.

// Infographics:
//   Visual representations of financial concepts,
//   investment strategies, or market trends.

// Webinars and Online Courses:
//   Live or recorded webinars covering various financial topics.
//   Comprehensive online courses on investing, budgeting, etc.
```

---

## 15. Sistema de Métricas e Analytics

### 9.1 UserEngagementMetrics
```javascript
{
  userId: ObjectId (ref: User)
  contentId: ObjectId (ref: Content)
  likes: Number
  comments: Number
  shares: Number
  views: Number
  maxValues: {
    views: Number
    likes: Number
    comments: Number
  }
  timestamps: true
}
```

**Uso:**
- Tracking individual de engagement por conteúdo
- Identificação de conteúdos top performing
- Análise de comportamento de utilizadores

### 9.2 CreatorRank
```javascript
{
  creatorId: ObjectId (ref: User)
  totalLikes: Number
  totalComments: Number
  totalShares: Number
  totalViews: Number
  totalContent: Number
  timestamps: true
}
```

**Uso:**
- Ranking de criadores
- Top performers
- Dashboards de creators
- Analytics agregados

### 9.3 PlatformAnalytics
**Propósito:**
- Métricas globais da plataforma
- KPIs administrativos
- Crescimento de utilizadores
- Engagement global

### 9.4 UserOverallActivity
**Propósito:**
- Atividade geral do utilizador
- Padrões de uso
- Retenção de utilizadores

---

## 10. Estrutura de Rotas (Frontend)

### 10.1 Rotas Públicas (Sem Login)
```
/login - Login de utilizadores
/registar - Registo de Regular User
/contacriadores - Registo de Creator User
/escolherutilizador - Seleção de tipo de utilizador
/recover-password - Recuperação de password
```

### 10.2 Rotas Autenticadas (Requer Login)
```
/ ou /home - Homepage
/criadoresfinanceiros - Lista de criadores
/creators/:username - Perfil individual de criador
/eventosparcerias - Lista de eventos
/events/:slug - Detalhes do evento
/glossario - Glossário financeiro
/livros - Biblioteca de livros
/patrocinios - Patrocínios
/aboutus - Sobre nós
/dynamic-content/:topic - Conteúdo dinâmico por tópico

Ferramentas:
/ferramentas - Index de ferramentas
/ferramentas/emergencyfund
/ferramentas/juroscompostos
/ferramentas/etf
/ferramentas/reits
/ferramentas/savings

Conteúdos:
/cursos - Lista de cursos
/artigos - Lista de artigos

Dashboards (baseado em role):
/dashboard/regular/* - Dashboard Regular User
/dashboard/creator - Dashboard Creator
/dashboard/AdminUser - Dashboard Admin
```

### 10.3 Sistema de Proteção de Rotas

```javascript
const DashboardRoute = ({ children, allowedRoles }) => {
  return allowedRoles.includes(user?.role)
    ? children
    : <Navigate to="/home" />
}
```

**Exemplos:**
- `/dashboard/creator` - apenas CreatorUser
- `/dashboard/AdminUser` - apenas AdminUser
- `/dashboard/regular` - apenas RegularUser

---

## 11. API Endpoints

### 11.1 Autenticação
```
POST /v1/auth/register - Registo de utilizador
POST /v1/auth/login - Login
POST /v1/auth/recover-password - Recuperação de password
GET /v1/auth/verify - Verificação de token
```

### 11.2 Users
```
GET /v1/users/:id - Obter utilizador por ID
PUT /v1/users/:id - Atualizar utilizador
DELETE /v1/users/:id - Eliminar utilizador
GET /v1/users/username/:username - Obter por username
```

### 11.3 Admin
```
GET /v1/admin/users - Listar todos os utilizadores
POST /v1/admin/users - Criar utilizador
PUT /v1/admin/users/:id - Atualizar utilizador
DELETE /v1/admin/users/:id - Eliminar utilizador
GET /v1/admin/search-users - Pesquisar utilizadores
```

### 11.4 Courses
```
GET /v1/courses - Listar cursos
GET /v1/courses/:id - Obter curso
POST /v1/courses - Criar curso
PUT /v1/courses/:id - Atualizar curso
DELETE /v1/courses/:id - Eliminar curso
```

### 11.5 Articles
```
GET /v1/articles - Listar artigos
GET /v1/articles/:id - Obter artigo
POST /v1/articles - Criar artigo
PUT /v1/articles/:id - Atualizar artigo
DELETE /v1/articles/:id - Eliminar artigo
```

### 11.6 Events
```
GET /v1/admin-events - Listar eventos
GET /v1/admin-events/:slug - Obter evento por slug
POST /v1/admin-events - Criar evento
PUT /v1/admin-events/:id - Atualizar evento
DELETE /v1/admin-events/:id - Eliminar evento
PATCH /v1/admin-events/:id/status - Atualizar status
```

### 11.7 Playlists
```
GET /v1/playlists - Listar playlists
POST /v1/playlists - Criar playlist
PUT /v1/playlists/:id - Atualizar playlist
DELETE /v1/playlists/:id - Eliminar playlist
```

### 11.8 Files
```
POST /v1/files/upload - Upload de ficheiro
GET /v1/files - Listar ficheiros
DELETE /v1/files/:id - Eliminar ficheiro
```

### 11.9 Glossary
```
GET /v1/glossary - Listar termos
POST /v1/glossary - Adicionar termo
PUT /v1/glossary/:id - Atualizar termo
DELETE /v1/glossary/:id - Eliminar termo
```

### 11.10 Websites
```
GET /v1/websites - Listar websites recomendados
POST /v1/websites - Adicionar website
PUT /v1/websites/:id - Atualizar website
DELETE /v1/websites/:id - Eliminar website
```

### 11.11 Books
```
GET /v1/highlighted-books - Livros em destaque
GET /v1/books - Listar livros
POST /v1/books - Adicionar livro
```

### 11.12 Metrics
```
GET /v1/metrics/creator-rank - Ranking de criadores
GET /v1/metrics/platform-analytics - Analytics da plataforma
GET /v1/metrics/user-engagement/:userId - Engagement de utilizador
```

### 11.13 ETFs & REITs (Ferramentas)
```
GET /v1/etfs - Listar ETFs
POST /v1/etfs/analyze - Analisar ETF
GET /v1/reits - Listar REITs
POST /v1/reits/analyze - Analisar REIT
```

---

## 12. Integrações e Serviços Externos

### 12.1 AWS Services
- **S3:** Upload e storage de ficheiros
  - Imagens de perfil
  - Banners de cursos
  - Ficheiros PDF/Excel
  - Imagens de artigos
  - Imagens de eventos

**Configuração:**
```javascript
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})
```

### 12.2 Email Services
- **NodeMailer:** Envio de emails
  - Verificação de conta
  - Recuperação de password
  - Notificações
  - Newsletters

### 12.3 YouTube Integration
- **react-youtube:** Player de vídeos
- **react-player:** Player alternativo
- Integração de playlists
- Embed de vídeos

### 12.4 Calendar Integration
- **FullCalendar:** Calendário de eventos
  - Visualização de eventos
  - Timeline view
  - Day grid view

### 12.5 Charts & Visualization
- **Chart.js:** Gráficos
  - Analytics de creators
  - Métricas de platform
  - Dashboards

### 12.6 Security
- **Helmet:** Headers HTTP de segurança
- **XSS Protection:** sanitize-html + xss
- **Rate Limiting:** express-rate-limit
- **CORS:** Configurado para origem específica
- **JWT:** Autenticação stateless

### 12.7 Cron Jobs
```javascript
// Reset click counts semanalmente (Domingos à meia-noite)
cron.schedule('0 0 * * 0', async () => {
  await AdminEvent.updateMany(
    { endTime: { $gte: new Date() } },
    { $set: { clickCount: 0 } }
  )
})
```

### 12.8 Web Scraping
- **Puppeteer:** Scraping de dados financeiros
  - Dados de ETFs
  - Dados de REITs
  - Informações de mercado

### 12.9 API Documentation
- **Swagger UI:** Documentação interativa
  - Endpoints documentados
  - Schemas de dados
  - Exemplos de requests/responses

**Acesso:**
```
/v1/docs
/latest/docs
```

---

## 19. Página About Us

**Rota:** `/aboutus`

### 19.1 Estrutura
Página informativa com 7 tabs principais usando PrimeReact TabView.

### 19.2 Tabs e Conteúdo

#### Tab 1: RoadMap (2024)
**Conteúdo:**
- Roteiro de desenvolvimento para 2024
- **Funcionalidades em Destaque:**
  - Contas de utilizador personalizadas
  - Sistema de avaliações e comentários
  - Sistema de definição de metas financeiras

- **Ferramentas Planeadas:**
  - Planeador de Orçamento
  - Calculadora de Hipotecas
  - Estimativa de Impostos
  - Calculadora de Metas de Poupança
  - Calculadora de Poupança para Reforma

#### Tab 2: Parceiros
**Conteúdo:**
- Lista de parceiros e colaboradores
- **Informação de cada parceiro:**
  - Nome
  - Logo
  - Breve descrição
  - Website
- Gratidão pela colaboração

#### Tab 3: Empresa
**Conteúdo:**
- **Visão:** Capacitar portugueses na gestão financeira
- **Missão:** Educação financeira para liberdade financeira
- **Como Funciona:**
  - Ferramentas de gestão de dinheiro
  - Planeamento de investimentos
  - Análise de ações

- **Valores Fundamentais:**
  1. **Informação Transparente:** Recursos claros e acessíveis
  2. **Honestidade e Integridade:** Abordagem franca sem promessas vazias
  3. **Empoderamento Financeiro:** Educação como ferramenta de transformação
  4. **Comunidade Forte:** Partilha de conhecimentos e apoio mútuo
  5. **Inovação com Propósito:** Tornar educação financeira envolvente

#### Tab 4: Contactos
**Conteúdo:**
- Informações de contacto direto:
  - Endereço
  - Telefone
  - E-mail
  - Horário de funcionamento

- **Redes Sociais:**
  - Facebook
  - Twitter
  - LinkedIn
  - Instagram

#### Tab 5: Sugestões
**Conteúdo:**
- Convite para feedback dos utilizadores
- Google Forms para sugestões (placeholder)
- **Aceita:**
  - Ideias de melhorias
  - Críticas construtivas
  - Sugestões de funcionalidades

#### Tab 6: Testemunhos
**Conteúdo:**
- Reviews e ratings de utilizadores
- Depoimentos sobre a plataforma
- **Fonte:** Posts de reviews (integrado com sistema de ratings)

#### Tab 7: Prémios e Condecorações
**Conteúdo:**
- Prémios recebidos
- Condecorações
- Menções honrosas
- Reconhecimentos da indústria

### 19.3 Características Técnicas
- **Dark Theme:** Classe CSS customizada `DarkTabView.css`
- **Active Index:** Controlo de tab ativa com estado
- **Responsive:** Adaptável a diferentes tamanhos de ecrã

---

## 20. Página de Patrocínios

**Rota:** `/patrocinios`

### 20.1 Conteúdo
- **Título:** "Prémios e Bônus"
- **Status:** Página placeholder (conteúdo a definir)

### 20.2 Propósito Planeado
Provavelmente para:
- Programas de afiliados
- Códigos promocionais de parceiros
- Bónus de registo em brokers
- Ofertas especiais para utilizadores

---

## 📊 Resumo de Funcionalidades Principais

### Para Regular Users:
✅ Acesso a conteúdos educacionais (artigos, cursos, vídeos)
✅ Ferramentas financeiras gratuitas (5 calculadoras)
✅ Sistema de rating e reviews universal
✅ Sistema de notificações personalizável
✅ Follow de criadores favoritos
✅ Participação em eventos
✅ Glossário financeiro com pesquisa e paginação
✅ Biblioteca de livros recomendados com comentários
✅ Comparação de brokers/corretoras
✅ Páginas dinâmicas por tópico financeiro
✅ Dashboard personalizado com favoritos
✅ Homepage com carrosséis de conteúdo

### Para Creators:
✅ Criação de artigos com editor WYSIWYG
✅ Gestão de cursos pagos
✅ Playlists de vídeo (regular, shorts, podcast)
✅ Upload de ficheiros educacionais
✅ Sistema de anúncios
✅ Criação de eventos
✅ Analytics de engagement
✅ Gestão de perfil e redes sociais
✅ Followers/Following system

### Para Admins:
✅ Gestão completa de utilizadores
✅ Moderação de conteúdos
✅ Aprovação de eventos
✅ Analytics da plataforma
✅ Ferramentas de marketing
✅ Configurações de segurança
✅ Suporte ao cliente
✅ Gestão técnica

---

## 🔐 Segurança e Boas Práticas

1. **Autenticação:**
   - JWT tokens
   - Passwords hashed com bcrypt
   - Protected routes

2. **Validação de Dados:**
   - express-validator
   - Sanitização de HTML (sanitize-html)
   - XSS protection

3. **Rate Limiting:**
   - Proteção contra abuse de API
   - Configurável por endpoint

4. **File Upload:**
   - Validação de tipo de ficheiro
   - Limite de tamanho
   - Storage seguro em S3

5. **Database:**
   - Mongoose schemas com validação
   - Indexes para performance
   - Referências entre documentos

6. **Logging:**
   - Winston para logs estruturados
   - Error tracking
   - Activity monitoring

---

## 📦 Tópicos Suportados na Plataforma

Todos os conteúdos, cursos, artigos, playlists e ficheiros são categorizados por:

1. **ETFs**
2. **Ações**
3. **REITs**
4. **Cripto Moedas**
5. **Finanças Pessoais**
6. **Poupança**
7. **Imobiliário**
8. **Obrigações**
9. **Fundos mútuos**
10. **Empreendedorismo**
11. **Futuros e Opções**
12. **Trading**

---

## 🎨 UI/UX Components

**Bibliotecas de Componentes Usadas:**
- **PrimeReact:** Componentes principais (TabView, DataTable, Dialogs)
- **React Bootstrap:** Layout e Grid
- **Material-UI:** Alguns componentes específicos
- **FontAwesome:** Ícones

**Recursos de UI:**
- Responsive design
- Dark/Light mode (potencial)
- Loading states
- Error boundaries
- Toast notifications (react-toastify)
- Modals e Dialogs
- Carousels
- Calendars
- Charts

---

## 🚀 Próximos Passos para Migração

### Recomendações para Vite + React + SSR + TypeScript:

1. **Estrutura Recomendada:**
   ```
   /src
     /app (App Router - Next.js style ou React Router v7)
     /components (componentes reutilizáveis)
     /features (features por domínio)
       /auth
       /courses
       /articles
       /tools
       /dashboard
     /lib (utilities, configs)
     /types (TypeScript types)
     /api (API client)
   ```

2. **State Management:**
   - Considerar Zustand ou Jotai (mais leve que Redux)
   - React Query para server state
   - Context API para UI state

3. **SSR Strategy:**
   - Next.js 14+ App Router (recomendado)
   - ou Remix
   - ou Vite SSR custom

4. **TypeScript:**
   - Definir interfaces para todos os modelos
   - Strict mode ativado
   - Validação com Zod

5. **Melhorias Sugeridas:**
   - Implementar cache strategies
   - Otimizar imagens (Next Image)
   - Code splitting
   - Lazy loading
   - Progressive Web App (PWA)
   - Real-time features (WebSockets já iniciado)
   - Search com Algolia ou Elasticsearch
   - i18n (internacionalização)

---

## 📝 Notas Finais

Este documento captura a arquitetura completa e funcionalidades do Financial Hub. Use esta documentação como referência para:

- **Reconstrução** do projeto em nova stack
- **Onboarding** de novos developers
- **Planning** de features futuras
- **API Documentation** de referência
- **Database Schema** de referência

**Versão da Documentação:** 1.1
**Data:** 2026-02-13
**Baseado em:** Análise completa do código legacy (React + Express + MongoDB)

---

## 📝 Changelog da Versão 1.1

### Adições à Documentação (Revisão Completa):

#### Novos Sistemas Documentados:
1. **Sistema de Ratings e Reviews (Seção 9)**
   - Rating universal para Creators, Courses, Articles, Books, Files
   - Sistema de likes/dislikes em reviews
   - Average rating automático
   - Review obrigatória para ratings extremos

2. **Sistema de Notificações (Seção 10)**
   - Notificações in-app e email
   - Preferências por tipo de conteúdo
   - Configuração específica por creator
   - Announcements de creators

3. **Sistema de Livros (Seção 11)**
   - Biblioteca completa com 15+ géneros
   - Sistema de comentários com replies
   - Livros em destaque da semana
   - Pesquisa e filtros avançados

4. **Sistema de Brokers/Corretoras (Seção 12)**
   - Comparação detalhada de corretoras
   - 15+ características comparadas
   - Carrossel na homepage
   - Códigos promocionais

5. **Homepage e Navegação (Seção 13)**
   - 5 carrosséis na homepage (Top creators, Creators, Brokers, Websites)
   - Navbar colapsável com scroll-to-top
   - Sistema de tabs de navegação principal
   - Avatar com rank do utilizador

6. **Páginas de Conteúdo Dinâmico (Seção 14)**
   - Páginas geradas por tópico
   - Agregação de vídeos, podcasts, livros, sites
   - YouTube e Podcast carousels
   - Feedback form integrado

7. **Página About Us (Seção 19)**
   - 7 tabs informativos
   - Roadmap 2024
   - Valores da empresa
   - Sistema de contactos e parceiros

8. **Página de Patrocínios (Seção 20)**
   - Prémios e bónus (planeado)

#### Modelos de Dados Adicionados:
- Rating
- Notification
- NotificationSettings
- Book
- Comment
- BrokerExchange
- Highlight systems

#### API Endpoints Adicionados:
- 20+ endpoints de Ratings
- 6+ endpoints de Notifications
- 10+ endpoints de Books e Comments
- Endpoints de Brokers

#### Funcionalidades Frontend Detalhadas:
- Sistema de carrosséis (react-responsive-carousel)
- Componentes lazy-loaded
- Sistema de pesquisa com debounce
- Paginação alfabética (glossário)
- Scroll behavior no navbar
- Dynamic routing por tópico
