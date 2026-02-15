// src/stores/news/useNewsFilters.ts - Store de Sistema de Filtros

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { NewsArticle, NewsFilters } from '~/features/hub/news/types/news'

// ===== INTERFACES =====
export interface FilterHistoryItem {
  id: string
  filters: NewsFilters
  appliedAt: string
  resultCount: number
  label?: string
}

export interface FilterSuggestion {
  type: 'category' | 'source' | 'searchTerm'
  value: string
  count: number
  label: string
}

export interface FilterStats {
  totalApplied: number
  activeFiltersCount: number
  mostUsedCategory: string | null
  mostUsedSource: string | null
  avgResultCount: number
}

// ✅ NOVO: Configuração das fontes disponíveis
export const availableSources = [
  {
    value: 'all',
    label: 'Todas as Fontes',
    icon: '🌐',
    description: 'Mostrar notícias de todas as fontes',
  },
  {
    value: 'yahoo',
    label: 'Yahoo Finance',
    icon: '📈',
    description: 'Yahoo Finance - Notícias gratuitas e confiáveis',
  },
  {
    value: 'fmp',
    label: 'Financial Modeling Prep',
    icon: '💼',
    description: 'FMP - API Premium de dados financeiros',
  },
  {
    value: 'newsapi',
    label: 'News API',
    icon: '📰',
    description: 'News API - Agregador global de notícias',
  },
  {
    value: 'alphavantage',
    label: 'Alpha Vantage',
    icon: '📊',
    description: 'Alpha Vantage - Dados com análise de sentimento',
  },
  {
    value: 'polygon',
    label: 'Polygon',
    icon: '🔺',
    description: 'Polygon.io - Dados de mercado premium',
  },
]

// ✅ NOVO: Configuração das categorias disponíveis
export const availableCategories = [
  { value: 'all', label: 'Todas as Categorias', icon: '📂' },
  { value: 'market', label: 'Mercados', icon: '📈' },
  { value: 'earnings', label: 'Resultados', icon: '💰' },
  { value: 'economy', label: 'Economia', icon: '🏦' },
  { value: 'crypto', label: 'Criptomoedas', icon: '₿' },
  { value: 'general', label: 'Geral', icon: '📰' },
  { value: 'forex', label: 'Câmbio', icon: '💱' },
]

// Interface do store
interface NewsFiltersStore {
  // === ESTADO ===
  filters: NewsFilters
  appliedFilters: NewsFilters // Filtros atualmente aplicados
  filterHistory: FilterHistoryItem[] // Histórico de filtros
  pendingFilters: NewsFilters // Filtros sendo editados (não aplicados)
  isFilterModalOpen: boolean // Para controlar UI de filtros avançados

  // === DADOS PARA SUGESTÕES ===
  availableCategories: string[]
  availableSources: string[]
  availableTags: string[]
  recentSearchTerms: string[]

  // === ACTIONS BÁSICAS ===
  setCategory: (category: string) => void
  setSearchTerm: (term: string) => void
  setSource: (source: string) => void // ✅ JÁ EXISTE NO SEU CÓDIGO
  setSentiment: (sentiment: string) => void
  setDateRange: (from: Date, to: Date) => void
  clearDateRange: () => void

  // === ACTIONS AVANÇADAS ===
  setFilters: (filters: Partial<NewsFilters>) => void
  setPendingFilters: (filters: Partial<NewsFilters>) => void
  applyPendingFilters: () => void
  clearPendingFilters: () => void

  // === GESTÃO DE FILTROS ===
  clearFilters: () => void
  clearAllFilters: () => void
  resetToDefaults: () => void
  applyFilters: (articles: NewsArticle[]) => NewsArticle[]

  // === HISTÓRICO ===
  saveToHistory: (resultCount: number, label?: string) => void
  loadFromHistory: (historyId: string) => void
  clearHistory: () => void
  removeFromHistory: (historyId: string) => void

  // === SUGESTÕES ===
  updateAvailableOptions: (articles: NewsArticle[]) => void
  getFilterSuggestions: () => FilterSuggestion[]
  addRecentSearchTerm: (term: string) => void

