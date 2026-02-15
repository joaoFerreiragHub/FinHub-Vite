# Fase 7: Events/Lives, Podcasts & Books

## Resumo

Implementacao completa dos 3 tipos de conteudo restantes: **Events/Lives**, **Podcasts** e **Books**, seguindo os padroes estabelecidos nas fases anteriores (BaseContent, React Query, React Hook Form + Zod, paginas publicas + creator dashboard CRUD).

## Estrutura Criada

### Events/Lives

```
src/features/hub/lives/
  types/index.ts          # LiveEvent extends BaseContent + DTOs
  services/liveService.ts # CRUD + register/unregister + actions
  hooks/useLives.ts       # 8 hooks (React Query)
  schemas/liveFormSchema.ts # Zod schema
  pages/
    LiveListPage.tsx      # Lista publica com filtros
    LiveDetailPage.tsx    # Detalhe com sidebar, inscricao, countdown
    index.ts
  index.ts                # Barrel export

src/features/creators/dashboard/lives/
  components/LiveForm.tsx # React Hook Form + Zod
  pages/
    ManageLives.tsx       # CRUD com stats (total, proximos, passados, inscritos)
    CreateLive.tsx
    EditLive.tsx
  index.ts

src/pages/creators/dashboard/lives/
  index.page.tsx          # ManageLives
  create.page.tsx         # CreateLive
  @id/edit.page.tsx       # EditLive
```

**Campos especificos do LiveEvent:**
- `eventType`: online | presencial | hybrid
- `startDate`, `endDate`, `startTime`, `endTime`, `timezone`
- `address` (presencial), `meetingUrl` (online)
- `maxAttendees`, `attendeeCount`, `isRegistered`
- `registrationDeadline`, `price`, `currency`

### Podcasts

```
src/features/hub/podcasts/
  types/index.ts          # Podcast extends BaseContent + PodcastEpisode + DTOs
  services/podcastService.ts # CRUD podcasts + CRUD episodios + subscribe
  hooks/usePodcasts.ts    # 7 hooks (React Query)
  schemas/podcastFormSchema.ts # Zod schemas (podcast + episodio)
  pages/
    PodcastListPage.tsx   # Lista publica com filtros
    PodcastDetailPage.tsx # Detalhe com lista episodios, audio player, show notes
    index.ts
  index.ts

src/features/creators/dashboard/podcasts/
  components/PodcastForm.tsx
  pages/
    ManagePodcasts.tsx    # CRUD com stats (total, publicados, episodios, subscritores)
    CreatePodcast.tsx
    EditPodcast.tsx
  index.ts

src/pages/creators/dashboard/podcasts/
  index.page.tsx
  create.page.tsx
  @id/edit.page.tsx
```

**Campos especificos do Podcast:**
- `episodes: PodcastEpisode[]`, `totalEpisodes`, `totalDuration`
- `frequency`: daily | weekly | biweekly | monthly
- `rssFeedUrl`, `spotifyUrl`, `applePodcastsUrl`
- `subscriberCount`

**PodcastEpisode:**
- `id`, `podcastId`, `title`, `description`, `order`
- `audioUrl`, `duration` (segundos), `publishedAt`, `isPublished`
- `transcript`, `showNotes`

### Books

```
src/features/hub/books/
  types/index.ts          # Book extends BaseContent + DTOs
  services/bookService.ts # CRUD + actions
  hooks/useBooks.ts       # 7 hooks (React Query)
  schemas/bookFormSchema.ts # Zod schema
  pages/
    BookListPage.tsx      # Lista publica com filtros
    BookDetailPage.tsx    # Detalhe com capa, resumo, frases-chave, compra
    index.ts
  index.ts

src/features/creators/dashboard/books/
  components/BookForm.tsx
  pages/
    ManageBooks.tsx       # CRUD com stats (total, publicados, rascunhos)
    CreateBook.tsx
    EditBook.tsx
  index.ts

src/pages/creators/dashboard/books/
  index.page.tsx
  create.page.tsx
  @id/edit.page.tsx
```

**Campos especificos do Book:**
- `author` (autor do livro), `isbn`, `publisher`, `publishYear`, `pages`
- `genres: string[]`, `keyPhrases: string[]`
- `purchaseUrl`, `pdfUrl`

## Legacy Types Actualizados

Os tipos antigos foram convertidos em re-exports com `@deprecated`:
- `src/features/hub/types/liveEvent.ts` -> re-export de `lives/types`
- `src/features/hub/types/podcast.ts` -> re-export de `podcasts/types`
- `src/features/hub/types/podcastEpisode.ts` -> re-export de `podcasts/types`
- `src/features/hub/books/types/book.ts` -> re-export de `books/types`

## Mock Data Actualizada

- `src/lib/mock/mockLiveEvents.ts` - 3 eventos (online, presencial, Q&A) com BaseContent completo
- `src/lib/mock/mockPodcasts.ts` - 2 podcasts com episodios e dados BaseContent
- `src/lib/mock/books.ts` - 3 livros classicos de financas com BaseContent

## Padroes Seguidos

Todos os tipos seguem o padrao estabelecido nas fases anteriores:
1. **Types**: Estendem `BaseContent` com campos especificos
2. **Service**: CRUD + actions (view, like, favorite) via `apiClient`
3. **Hooks**: React Query (useQuery + useMutation) com invalidacao de cache
4. **Schema**: Zod com `z.coerce.number()` para campos numericos de formulario
5. **Public Pages**: ListPage (filtros + ContentList) + DetailPage (sidebar + ratings + comments)
6. **Dashboard CRUD**: ManagePage (stats + lista) + Form (React Hook Form + Zod) + Create/Edit wrappers
7. **Routes**: `*.page.tsx` re-exportando componentes

## Ficheiros Criados/Modificados

| Tipo | Ficheiros Criados | Ficheiros Modificados |
|---|---|---|
| Events/Lives | 15 | 2 (legacy type, mock) |
| Podcasts | 14 | 3 (legacy types x2, mock) |
| Books | 14 | 2 (legacy type, mock) |
| **Total** | **43** | **7** |
