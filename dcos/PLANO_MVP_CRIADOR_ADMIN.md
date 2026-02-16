# 🎯 Plano MVP - Criador + Admin

**Data**: 2026-02-15
**Objetivo**: Implementar backend completo para suportar o fluxo de Criadores e Admins
**API Base**: C:\Users\User\Documents\GitHub\Riquinho\api\Front\API_finhub

---

## 📊 Estado Atual da API

### ✅ Existente
- **Framework**: Express + TypeScript
- **Database**: MongoDB (Mongoose)
- **Rotas Funcionais**:
  - `/api/stocks` - Análise de ações
  - `/api/ml` - Machine Learning
  - `/api/news` - Agregação de notícias
- **Middlewares**: CORS, Helmet, Morgan, Rate Limiter
- **Modelos**: News, NewsSource

### ❌ Faltante (Critico para MVP)
- Sistema de autenticação (JWT)
- Modelo de User com roles
- CRUD de conteúdos (Articles, Videos, Courses, etc.)
- Sistema de Ratings & Comments
- Upload de ficheiros
- Rotas de Admin

---

## 🚀 Fase 1: Foundation (Autenticação & Users)

### 1.1. Modelo de User
**Ficheiro**: `src/models/User.ts`

```typescript
interface User {
  _id: string
  email: string
  password: string // hashed com bcrypt
  name: string
  username: string // único
  avatar?: string
  role: 'visitor' | 'free' | 'premium' | 'creator' | 'admin'

  // Creator specific
  bio?: string
  socialLinks?: {
    website?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }

  // Premium
  subscriptionExpiry?: Date

  // Stats
  followers: number
  following: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

**Métodos**:
- `comparePassword(password: string): Promise<boolean>`
- `generateAuthToken(): string`

### 1.2. Autenticação (JWT)
**Ficheiros**:
- `src/middlewares/auth.ts` - Verificação de token
- `src/middlewares/roleGuard.ts` - Verificação de roles
- `src/controllers/auth.controller.ts` - Login, Register, Refresh
- `src/routes/auth.routes.ts`

**Endpoints**:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

**Dependências necessárias**:
```bash
yarn add bcryptjs jsonwebtoken
yarn add -D @types/bcryptjs @types/jsonwebtoken
```

---

## 🚀 Fase 2: CRUD de Conteúdos

### 2.1. Schema Base (BaseContent)
**Ficheiro**: `src/models/BaseContent.ts`

```typescript
interface BaseContent {
  _id: string
  title: string
  slug: string
  description: string
  content: string // HTML/Markdown
  contentType: 'article' | 'video' | 'course' | 'live' | 'podcast' | 'book'

  // Categorização
  category: string
  tags: string[]

  // Media
  coverImage: string
  thumbnail?: string

  // Permissions
  isPremium: boolean
  isFeatured: boolean

  // Status
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date

  // Creator
  creator: ObjectId // ref: 'User'

  // Engagement
  views: number
  likes: number
  favorites: number
  commentsCount: number

  // Ratings
  averageRating: number
  ratingsCount: number

  createdAt: Date
  updatedAt: Date
}
```

### 2.2. Modelos Específicos

#### Articles
**Ficheiro**: `src/models/Article.ts`
```typescript
interface Article extends BaseContent {
  readingTime: number // minutos
  wordCount: number
}
```

#### Videos
**Ficheiro**: `src/models/Video.ts`
```typescript
interface Video extends BaseContent {
  videoUrl: string
  duration: number // segundos
  quality: '720p' | '1080p' | '4k'
}
```

#### Courses
**Ficheiro**: `src/models/Course.ts`
```typescript
interface Course extends BaseContent {
  price: number
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // horas
  lessonsCount: number
  lessons: CourseLesson[]
}

