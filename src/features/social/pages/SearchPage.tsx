import { useState, useEffect } from 'react'
import {
  Search,
  FileText,
  GraduationCap,
  Video,
  Calendar,
  BookOpen,
  Headphones,
  User,
} from 'lucide-react'
import { Input } from '@/components/ui'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { Badge } from '@/components/ui'
import { ContentType } from '@/features/hub/types'
import { useGlobalSearch } from '../hooks/useSocial'
import type { SearchResult } from '../types'

const typeIcons: Record<string, typeof FileText> = {
  [ContentType.ARTICLE]: FileText,
  [ContentType.COURSE]: GraduationCap,
  [ContentType.VIDEO]: Video,
  [ContentType.EVENT]: Calendar,
  [ContentType.BOOK]: BookOpen,
  [ContentType.PODCAST]: Headphones,
  creator: User,
}

const typeLabels: Record<string, string> = {
  all: 'Todos',
  [ContentType.ARTICLE]: 'Artigos',
  [ContentType.COURSE]: 'Cursos',
  [ContentType.VIDEO]: 'Videos',
  [ContentType.EVENT]: 'Eventos',
  [ContentType.BOOK]: 'Livros',
  [ContentType.PODCAST]: 'Podcasts',
  creator: 'Criadores',
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const queryType = selectedType === 'all' ? undefined : (selectedType as ContentType)
  const { data, isLoading } = useGlobalSearch(debouncedQuery, queryType)

  // Get initial query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      setQuery(q)
      setDebouncedQuery(q)
    }
  }, [])

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Pesquisar</h1>
        <p className="mt-1 text-muted-foreground">Encontra conteudos, criadores e muito mais.</p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar conteudos, criadores..."
          className="pl-11 text-lg h-12"
          autoFocus
        />
      </div>

      {/* Type filters */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="flex-wrap">
          {Object.entries(typeLabels).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Results */}
      {isLoading && debouncedQuery.length >= 2 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : debouncedQuery.length < 2 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">Pesquisa</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Escreve pelo menos 2 caracteres para pesquisar.
          </p>
        </div>
      ) : !data || data.results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">Nenhum resultado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Nenhum resultado para &quot;{debouncedQuery}&quot;.
            {selectedType !== 'all' && ' Tenta remover o filtro de tipo.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {data.total} resultado{data.total !== 1 ? 's' : ''} para &quot;{data.query}&quot;
          </p>
          <div className="space-y-2">
            {data.results.map((result) => (
              <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const Icon = typeIcons[result.type] ?? FileText
  const typeLabel = typeLabels[result.type] ?? result.type

  return (
    <a
      href={result.url}
      className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent"
    >
      {result.coverImage ? (
        <img
          src={result.coverImage}
          alt=""
          className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium line-clamp-1">{result.title}</h3>
          <Badge variant="outline" className="text-[10px] flex-shrink-0">
            {typeLabel}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{result.description}</p>
      </div>
    </a>
  )
}
