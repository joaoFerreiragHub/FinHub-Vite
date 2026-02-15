import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { ContentType } from '@/features/hub/types'
import { useFavorites } from '../hooks/useSocial'
import type { FavoriteItem } from '../types'

const typeFilters = [
  { value: 'all', label: 'Todos' },
  { value: ContentType.ARTICLE, label: 'Artigos' },
  { value: ContentType.COURSE, label: 'Cursos' },
  { value: ContentType.VIDEO, label: 'Videos' },
  { value: ContentType.EVENT, label: 'Eventos' },
  { value: ContentType.BOOK, label: 'Livros' },
  { value: ContentType.PODCAST, label: 'Podcasts' },
]

export function FavoritesPage() {
  const [selectedType, setSelectedType] = useState<string>('all')

  const queryType = selectedType === 'all' ? undefined : (selectedType as ContentType)
  const { data, isLoading } = useFavorites(queryType)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Favoritos</h1>
        <p className="mt-1 text-muted-foreground">Conteudos que guardaste para ver mais tarde.</p>
      </div>

      {/* Type filters */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="flex-wrap">
          {typeFilters.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState selectedType={selectedType} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <FavoriteCard key={item.contentId} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function FavoriteCard({ item }: { item: FavoriteItem }) {
  const contentTypeLabel: Record<ContentType, string> = {
    [ContentType.ARTICLE]: 'Artigo',
    [ContentType.COURSE]: 'Curso',
    [ContentType.VIDEO]: 'Video',
    [ContentType.EVENT]: 'Evento',
    [ContentType.BOOK]: 'Livro',
    [ContentType.PODCAST]: 'Podcast',
    [ContentType.NEWS]: 'Noticia',
  }

  return (
    <div className="group rounded-lg border border-border bg-card transition-colors hover:border-primary/30">
      {item.coverImage ? (
        <img src={item.coverImage} alt="" className="h-40 w-full rounded-t-lg object-cover" />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-t-lg bg-muted">
          <Bookmark className="h-10 w-10 text-muted-foreground/30" />
        </div>
      )}
      <div className="p-4">
        <span className="text-[10px] font-medium uppercase text-muted-foreground">
          {contentTypeLabel[item.contentType]}
        </span>
        <h3 className="mt-1 text-sm font-medium line-clamp-2 group-hover:text-primary">
          {item.title}
        </h3>
        {item.creatorName && (
          <p className="mt-1 text-xs text-muted-foreground">por {item.creatorName}</p>
        )}
        <p className="mt-2 text-[10px] text-muted-foreground">
          Guardado em{' '}
          {new Date(item.favoritedAt).toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}

function EmptyState({ selectedType }: { selectedType: string }) {
  const typeLabel = typeFilters.find((f) => f.value === selectedType)?.label ?? 'conteudos'

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
      <Bookmark className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium">Sem favoritos</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {selectedType === 'all'
          ? 'Ainda nao guardaste nenhum conteudo.'
          : `Nao tens ${typeLabel.toLowerCase()} nos favoritos.`}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Usa o botao de guardar nos conteudos para os adicionar aqui.
      </p>
    </div>
  )
}
