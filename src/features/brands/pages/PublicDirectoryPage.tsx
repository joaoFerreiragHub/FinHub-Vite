import { type FormEvent, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { PageHero } from '@/components/public'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { BrandCard } from '@/features/brands/components/BrandCard'
import { usePublicDirectories } from '@/features/brands/hooks/usePublicDirectories'
import type { PublicDirectoryVertical } from '@/features/brands/services/publicDirectoriesService'

type CategoryFilter = 'all' | 'broker' | 'insurance' | 'fintech' | 'bank'

const CATEGORY_OPTIONS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'broker', label: 'Corretoras' },
  { value: 'insurance', label: 'Seguradoras' },
  { value: 'fintech', label: 'Plataformas' },
  { value: 'bank', label: 'Bancos' },
]

const LIST_LIMIT = 24

const numberFormatter = new Intl.NumberFormat('pt-PT')
const formatCount = (value: number) => numberFormatter.format(value)

const toVertical = (value: CategoryFilter): PublicDirectoryVertical | undefined =>
  value === 'all' ? undefined : value

export default function PublicDirectoryPage() {
  const [searchInput, setSearchInput] = useState('')
  const [countryInput, setCountryInput] = useState('')
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')

  const query = useMemo(
    () => ({
      verticalType: toVertical(category),
      country: country || undefined,
      search: search || undefined,
      sort: 'featured' as const,
      limit: LIST_LIMIT,
      page: 1,
    }),
    [category, country, search],
  )

  const directoriesQuery = usePublicDirectories(query)
  const items = directoriesQuery.data?.items ?? []
  const total = directoriesQuery.data?.pagination.total ?? items.length

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearch(searchInput.trim())
    setCountry(countryInput.trim())
  }

  const clearFilters = () => {
    setSearchInput('')
    setCountryInput('')
    setSearch('')
    setCountry('')
    setCategory('all')
  }

  const hasFilters = Boolean(search || country || category !== 'all')

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Marcas e entidades financeiras"
        subtitle="Pesquisa por nome, filtra por categoria e pais, e compara entidades com dados publicos e ratings da comunidade."
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80"
      />

      <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center gap-3">
          <Badge variant="secondary">{formatCount(total)} marcas encontradas</Badge>
        </header>

        <Card className="border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>Categoria, pais e pesquisa por nome/descricao.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
              <Select value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={countryInput}
                onChange={(event) => setCountryInput(event.target.value)}
                placeholder="Pais (ex: Portugal)"
                aria-label="Filtrar por pais"
              />

              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Pesquisar marca, categoria, descricao..."
                aria-label="Pesquisar marca"
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Search className="h-4 w-4" />
                  Aplicar
                </Button>
                {hasFilters ? (
                  <Button type="button" variant="ghost" onClick={clearFilters}>
                    Limpar
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        {directoriesQuery.isLoading ? (
          <LoadingSkeleton variant="cards" count={6} columns={3} />
        ) : null}

        {directoriesQuery.isError ? (
          <ErrorState message="Nao foi possivel carregar o diretorio." />
        ) : null}

        {!directoriesQuery.isLoading && !directoriesQuery.isError ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3">
                <EmptyState
                  title="Sem resultados"
                  description="Nao foram encontradas marcas com os filtros selecionados."
                />
              </div>
            ) : (
              items.map((item) => <BrandCard key={item.id} item={item} />)
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}
