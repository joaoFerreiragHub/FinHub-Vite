# 🎓 HUB - Sistema de Conteúdo Universal

O HUB é o sistema central de conteúdo educativo e informativo da plataforma FinHub.

---

## 🏗️ Arquitetura Genérica

Todo o sistema foi construído com uma **arquitetura genérica** que permite adicionar novos tipos de conteúdo facilmente.

### **BaseContent Interface**

Todos os tipos de conteúdo (Articles, Courses, Videos, etc.) **estendem** `BaseContent`:

```typescript
interface BaseContent {
  // Identificação
  id: string
  type: ContentType
  slug: string

  // Conteúdo
  title: string
  description: string
  coverImage?: string

  // Autoria
  creator: User
  creatorId: string

  // Categorização
  category: ContentCategory
  tags: string[]

  // Métricas
  viewCount: number
  likeCount: number
  averageRating: number
  commentCount: number

  // Controle de acesso
  requiredRole: UserRole
  isPremium: boolean

  // Timestamps
  createdAt: string
  publishedAt?: string
}
```

---

## 📦 Componentes Genéricos

### **1. ContentCard** ⭐

Card universal que se adapta a qualquer tipo de conteúdo:

```tsx
import { ContentCard } from '@/features/hub'

// Funciona com Article, Course, Video, etc.
<ContentCard
  content={article}
  variant="featured"
  showRating
  showMeta
/>
```

**Features**:
- ✅ Adapta-se ao tipo automaticamente
- ✅ Mostra badge premium se necessário
- ✅ Verifica permissões e exibe lock
- ✅ 3 variantes: default, compact, featured
- ✅ Hover effects

### **2. ContentList**

Lista genérica com paginação:

```tsx
import { ContentList } from '@/features/hub'

<ContentList
  items={mixedContent} // Pode ser array de diferentes tipos!
  variant="grid"
  columns={3}
  hasMore={hasMore}
  onLoadMore={loadMore}
/>
```

**Features**:
- ✅ 3 layouts: grid, list, masonry
- ✅ Loading skeletons
- ✅ Empty state
- ✅ Load more pagination

### **3. ContentMeta**

Metadata comum (creator, date, views, comments):

```tsx
import { ContentMeta } from '@/features/hub'

<ContentMeta
  content={content}
  showAvatar
  size="md"
/>
```

### **4. ContentActions**

Ações comuns (like, favorite, share):

```tsx
import { ContentActions } from '@/features/hub'

<ContentActions
  contentId={id}
  isLiked={userHasLiked}
  likeCount={42}
  onLike={handleLike}
  onShare={handleShare}
/>
```

**Features**:
- ✅ Optimistic updates
- ✅ Web Share API integration
- ✅ Fallback para clipboard
- ✅ Verificação de permissões

---

## ⭐ Sistema de Ratings Universal

Sistema completo de avaliações que funciona com **qualquer** tipo de conteúdo.

### **Componentes**

#### **RatingStars**
```tsx
import { RatingStars } from '@/features/hub'

// Read-only
<RatingStars rating={4.5} showCount count={120} />

// Interactive
<RatingStars
  rating={userRating}
  interactive
  onChange={setUserRating}
/>
```

#### **RatingForm**
```tsx
import { RatingForm } from '@/features/hub'

<RatingForm
  targetType={ContentType.ARTICLE}
  targetId="123"
  onSubmit={handleSubmitRating}
/>
```

#### **RatingDistribution**
```tsx
import { RatingDistribution } from '@/features/hub'

<RatingDistribution stats={ratingStats} />
```

Mostra:
- Rating médio (grande)
- Distribuição por estrelas (barras)
- Percentagens
- Total de ratings

#### **RatingList**
```tsx
import { RatingList } from '@/features/hub'

<RatingList
  response={ratingListResponse}
  onLoadMore={loadMore}
  sortBy="recent"
  onSortChange={setSortBy}
/>
```

---

## 💬 Sistema de Comments Universal

Sistema completo de comentários com **threading** (comentários aninhados).

### **Componentes**

#### **CommentForm**
```tsx
import { CommentForm } from '@/features/hub'

// Comment principal
<CommentForm
  targetType={ContentType.ARTICLE}
  targetId="123"
  onSubmit={handleComment}
/>

// Reply
<CommentForm
  targetType={ContentType.ARTICLE}
  targetId="123"
  parentCommentId="comment-456"
  onSubmit={handleReply}
  compact
/>
```

#### **CommentCard**
```tsx
import { CommentCard } from '@/features/hub'

<CommentCard
  comment={comment}
  allowReply
  showReplies
  onReply={handleReply}
  onLike={handleLike}
/>
```

**Features**:
- ✅ Threading até 3 níveis
- ✅ Inline editing
- ✅ Likes otimistas
- ✅ Pinned comments
- ✅ Deleted state

#### **CommentSection** (All-in-one)
```tsx
import { CommentSection } from '@/features/hub'

<CommentSection
  targetType={ContentType.ARTICLE}
  targetId="123"
  response={commentsResponse}
  onSubmitComment={handleSubmit}
  onReplyComment={handleReply}
  onEditComment={handleEdit}
  onDeleteComment={handleDelete}
  onLikeComment={handleLike}
  sortBy="recent"
  onSortChange={setSortBy}
/>
```

Inclui tudo:
- Form de novo comment
- Lista de comments
- Threading automático
- Sorting (recent, popular, oldest)
- Load more pagination

---

## 🎯 Como Adicionar Novo Tipo de Conteúdo

### **Passo 1: Criar interface específica**

