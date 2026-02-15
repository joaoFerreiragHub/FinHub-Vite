# Fase 6: Implementacao de Tipos de Conteudo

**Data**: 2026-02-14
**Status**: COMPLETA

---

## Resumo

Implementacao completa dos tipos de conteudo Courses, Videos e News Integration, seguindo os padroes estabelecidos pelo Articles (referencia). Cada tipo inclui types, schema, hooks, service, paginas publicas, creator dashboard CRUD e rotas.

---

## Prioridade 1: Courses

### 1.1 Consolidacao de Types e Schema
- **`courses/types/course.ts`** — Substituido type legado por re-export de `index.ts` (compat para 5 ficheiros legados)
- **`courses/schemas/courseFormSchema.ts`** — Reescrito com Zod: title, description, excerpt, coverImage, category, tags, price, discountPrice, currency, level, language, prerequisites, learningOutcomes, requiredRole, isPremium, status

### 1.2 Hooks Atualizados
- **`courses/hooks/useCourses.ts`** — Adicionados `useDeleteCourse()` e `usePublishCourse()` (React Query mutations)

### 1.3 Paginas Publicas (HUB)
| Ficheiro | Descricao |
|---|---|
| `courses/pages/CourseListPage.tsx` | Lista com filtros (categoria, nivel, ordenacao, premium, gratuito), search, ContentList |
| `courses/pages/CourseDetailPage.tsx` | Detalhe com sidebar (preco, modulos, duracao, enrollment), modules accordion, paywall, ratings, comments |
| `courses/pages/index.ts` | Barrel export |

### 1.4 Creator Dashboard CRUD
| Ficheiro | Descricao |
|---|---|
| `dashboard/courses/components/CourseForm.tsx` | React Hook Form + Zod, modo create/edit, campos completos |
| `dashboard/courses/pages/ManageCourses.tsx` | Lista CRUD com stats, filtros, acoes (publicar, editar, eliminar) |
| `dashboard/courses/pages/CreateCourse.tsx` | Wrapper com dicas |
| `dashboard/courses/pages/EditCourse.tsx` | Wrapper com dados pre-preenchidos |
| `dashboard/courses/index.ts` | Barrel export |

### 1.5 Rotas
| Rota | Ficheiro |
|---|---|
| `/creators/dashboard/courses` | `pages/creators/dashboard/courses/index.page.tsx` |
| `/creators/dashboard/courses/create` | `pages/creators/dashboard/courses/create.page.tsx` |
| `/creators/dashboard/courses/:id/edit` | `pages/creators/dashboard/courses/@id/edit.page.tsx` |

### 1.6 Mock Data
- **`lib/mock/mockCourses.ts`** — Reescrito com 3 cursos completos usando BaseContent (modules, lessons, enrollment, pricing)

---

## Prioridade 2: Videos

### 2.1 Types Atualizados
- **`videos/types/index.ts`** — Adicionados `UpdateVideoDto`, expanded `CreateVideoDto` com excerpt, coverImage, quality, status, language

### 2.2 Service Expandido
- **`videos/services/videoService.ts`** — Adicionados: `getMyVideos`, `publishVideo`, `toggleLike`, `toggleFavorite`

### 2.3 Hooks (NOVO)
- **`videos/hooks/useVideos.ts`** — `useVideos`, `useVideo`, `useMyVideos`, `useCreateVideo`, `useUpdateVideo`, `useDeleteVideo`, `usePublishVideo`

### 2.4 Schema (NOVO)
- **`videos/schemas/videoFormSchema.ts`** — Zod schema completo para CreateVideoDto

### 2.5 Paginas Publicas (HUB)
| Ficheiro | Descricao |
|---|---|
| `videos/pages/VideoListPage.tsx` | Lista com filtros (categoria, ordenacao, premium), search, ContentList |
| `videos/pages/VideoDetailPage.tsx` | Player iframe, paywall, transcript toggle, sidebar (duracao, qualidade, views), ratings, comments |
| `videos/pages/index.ts` | Barrel export |

### 2.6 Creator Dashboard CRUD
| Ficheiro | Descricao |
|---|---|
| `dashboard/videos/components/VideoForm.tsx` | React Hook Form + Zod, campos: videoUrl, duration, quality, thumbnail, etc |
| `dashboard/videos/pages/ManageVideos.tsx` | Lista CRUD com stats, thumbnails, acoes |
| `dashboard/videos/pages/CreateVideo.tsx` | Wrapper |
| `dashboard/videos/pages/EditVideo.tsx` | Wrapper com dados pre-preenchidos |
| `dashboard/videos/index.ts` | Barrel export |

### 2.7 Rotas
| Rota | Ficheiro |
|---|---|
| `/creators/dashboard/videos` | `pages/creators/dashboard/videos/index.page.tsx` |
| `/creators/dashboard/videos/create` | `pages/creators/dashboard/videos/create.page.tsx` |
| `/creators/dashboard/videos/:id/edit` | `pages/creators/dashboard/videos/@id/edit.page.tsx` |

---

## Prioridade 3: News Integration

### 3.1 News Adapter
- **`news/utils/newsAdapter.ts`** — Interface `NewsContent extends BaseContent`, funcao `toBaseContent(article)` e `toBaseContentList(articles[])` para converter NewsArticle em BaseContent

### 3.2 Unified Feed Hook
- **`hub/hooks/useUnifiedFeed.ts`** — Combina Articles + News num unico feed ordenado por data. Usa React Query para news e articlesQuery. Configuravel: `includeArticles`, `includeNews`, `limit`

### 3.3 Hub Index Atualizado
- **`hub/index.ts`** — Exporta `useUnifiedFeed` e `useVisitedTopics`

---

## Metricas Fase 6

| Metrica | Valor |
|---|---|
| Ficheiros criados | 28 |
| Ficheiros atualizados | 8 |
| Paginas publicas | 4 (CourseList, CourseDetail, VideoList, VideoDetail) |
| Dashboard pages | 6 (Manage, Create, Edit x2) |
| Hooks criados | 14 (7 courses + 7 videos) |
| Schemas criados | 2 (courseForm, videoForm) |
| Rotas criadas | 6 |
| Barrel exports | 6 |

---

## Padroes Seguidos

- React Hook Form + Zod (formularios)
- React Query / TanStack Query (server state)
- ContentList + ContentCard (listas genericas)
- ContentMeta + ContentActions (metadata e acoes)
- RatingDistribution + RatingForm (avaliacoes)
- CommentSection (comentarios)
- usePaywall + usePermissions (acesso)
- DashboardLayout (dashboard creator)
- Barrel exports em todos os modulos