  // === COMPUTED GETTERS ===
  hasActiveFilters: () => boolean
  getActiveFilterCount: () => number
  getFilterSummary: () => string
  canApplyFilters: () => boolean

  // === UTILITIES ===
  toggleFilterModal: () => void
  getFilterStats: () => FilterStats
  exportFilters: () => string
  importFilters: (filtersJson: string) => boolean

  // ✅ NOVOS: Helpers para UI
  getSourceInfo: (sourceValue: string) => (typeof availableSources)[0] | null
  getCategoryInfo: (categoryValue: string) => (typeof availableCategories)[0] | null
}

// ===== CONSTANTS =====
const defaultFilters: NewsFilters = {
  category: 'all',
  searchTerm: '',
  source: undefined, // ✅ Alterado para undefined quando "all"
  dateRange: undefined,
  sentiment: undefined,
  tickers: undefined,
}

const MAX_HISTORY_ITEMS = 10
const MAX_RECENT_SEARCHES = 5

// ===== HELPERS =====

// Aplicar filtros aos artigos
const applyFiltersToArticles = (articles: NewsArticle[], filters: NewsFilters): NewsArticle[] => {
  console.log(`🔍 [Filters] Aplicando filtros a ${articles.length} artigos:`, filters)

  let filtered = articles

  // Filtro de categoria
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((article) => article.category === filters.category)
    console.log(
      `📂 [Filters] Após filtro categoria (${filters.category}): ${filtered.length} artigos`,
    )
  }

  // Filtro de pesquisa
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const searchLower = filters.searchTerm.toLowerCase().trim()
    filtered = filtered.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(searchLower)
      const summaryMatch = article.summary?.toLowerCase().includes(searchLower)
      const contentMatch = article.content?.toLowerCase().includes(searchLower)
      return titleMatch || summaryMatch || contentMatch
    })
    console.log(
      `🔎 [Filters] Após filtro pesquisa ("${filters.searchTerm}"): ${filtered.length} artigos`,
    )
  }

  // ✅ MELHORADO: Filtro de fonte com matching mais flexível
  if (filters.source && filters.source !== 'all') {
    filtered = filtered.filter((article) => {
      const articleSource = article.source.toLowerCase().trim()
      const filterSource = filters.source!.toLowerCase().trim()

      // Matching exato
      if (articleSource === filterSource) return true

      // Matching parcial para fontes conhecidas
      if (filterSource === 'yahoo' && articleSource.includes('yahoo')) return true
      if (
        filterSource === 'fmp' &&
        (articleSource.includes('fmp') || articleSource.includes('financial modeling'))
      )
        return true
      if (filterSource === 'newsapi' && articleSource.includes('newsapi')) return true
      if (filterSource === 'alphavantage' && articleSource.includes('alpha')) return true
      if (filterSource === 'polygon' && articleSource.includes('polygon')) return true

      return false
    })
    console.log(`📰 [Filters] Após filtro fonte (${filters.source}): ${filtered.length} artigos`)
  }

  // Filtro de sentimento
  if (filters.sentiment && filters.sentiment !== 'all') {
    filtered = filtered.filter((article) => article.sentiment === filters.sentiment)
    console.log(
      `😊 [Filters] Após filtro sentimento (${filters.sentiment}): ${filtered.length} artigos`,
    )
  }

  // Filtro de tickers
  if (filters.tickers && filters.tickers.length > 0) {
    filtered = filtered.filter((article) =>
      article.tickers?.some((ticker) =>
        filters.tickers!.some(
          (filterTicker) => ticker.toLowerCase() === filterTicker.toLowerCase(),
        ),
      ),
    )
    console.log(
      `💹 [Filters] Após filtro tickers (${filters.tickers.join(', ')}): ${filtered.length} artigos`,
    )
  }

  // Filtro de data
  if (filters.dateRange) {
    const { from, to } = filters.dateRange
    filtered = filtered.filter((article) => {
      const articleDate = new Date(article.publishedDate)
      const isAfterFrom = !from || articleDate >= from
      const isBeforeTo = !to || articleDate <= to
      return isAfterFrom && isBeforeTo
    })
    console.log(`📅 [Filters] Após filtro data: ${filtered.length} artigos`)
  }

  console.log(`✅ [Filters] Filtros aplicados: ${articles.length} → ${filtered.length} artigos`)
  return filtered
}

