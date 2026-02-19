import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryOption {
  label: string
  value: string
}

export interface PageHeroProps {
  title: string
  subtitle: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearch?: (term: string) => void
  backgroundImage?: string
  categories?: CategoryOption[]
  activeCategory?: string
  onCategoryChange?: (value: string) => void
  compact?: boolean
  children?: React.ReactNode
}

export function PageHero({
  title,
  subtitle,
  searchPlaceholder = 'Pesquisar...',
  searchValue,
  onSearchChange,
  onSearch,
  backgroundImage,
  categories,
  activeCategory,
  onCategoryChange,
  compact = false,
  children,
}: PageHeroProps) {
  const [localSearch, setLocalSearch] = useState('')
  const search = searchValue ?? localSearch
  const setSearch = onSearchChange ?? setLocalSearch

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch?.(search)
  }

  return (
    <section className={cn('page-hero', compact && 'page-hero--compact')}>
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      )}
      <div className="page-hero__gradient" />

      <div className="page-hero__content">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg">{subtitle}</p>

        {onSearch && (
          <form onSubmit={handleSubmit} className="page-hero__search">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-11 pr-4"
              />
            </div>
          </form>
        )}

        {categories && categories.length > 0 && (
          <div className="page-hero__categories">
            <button
              type="button"
              onClick={() => onCategoryChange?.('')}
              className={cn(
                'filter-bar__pill',
                (!activeCategory || activeCategory === '') && 'filter-bar__pill--active',
              )}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => onCategoryChange?.(cat.value)}
                className={cn(
                  'filter-bar__pill',
                  activeCategory === cat.value && 'filter-bar__pill--active',
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  )
}