```typescript
// src/features/hub/types/article.ts
import { BaseContent } from './base'

export interface Article extends BaseContent {
  // Campos específicos de Article
  content: string // HTML ou Markdown
  readTime: number // minutos
  tableOfContents?: string[]
}
```

### **Passo 2: Usar componentes genéricos**

```tsx
// src/features/hub/articles/components/ArticleCard.tsx
import { ContentCard } from '@/features/hub'

export function ArticleCard({ article }: { article: Article }) {
  return (
    <ContentCard
      content={article} // BaseContent fields
      variant="default"
      showRating
    />
  )
}
```

### **Passo 3: Especializar quando necessário**

```tsx
// src/features/hub/articles/pages/ArticleDetail.tsx
export function ArticleDetail() {
  return (
    <div>
      {/* Content genérico */}
      <ContentMeta content={article} showAvatar />
      <ContentActions contentId={article.id} />

      {/* Content específico de Article */}
      <div dangerouslySetInnerHTML={{ __html: article.content }} />

      {/* Ratings e Comments genéricos */}
      <RatingSection />
      <CommentSection />
    </div>
  )
}
```

---

## 📊 Tipos de Conteúdo Suportados

```typescript
enum ContentType {
  ARTICLE = 'article',     // ✅ Próximo a implementar
  COURSE = 'course',       // 🔜 Futuro
  VIDEO = 'video',         // 🔜 Futuro
  EVENT = 'event',         // 🔜 Futuro
  BOOK = 'book',           // 🔜 Futuro
  PODCAST = 'podcast',     // 🔜 Futuro
  NEWS = 'news',           // ✅ Já existe (integrar)
}
```

---

## 🔑 Categorias

```typescript
enum ContentCategory {
  // Finanças Pessoais
  PERSONAL_FINANCE = 'personal_finance',
  BUDGETING = 'budgeting',
  SAVING = 'saving',
  DEBT = 'debt',

  // Investimentos
  STOCKS = 'stocks',
  CRYPTO = 'crypto',
  REAL_ESTATE = 'real_estate',
  FUNDS = 'funds',

  // Educação
  BASICS = 'basics',
  ADVANCED = 'advanced',
  TRENDS = 'trends',

  // Outros
  NEWS = 'news',
  TOOLS = 'tools',
  LIFESTYLE = 'lifestyle',
}
```

---

## 🎨 Exemplos Práticos

### **Exemplo 1: Mixed Content Feed**

```tsx
import { ContentList } from '@/features/hub'

// Array com diferentes tipos!
const mixedContent: BaseContent[] = [
  article1,    // Article
  course1,     // Course
  video1,      // Video
  article2,    // Article
]

<ContentList items={mixedContent} variant="grid" columns={3} />
```

O `ContentCard` adapta-se automaticamente a cada tipo! 🎉

### **Exemplo 2: Article com Tudo**

```tsx
import {
  ContentMeta,
  ContentActions,
  RatingDistribution,
  RatingList,
  RatingForm,
  CommentSection,
} from '@/features/hub'

export function ArticleDetailPage() {
  return (
    <article>
      {/* Header */}
      <h1>{article.title}</h1>
      <ContentMeta content={article} showAvatar />

      {/* Article content */}
      <div>{article.content}</div>

      {/* Actions */}
      <ContentActions contentId={article.id} />

      {/* Ratings */}
      <section>
        <RatingDistribution stats={ratingStats} />
        <RatingForm targetType={ContentType.ARTICLE} targetId={article.id} />
        <RatingList response={ratingsResponse} />
      </section>

      {/* Comments */}
      <CommentSection
        targetType={ContentType.ARTICLE}
        targetId={article.id}
        response={commentsResponse}
      />
    </article>
  )
}
```

### **Exemplo 3: Creator Dashboard - Mixed Content**

```tsx
const creatorContent = await fetchCreatorContent(creatorId) // Articles + Courses + Videos

<ContentList
  items={creatorContent}
  variant="list"
  cardProps={{
    showRating: true,
    showMeta: true,
  }}
/>
```

---

## ✅ O que já está pronto

- [x] **BaseContent** interface genérica
- [x] **ContentType** enum com 7 tipos
- [x] **ContentCategory** com 12 categorias
- [x] **ContentCard** genérico com 3 variantes
- [x] **ContentList** com grid/list/masonry
- [x] **ContentMeta** para metadata
- [x] **ContentActions** (like, favorite, share)
- [x] **RatingStars** (read-only + interactive)
- [x] **RatingForm** para criar/editar
- [x] **RatingCard** para exibir individual
- [x] **RatingDistribution** com gráfico
- [x] **RatingList** com paginação
- [x] **CommentForm** para criar/editar/reply
- [x] **CommentCard** com threading
- [x] **CommentSection** all-in-one

---

## 🚀 Próximos Passos

1. ✅ **Articles** (implementar tipo específico completo)
   - ArticleDetail page
   - ArticleList page
   - CreateArticle form (creators)
   - Article filters & search

2. 🔜 **Courses** (adicionar módulos e progresso)
3. 🔜 **Videos** (player integration)
4. 🔜 **Events** (calendar integration)

---

## 💡 Benefícios da Arquitetura Genérica

1. **DRY** - Zero duplicação de código
2. **Consistência** - Mesma UX para todos os tipos
3. **Escalável** - Adicionar novo tipo = criar apenas campos específicos
4. **Type-safe** - TypeScript garante correctness
5. **Testável** - Componentes genéricos testados uma vez
6. **Mantível** - Fix em ContentCard afeta todos os tipos

---

**Status**: ✅ **Infraestrutura genérica completa**
**Próximo**: Implementar Articles como primeiro tipo específico