interface CourseLesson {
  title: string
  duration: number
  videoUrl?: string
  isFree: boolean
  order: number
}
```

#### Lives/Events
**Ficheiro**: `src/models/LiveEvent.ts`
```typescript
interface LiveEvent extends BaseContent {
  startDate: Date
  endDate: Date
  streamUrl?: string
  maxAttendees?: number
  attendees: ObjectId[] // ref: 'User'
  isRecorded: boolean
  recordingUrl?: string
}
```

#### Podcasts
**Ficheiro**: `src/models/Podcast.ts`
```typescript
interface Podcast extends BaseContent {
  audioUrl: string
  duration: number // segundos
  episodeNumber?: number
  season?: number
}
```

#### Books
**Ficheiro**: `src/models/Book.ts`
```typescript
interface Book extends BaseContent {
  author: string
  isbn?: string
  pages: number
  language: string
  publishedDate: Date
  buyLinks?: {
    amazon?: string
    kobo?: string
    other?: string
  }
  keyPhrases: string[]
}
```

### 2.3. Routes & Controllers para cada tipo

**Padrão de rotas** (exemplo: Articles):
```
GET    /api/articles              - Lista pública (filtros, paginação)
GET    /api/articles/:slug        - Detalhe público
POST   /api/articles              - Criar (auth, creator/admin only)
PATCH  /api/articles/:id          - Editar (auth, owner/admin)
DELETE /api/articles/:id          - Eliminar (auth, owner/admin)
PATCH  /api/articles/:id/publish  - Publicar (auth, owner/admin)
POST   /api/articles/:id/like     - Like (auth)
POST   /api/articles/:id/favorite - Favorite (auth)

# Creator Dashboard
GET    /api/articles/my           - Meus artigos (auth, creator)
GET    /api/articles/:id/stats    - Estatísticas (auth, owner)
```

**Ficheiros necessários** (por tipo):
- `src/controllers/article.controller.ts`
- `src/routes/article.routes.ts`
- `src/services/article.service.ts`

**Repetir para**: Videos, Courses, Lives, Podcasts, Books

---

## 🚀 Fase 3: Ratings & Comments

### 3.1. Rating Model
**Ficheiro**: `src/models/Rating.ts`

```typescript
interface Rating {
  _id: string
  user: ObjectId // ref: 'User'
  targetType: 'article' | 'video' | 'course' | 'live' | 'podcast' | 'book'
  targetId: ObjectId
  rating: number // 1-5
  review?: string
  createdAt: Date
  updatedAt: Date
}
```

**Endpoints**:
```
POST   /api/ratings                    - Criar rating (auth)
PATCH  /api/ratings/:id                - Editar rating (auth, owner)
DELETE /api/ratings/:id                - Eliminar rating (auth, owner)
GET    /api/ratings/:targetType/:id    - Ratings de um conteúdo
```

### 3.2. Comment Model
**Ficheiro**: `src/models/Comment.ts`

```typescript
interface Comment {
  _id: string
  user: ObjectId // ref: 'User'
  targetType: 'article' | 'video' | 'course' | 'live' | 'podcast' | 'book'
  targetId: ObjectId
  content: string

  // Threading
  parentComment?: ObjectId // ref: 'Comment'
  replies: ObjectId[] // ref: 'Comment'
  depth: number // 0-3 (máximo 3 níveis)

  // Engagement
  likes: number

  createdAt: Date
  updatedAt: Date
}
```

**Endpoints**:
```
POST   /api/comments                   - Criar comment (auth)
POST   /api/comments/:id/reply         - Reply (auth)
PATCH  /api/comments/:id               - Editar (auth, owner/admin)
DELETE /api/comments/:id               - Eliminar (auth, owner/admin)
POST   /api/comments/:id/like          - Like (auth)
GET    /api/comments/:targetType/:id   - Comments de um conteúdo
```

---

## 🚀 Fase 4: Social Features

### 4.1. Follow Model
**Ficheiro**: `src/models/Follow.ts`

```typescript
interface Follow {
  _id: string
  follower: ObjectId // ref: 'User'
  following: ObjectId // ref: 'User' (creator)
  createdAt: Date
}
```

### 4.2. Favorite Model
**Ficheiro**: `src/models/Favorite.ts`

```typescript
interface Favorite {
  _id: string
  user: ObjectId // ref: 'User'
  targetType: 'article' | 'video' | 'course' | 'live' | 'podcast' | 'book'
  targetId: ObjectId
  createdAt: Date
}
```

### 4.3. Notification Model
**Ficheiro**: `src/models/Notification.ts`

```typescript
interface Notification {
  _id: string
  user: ObjectId // ref: 'User'
  type: 'new_content' | 'new_follower' | 'new_comment' | 'new_rating' | 'live_starting'
  title: string
  message: string
  actionUrl?: string
  isRead: boolean
  createdAt: Date
}
```

**Endpoints**:
```
GET    /api/social/following          - Criadores que sigo (auth)
POST   /api/social/follow/:userId     - Seguir (auth)
DELETE /api/social/follow/:userId     - Deixar de seguir (auth)

GET    /api/social/favorites          - Meus favoritos (auth)
GET    /api/social/notifications      - Minhas notificações (auth)
PATCH  /api/social/notifications/read - Marcar como lidas (auth)
```

---

## 🚀 Fase 5: Upload de Ficheiros

### 5.1. Configuração
**Dependências**:
```bash
yarn add multer
yarn add -D @types/multer
```

**Ficheiro**: `src/config/upload.ts`

```typescript
import multer from 'multer'
import path from 'path'