// Verificar se há filtros ativos
const hasActiveFilters = (filters: NewsFilters): boolean => {
  return !!(
    (filters.category && filters.category !== 'all') ||
    (filters.searchTerm && filters.searchTerm.trim()) ||
    (filters.source && filters.source !== 'all') || // ✅ Melhorado
    (filters.sentiment && filters.sentiment !== 'all') || // ✅ Melhorado
    (filters.tickers && filters.tickers.length > 0) ||
    filters.dateRange
  )
}

// Contar filtros ativos
const countActiveFilters = (filters: NewsFilters): number => {
  let count = 0
  if (filters.category && filters.category !== 'all') count++
  if (filters.searchTerm && filters.searchTerm.trim()) count++
  if (filters.source && filters.source !== 'all') count++ // ✅ Melhorado
  if (filters.sentiment && filters.sentiment !== 'all') count++ // ✅ Melhorado
  if (filters.tickers && filters.tickers.length > 0) count++
  if (filters.dateRange) count++
  return count
}

// ✅ MELHORADO: Criar resumo dos filtros com informações mais amigáveis
const createFilterSummary = (filters: NewsFilters): string => {
  const parts: string[] = []

  if (filters.category && filters.category !== 'all') {
    const categoryInfo = availableCategories.find((c) => c.value === filters.category)
    parts.push(`${categoryInfo?.icon || '📂'} ${categoryInfo?.label || filters.category}`)
  }

  if (filters.searchTerm && filters.searchTerm.trim()) {
    parts.push(`🔎 "${filters.searchTerm}"`)
  }

  if (filters.source && filters.source !== 'all') {
    const sourceInfo = availableSources.find((s) => s.value === filters.source)
    parts.push(`${sourceInfo?.icon || '📰'} ${sourceInfo?.label || filters.source}`)
  }

  if (filters.sentiment && filters.sentiment !== 'all') {
    const sentimentIcon =
      filters.sentiment === 'positive' ? '😊' : filters.sentiment === 'negative' ? '😞' : '😐'
    parts.push(`${sentimentIcon} ${filters.sentiment}`)
  }

  if (filters.tickers && filters.tickers.length > 0) {
    parts.push(`💹 ${filters.tickers.join(', ')}`)
  }

  if (filters.dateRange) {
    const { from, to } = filters.dateRange
    if (from && to) {
      parts.push(`📅 ${from.toLocaleDateString()} - ${to.toLocaleDateString()}`)
    } else if (from) {
      parts.push(`📅 a partir de ${from.toLocaleDateString()}`)
    } else if (to) {
      parts.push(`📅 até ${to.toLocaleDateString()}`)
    }
  }

  return parts.length > 0 ? parts.join(' • ') : 'Nenhum filtro ativo'
}

// Extrair opções disponíveis dos artigos
const extractAvailableOptions = (articles: NewsArticle[]) => {
  const categories = new Set<string>()
  const sources = new Set<string>()
  const tags = new Set<string>()

  articles.forEach((article) => {
    if (article.category) categories.add(article.category)
    if (article.source) sources.add(article.source)
    if (article.tags) {
      article.tags.forEach((tag) => tags.add(tag))
    }
  })

  return {
    categories: Array.from(categories).sort(),
    sources: Array.from(sources).sort(),
    tags: Array.from(tags).sort(),
  }
}

