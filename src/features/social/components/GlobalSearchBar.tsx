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
import { Dialog, DialogContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { ContentType } from '@/features/hub/types'
import { useGlobalSearch } from '../hooks/useSocial'
import type { SearchResult } from '../types'

interface GlobalSearchBarProps {
  onNavigate?: (url: string) => void
}

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
  [ContentType.ARTICLE]: 'Artigos',
  [ContentType.COURSE]: 'Cursos',
  [ContentType.VIDEO]: 'Videos',
  [ContentType.EVENT]: 'Eventos',
  [ContentType.BOOK]: 'Livros',
  [ContentType.PODCAST]: 'Podcasts',
  creator: 'Criadores',
}

export function GlobalSearchBar({ onNavigate }: GlobalSearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { data, isLoading } = useGlobalSearch(debouncedQuery)

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    onNavigate?.(result.url)
  }

  // Group results by type
  const groupedResults = data?.results.reduce<Record<string, SearchResult[]>>((acc, result) => {
    const key = result.type
    if (!acc[key]) acc[key] = []
    acc[key].push(result)
    return acc
  }, {})

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="outline"
        className="relative w-full max-w-sm justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">Pesquisar...</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          Ctrl+K
        </kbd>
      </Button>

      {/* Search dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
          {/* Search input */}
          <div className="flex items-center border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar conteudos, criadores..."
              className="flex-1 bg-transparent py-3 pl-3 pr-4 text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading && debouncedQuery.length >= 2 && (
              <p className="py-6 text-center text-sm text-muted-foreground">A pesquisar...</p>
            )}

            {!isLoading && debouncedQuery.length >= 2 && (!data || data.results.length === 0) && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhum resultado para &quot;{debouncedQuery}&quot;
              </p>
            )}

            {!isLoading && debouncedQuery.length < 2 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Escreve pelo menos 2 caracteres para pesquisar
              </p>
            )}

            {groupedResults &&
              Object.entries(groupedResults).map(([type, results]) => {
                const Icon = typeIcons[type] ?? FileText
                const label = typeLabels[type] ?? type

                return (
                  <div key={type} className="mb-2">
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        {label}
                      </span>
                    </div>
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
                      >
                        {result.coverImage && (
                          <img
                            src={result.coverImage}
                            alt=""
                            className="h-10 w-10 flex-shrink-0 rounded object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{result.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {result.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