// Configuração para imagens
export const imageUpload = multer({
  dest: 'uploads/images/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.filename).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Apenas imagens são permitidas'))
  }
})

// Configuração para vídeos
export const videoUpload = multer({
  dest: 'uploads/videos/',
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|avi|mov/
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype) {
      return cb(null, true)
    }
    cb(new Error('Apenas vídeos são permitidos'))
  }
})

// Configuração para áudio (podcasts)
export const audioUpload = multer({
  dest: 'uploads/audio/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const filetypes = /mp3|wav|ogg/
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype) {
      return cb(null, true)
    }
    cb(new Error('Apenas áudio é permitido'))
  }
})
```

**Endpoints**:
```
POST /api/upload/image     - Upload de imagem (auth)
POST /api/upload/video     - Upload de vídeo (auth, creator)
POST /api/upload/audio     - Upload de áudio (auth, creator)
```

**Nota**: Em produção, usar S3, Cloudinary ou similar.

---

## 🚀 Fase 6: Admin Routes

### 6.1. Middleware AdminOnly
**Ficheiro**: `src/middlewares/adminOnly.ts`

```typescript
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
```

### 6.2. Admin Endpoints
**Ficheiro**: `src/routes/admin.routes.ts`

```
# User Management
GET    /api/admin/users              - Lista todos users
PATCH  /api/admin/users/:id/role     - Alterar role
DELETE /api/admin/users/:id          - Eliminar user

# Content Moderation
GET    /api/admin/content            - Todo o conteúdo (com filtros)
PATCH  /api/admin/content/:id/feature - Featured toggle
DELETE /api/admin/content/:id        - Eliminar conteúdo