// ===== STORE PRINCIPAL =====
export const useNewsFilters = create<NewsFiltersStore>()(
  persist(
    (set, get) => ({
      // === ESTADO INICIAL ===
      filters: defaultFilters,
      appliedFilters: defaultFilters,
      filterHistory: [],
      pendingFilters: defaultFilters,
      isFilterModalOpen: false,

      // === DADOS PARA SUGESTÕES ===
      availableCategories: [],
      availableSources: [],
      availableTags: [],
      recentSearchTerms: [],

      // === ACTIONS BÁSICAS ===
      setCategory: (category: string) => {
        console.log(`📂 [Filters] Setting category: ${category}`)
        set((state) => ({
          filters: { ...state.filters, category },
          appliedFilters: { ...state.filters, category },
        }))
      },

      setSearchTerm: (term: string) => {
        console.log(`🔎 [Filters] Setting search term: "${term}"`)
        const trimmedTerm = term.trim()

        set((state) => ({
          filters: { ...state.filters, searchTerm: trimmedTerm },
          appliedFilters: { ...state.filters, searchTerm: trimmedTerm },
        }))

        // Adicionar aos termos recentes se não estiver vazio
        if (trimmedTerm) {
          get().addRecentSearchTerm(trimmedTerm)
        }
      },

      // ✅ MELHORADO: setSource com tratamento para 'all'
      setSource: (source: string) => {
        console.log(`📰 [Filters] Setting source: ${source}`)
        const normalizedSource = source === 'all' ? undefined : source

        set((state) => ({
          filters: { ...state.filters, source: normalizedSource },
          appliedFilters: { ...state.filters, source: normalizedSource },
        }))
      },

      setSentiment: (sentiment: string) => {
        console.log(`😊 [Filters] Setting sentiment: ${sentiment}`)
        const normalizedSentiment = sentiment === 'all' ? undefined : sentiment

        set((state) => ({
          filters: { ...state.filters, sentiment: normalizedSentiment },
          appliedFilters: { ...state.filters, sentiment: normalizedSentiment },
        }))
      },

      setDateRange: (from: Date, to: Date) => {
        console.log(`📅 [Filters] Setting date range: ${from.toISOString()} - ${to.toISOString()}`)
        set((state) => ({
          filters: { ...state.filters, dateRange: { from, to } },
          appliedFilters: { ...state.filters, dateRange: { from, to } },
        }))
      },

      clearDateRange: () => {
        console.log(`📅 [Filters] Clearing date range`)
        set((state) => ({
          filters: { ...state.filters, dateRange: undefined },
          appliedFilters: { ...state.filters, dateRange: undefined },
        }))
      },

      // === ACTIONS AVANÇADAS ===
      setFilters: (newFilters: Partial<NewsFilters>) => {
        console.log(`⚙️ [Filters] Setting multiple filters:`, newFilters)
        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters }
          return {
            filters: updatedFilters,
            appliedFilters: updatedFilters,
          }
        })
      },

      setPendingFilters: (newFilters: Partial<NewsFilters>) => {
        console.log(`⏳ [Filters] Setting pending filters:`, newFilters)
        set((state) => ({
          pendingFilters: { ...state.pendingFilters, ...newFilters },
        }))
      },

      applyPendingFilters: () => {
        console.log(`✅ [Filters] Applying pending filters`)
        set((state) => ({
          filters: { ...state.pendingFilters },
          appliedFilters: { ...state.pendingFilters },
        }))
      },

      clearPendingFilters: () => {
        console.log(`🧹 [Filters] Clearing pending filters`)
        set((state) => ({
          pendingFilters: { ...state.filters },
        }))
      },

      // === GESTÃO DE FILTROS ===
      clearFilters: () => {
        console.log(`🧹 [Filters] Clearing all filters`)
        set({
          filters: defaultFilters,
          appliedFilters: defaultFilters,
          pendingFilters: defaultFilters,
        })
      },

      clearAllFilters: () => {
        get().clearFilters()
        get().clearHistory()
        set({ recentSearchTerms: [] })
      },

      resetToDefaults: () => {
        console.log(`🔄 [Filters] Resetting to defaults`)
        get().clearFilters()
      },

      applyFilters: (articles: NewsArticle[]) => {
        const state = get()
        return applyFiltersToArticles(articles, state.appliedFilters)
      },

      // === HISTÓRICO ===
      saveToHistory: (resultCount: number, label?: string) => {
        const state = get()
        if (!hasActiveFilters(state.appliedFilters)) return

        const historyItem: FilterHistoryItem = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          filters: { ...state.appliedFilters },
          appliedAt: new Date().toISOString(),
          resultCount,
          label: label || createFilterSummary(state.appliedFilters),
        }

        set((state) => ({
          filterHistory: [historyItem, ...state.filterHistory.slice(0, MAX_HISTORY_ITEMS - 1)],
        }))

        console.log(`💾 [Filters] Saved to history: ${historyItem.label}`)
      },

      loadFromHistory: (historyId: string) => {
        const state = get()
        const historyItem = state.filterHistory.find((item) => item.id === historyId)

        if (historyItem) {
          console.log(`📂 [Filters] Loading from history: ${historyItem.label}`)
          set({
            filters: { ...historyItem.filters },
            appliedFilters: { ...historyItem.filters },
          })
        }
      },

      clearHistory: () => {
        console.log(`🧹 [Filters] Clearing filter history`)
        set({ filterHistory: [] })
      },

      removeFromHistory: (historyId: string) => {
        console.log(`🗑️ [Filters] Removing from history: ${historyId}`)
        set((state) => ({
          filterHistory: state.filterHistory.filter((item) => item.id !== historyId),
        }))
      },

      // === SUGESTÕES ===
      updateAvailableOptions: (articles: NewsArticle[]) => {
        console.log(`🔄 [Filters] Updating available options from ${articles.length} articles`)
        const options = extractAvailableOptions(articles)

        set({
          availableCategories: options.categories,
          availableSources: options.sources,
          availableTags: options.tags,
        })
      },

      getFilterSuggestions: (): FilterSuggestion[] => {
        const state = get()
        const suggestions: FilterSuggestion[] = []

        // Sugestões de categoria
        availableCategories.slice(1).forEach((category) => {
          // Skip 'all'
          suggestions.push({
            type: 'category',
            value: category.value,
            count: 0,
            label: `${category.icon} ${category.label}`,
          })
        })

        // Sugestões de fonte
        availableSources.slice(1).forEach((source) => {
          // Skip 'all'
          suggestions.push({
            type: 'source',
            value: source.value,
            count: 0,
            label: `${source.icon} ${source.label}`,
          })
        })

        // Sugestões de pesquisa recente
        state.recentSearchTerms.forEach((term) => {
          suggestions.push({
            type: 'searchTerm',
            value: term,
            count: 0,
            label: `🔎 "${term}"`,
          })
        })

        return suggestions
      },

      addRecentSearchTerm: (term: string) => {
        const trimmedTerm = term.trim()
        if (!trimmedTerm) return

        set((state) => {
          const updatedTerms = [
            trimmedTerm,
            ...state.recentSearchTerms.filter((t) => t !== trimmedTerm),
          ].slice(0, MAX_RECENT_SEARCHES)

          return { recentSearchTerms: updatedTerms }
        })
      },

      // === COMPUTED GETTERS ===
      hasActiveFilters: () => {
        const state = get()
        return hasActiveFilters(state.appliedFilters)
      },

      getActiveFilterCount: () => {
        const state = get()
        return countActiveFilters(state.appliedFilters)
      },

      getFilterSummary: () => {
        const state = get()
        return createFilterSummary(state.appliedFilters)
      },

      canApplyFilters: () => {
        const state = get()
        return JSON.stringify(state.filters) !== JSON.stringify(state.appliedFilters)
      },

      // === UTILITIES ===
      toggleFilterModal: () => {
        set((state) => ({ isFilterModalOpen: !state.isFilterModalOpen }))
      },

      getFilterStats: (): FilterStats => {
        const state = get()

        const totalApplied = state.filterHistory.length
        const activeFiltersCount = countActiveFilters(state.appliedFilters)

        // Categoria mais usada
        const categoryUsage = state.filterHistory.reduce(
          (acc, item) => {
            if (item.filters.category && item.filters.category !== 'all') {
              acc[item.filters.category] = (acc[item.filters.category] || 0) + 1
            }
            return acc
          },
          {} as Record<string, number>,
        )

        const mostUsedCategory =
          Object.entries(categoryUsage).sort(([, a], [, b]) => b - a)[0]?.[0] || null

        // Fonte mais usada
        const sourceUsage = state.filterHistory.reduce(
          (acc, item) => {
            if (item.filters.source) {
              acc[item.filters.source] = (acc[item.filters.source] || 0) + 1
            }
            return acc
          },
          {} as Record<string, number>,
        )

        const mostUsedSource =
          Object.entries(sourceUsage).sort(([, a], [, b]) => b - a)[0]?.[0] || null

        // Média de resultados
        const avgResultCount =
          totalApplied > 0
            ? state.filterHistory.reduce((sum, item) => sum + item.resultCount, 0) / totalApplied
            : 0

        return {
          totalApplied,
          activeFiltersCount,
          mostUsedCategory,
          mostUsedSource,
          avgResultCount,
        }
      },

      exportFilters: () => {
        const state = get()
        return JSON.stringify(
          {
            filters: state.appliedFilters,
            history: state.filterHistory,
            recentSearchTerms: state.recentSearchTerms,
          },
          null,
          2,
        )
      },

      importFilters: (filtersJson: string) => {
        try {
          const imported = JSON.parse(filtersJson)

          if (imported.filters) {
            set({
              filters: imported.filters,
              appliedFilters: imported.filters,
            })
          }

          if (imported.history) {
            set({ filterHistory: imported.history })
          }

          if (imported.recentSearchTerms) {
            set({ recentSearchTerms: imported.recentSearchTerms })
          }

          console.log(`📥 [Filters] Filters imported successfully`)
          return true
        } catch (error) {
          console.error(`❌ [Filters] Failed to import filters:`, error)
          return false
        }
      },

      // ✅ NOVOS: Helpers para UI
      getSourceInfo: (sourceValue: string) => {
        return availableSources.find((s) => s.value === sourceValue) || null
      },

      getCategoryInfo: (categoryValue: string) => {
        return availableCategories.find((c) => c.value === categoryValue) || null
      },
    }),
    {
      name: 'finhub-news-filters-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        appliedFilters: state.appliedFilters,
        filterHistory: state.filterHistory,
        recentSearchTerms: state.recentSearchTerms,
        availableCategories: state.availableCategories,
        availableSources: state.availableSources,
      }),
    },
  ),
)