# Stats
GET    /api/admin/stats              - Estatísticas gerais
```

---

## 📦 Estrutura Final da API

```
API_finhub/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── upload.ts ← NOVO
│   │
│   ├── middlewares/
│   │   ├── auth.ts ← EXPANDIR
│   │   ├── roleGuard.ts ← NOVO
│   │   ├── adminOnly.ts ← NOVO
│   │   ├── validation.ts
│   │   └── rateLimiter.ts
│   │
│   ├── models/
│   │   ├── User.ts ← NOVO
│   │   ├── BaseContent.ts ← NOVO
│   │   ├── Article.ts ← NOVO
│   │   ├── Video.ts ← NOVO
│   │   ├── Course.ts ← NOVO
│   │   ├── LiveEvent.ts ← NOVO
│   │   ├── Podcast.ts ← NOVO
│   │   ├── Book.ts ← NOVO
│   │   ├── Rating.ts ← NOVO
│   │   ├── Comment.ts ← NOVO
│   │   ├── Follow.ts ← NOVO
│   │   ├── Favorite.ts ← NOVO
│   │   ├── Notification.ts ← NOVO
│   │   ├── News.ts
│   │   └── Stock.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts ← NOVO
│   │   ├── article.controller.ts ← NOVO
│   │   ├── video.controller.ts ← NOVO
│   │   ├── course.controller.ts ← NOVO
│   │   ├── live.controller.ts ← NOVO
│   │   ├── podcast.controller.ts ← NOVO
│   │   ├── book.controller.ts ← NOVO
│   │   ├── rating.controller.ts ← NOVO
│   │   ├── comment.controller.ts ← NOVO
│   │   ├── social.controller.ts ← NOVO
│   │   ├── admin.controller.ts ← NOVO
│   │   ├── upload.controller.ts ← NOVO
│   │   ├── newsController.ts
│   │   ├── stock.controller.ts
│   │   └── ml.controller.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts ← NOVO
│   │   ├── article.routes.ts ← NOVO
│   │   ├── video.routes.ts ← NOVO
│   │   ├── course.routes.ts ← NOVO
│   │   ├── live.routes.ts ← NOVO
│   │   ├── podcast.routes.ts ← NOVO
│   │   ├── book.routes.ts ← NOVO
│   │   ├── rating.routes.ts ← NOVO
│   │   ├── comment.routes.ts ← NOVO
│   │   ├── social.routes.ts ← NOVO
│   │   ├── admin.routes.ts ← NOVO
│   │   ├── upload.routes.ts ← NOVO
│   │   ├── newsRoutes.ts
│   │   ├── stock.routes.ts
│   │   ├── ml.routes.ts
│   │   └── index.ts ← EXPANDIR
│   │
│   ├── services/
│   │   ├── auth.service.ts ← NOVO
│   │   ├── article.service.ts ← NOVO
│   │   ├── video.service.ts ← NOVO
│   │   ├── ... (para cada tipo)
│   │   ├── notification.service.ts ← NOVO
│   │   └── (existentes)
│   │
│   ├── types/
│   │   ├── auth.ts ← NOVO
│   │   ├── content.ts ← NOVO
│   │   └── (existentes)
│   │
│   ├── utils/
│   │   ├── slugify.ts ← NOVO
│   │   ├── jwt.ts ← NOVO
│   │   └── (existentes)
│   │
│   ├── app.ts
│   └── server.ts
│
├── uploads/ ← NOVO
│   ├── images/
│   ├── videos/
│   └── audio/
│
└── package.json
```

---

## 📋 Checklist de Implementação

### Fase 1: Foundation (Autenticação)
- [ ] Instalar dependências (bcryptjs, jsonwebtoken, multer)
- [ ] Criar modelo User
- [ ] Implementar middleware auth.ts (JWT)
- [ ] Criar auth.controller.ts (register, login, refresh)
- [ ] Criar auth.routes.ts
- [ ] Testar autenticação

### Fase 2: Content Types (Articles como exemplo)
- [ ] Criar modelo BaseContent
- [ ] Criar modelo Article
- [ ] Criar article.controller.ts (CRUD)
- [ ] Criar article.routes.ts
- [ ] Testar CRUD de artigos
- [ ] Replicar para Videos, Courses, Lives, Podcasts, Books

### Fase 3: Ratings & Comments
- [ ] Criar modelo Rating
- [ ] Criar modelo Comment
- [ ] Criar rating.controller.ts
- [ ] Criar comment.controller.ts
- [ ] Criar rotas
- [ ] Testar sistema de ratings/comments

### Fase 4: Social Features
- [ ] Criar modelos Follow, Favorite, Notification
- [ ] Criar social.controller.ts
- [ ] Criar social.routes.ts
- [ ] Implementar lógica de follow/unfollow
- [ ] Testar features sociais

### Fase 5: Upload de Ficheiros
- [ ] Configurar multer
- [ ] Criar upload.controller.ts
- [ ] Criar rotas de upload
- [ ] Testar upload de imagens/vídeos/áudio

### Fase 6: Admin
- [ ] Criar middleware adminOnly
- [ ] Criar admin.controller.ts
- [ ] Criar admin.routes.ts
- [ ] Implementar endpoints de gestão
- [ ] Testar acesso admin

### Fase 7: Integração Frontend
- [ ] Conectar frontend com API real
- [ ] Remover mock data
- [ ] Testar fluxo completo
- [ ] Ajustar tipos e interfaces

---

## 🔧 Variáveis de Ambiente

**Ficheiro**: `.env`
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/finhub

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Upload
MAX_FILE_SIZE_IMAGE=5242880
MAX_FILE_SIZE_VIDEO=104857600
MAX_FILE_SIZE_AUDIO=52428800

# CORS
FRONTEND_URL=http://localhost:3000

# Redis (opcional, para cache)
REDIS_URL=redis://localhost:6379
```

---

## 🚀 Próximos Passos

### 1. Decidir Ordem de Implementação
Sugestão:
1. **Fase 1** (Auth) - CRÍTICO
2. **Fase 2** (Articles apenas) - Testar pattern
3. **Fase 3** (Ratings/Comments) - Testar integração
4. **Fase 2 completa** (Todos os tipos)
5. **Fase 4** (Social)
6. **Fase 5** (Upload)
7. **Fase 6** (Admin)

### 2. Validar MongoDB
- Verificar se BD está a funcionar
- Criar/atualizar schemas
- Testar conexão

### 3. Começar Implementação
Começamos pela **Fase 1 (Auth)**?

---

## 💡 Notas Importantes

### Segurança
- Usar bcrypt para passwords (salt rounds: 10)
- JWT com expiração curta (7 dias)
- Refresh token com expiração longa (30 dias)
- Rate limiting em rotas sensíveis
- Validação de inputs (express-validator)

### Performance
- Indexar campos: email, username, slug
- Paginação em todas as listas
- Cache com Redis (opcional)
- Lazy loading de relações

### Testing
- Testar cada endpoint com Postman/Insomnia
- Criar collection de testes
- Validar permissões (visitor vs creator vs admin)

---

**Status**: 📝 **PLANO CRIADO**
**Próximo**: Decidir ordem de implementação e começar Fase 1 (Auth)