// ===== HOOKS ESPECIALIZADOS =====

/**
 * Hook para controle básico de filtros
 */
export const useBasicFilters = () => {
  const store = useNewsFilters()

  return {
    // Estado atual
    filters: store.filters,
    hasActiveFilters: store.hasActiveFilters(),
    activeFilterCount: store.getActiveFilterCount(),
    filterSummary: store.getFilterSummary(),

    // Actions básicas
    setCategory: store.setCategory,
    setSearchTerm: store.setSearchTerm,
    setSource: store.setSource, // ✅ Incluído
    clearFilters: store.clearFilters,

    // Aplicar filtros
    applyToArticles: store.applyFilters,

    // ✅ Helpers para UI
    getSourceInfo: store.getSourceInfo,
    getCategoryInfo: store.getCategoryInfo,
  }
}

/**
 * Hook para filtros avançados
 */
export const useAdvancedFilters = () => {
  const store = useNewsFilters()

  return {
    // Estado
    filters: store.filters,
    pendingFilters: store.pendingFilters,
    isModalOpen: store.isFilterModalOpen,
    canApply: store.canApplyFilters(),

    // Actions avançadas
    setPendingFilters: store.setPendingFilters,
    applyPendingFilters: store.applyPendingFilters,
    clearPendingFilters: store.clearPendingFilters,
    setSentiment: store.setSentiment,
    setDateRange: store.setDateRange,
    clearDateRange: store.clearDateRange,

    // Modal
    toggleModal: store.toggleFilterModal,

    // Sugestões
    suggestions: store.getFilterSuggestions(),
    availableCategories: store.availableCategories,
    availableSources: store.availableSources,
  }
}

/**
 * Hook para histórico de filtros
 */
export const useFilterHistory = () => {
  const {
    filterHistory,
    saveToHistory,
    loadFromHistory,
    removeFromHistory,
    clearHistory,
    recentSearchTerms,
    getFilterStats,
  } = useNewsFilters()

  return {
    history: filterHistory,
    recentSearches: recentSearchTerms,
    stats: getFilterStats(),

    // Actions
    save: saveToHistory,
    load: loadFromHistory,
    remove: removeFromHistory,
    clear: clearHistory,
  }
}
