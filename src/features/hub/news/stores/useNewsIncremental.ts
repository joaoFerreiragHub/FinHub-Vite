// src/features/hub/news/stores/useNewsIncremental.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNewsSelectors, useNewsStore } from './useNewsStore'

interface UseNewsIncrementalOptions {
  scrollThreshold?: number
  loadAmount?: number
  autoLoadOnMount?: boolean
  enableVirtualization?: boolean
  bufferSize?: number
  preloadNext?: boolean
}

interface ScrollPosition {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  percentage: number
}

/**
 * Hook especializado para carregamento incremental e scroll infinito
 * Suporta virtualização, preload inteligente e gestão otimizada de performance
 */
export const useNewsIncremental = (options: UseNewsIncrementalOptions = {}) => {
  const {
    scrollThreshold = 300, // px do bottom para triggear load
    loadAmount = 20,
    autoLoadOnMount = true,
    enableVirtualization = false,
    bufferSize = 5, // items extra para virtualização
    preloadNext = true,
  } = options

  // === STORE STATE ===
  const {
    loadMoreNews,
    setItemsPerPage,
    hasMore,
    isLoadingMore,
    loadedItems,
    totalCount,
    itemsPerPage,
    news,
  } = useNewsStore()

  const { canLoadMore, loadingStats } = useNewsSelectors()

  // === LOCAL STATE ===
  const [isNearBottom, setIsNearBottom] = useState(false)
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    percentage: 0,
  })
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: loadAmount })

  // === REFS ===
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTimeRef = useRef(0)
  const scrollVelocityRef = useRef(0)

  // === CONFIGURAR ITEMS PER PAGE ===
  useEffect(() => {
    if (itemsPerPage !== loadAmount) {
      setItemsPerPage(loadAmount)
    }
  }, [loadAmount, itemsPerPage, setItemsPerPage])

  // === FUNÇÃO DE LOAD MORE com throttling ===
  const loadMore = useCallback(async () => {
    if (!canLoadMore || isLoadingMore) {
      console.log('🔄 Load more: não pode carregar mais', { canLoadMore, isLoadingMore })
      return false
    }

    try {
      console.log(`🔄 Loading more... (${loadedItems}/${totalCount})`)
      await loadMoreNews()
      return true
    } catch (error) {
      console.error('❌ Erro ao carregar mais notícias:', error)
      return false
    }
  }, [canLoadMore, isLoadingMore, loadedItems, totalCount, loadMoreNews])

  // === THROTTLED LOAD MORE ===
  const throttledLoadMore = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    loadingTimeoutRef.current = setTimeout(() => {
      loadMore()
    }, 200) // Throttle de 200ms
  }, [loadMore])

  // === SCROLL HANDLER com cálculos otimizados ===
  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement
      if (!target) return

      const now = Date.now()
      const deltaTime = now - lastScrollTimeRef.current
      const deltaY = target.scrollTop - scrollPosition.scrollTop

      // Calcular velocidade do scroll
      if (deltaTime > 0) {
        scrollVelocityRef.current = Math.abs(deltaY / deltaTime)
      }

      const newScrollPosition: ScrollPosition = {
        scrollTop: target.scrollTop,
        scrollHeight: target.scrollHeight,
        clientHeight: target.clientHeight,
        percentage: Math.round(
          (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100,
        ),
      }

      setScrollPosition(newScrollPosition)
      lastScrollTimeRef.current = now

      // Calcular distância do bottom
      const distanceFromBottom =
        newScrollPosition.scrollHeight -
        newScrollPosition.scrollTop -
        newScrollPosition.clientHeight
      const nearBottom = distanceFromBottom <= scrollThreshold

      setIsNearBottom(nearBottom)

      // Virtualização - calcular range visível
      if (enableVirtualization) {
        const itemHeight = 200 // altura estimada de cada item
        const startIndex = Math.max(
          0,
          Math.floor(newScrollPosition.scrollTop / itemHeight) - bufferSize,
        )
        const endIndex = Math.min(
          news.length,
          Math.ceil((newScrollPosition.scrollTop + newScrollPosition.clientHeight) / itemHeight) +
            bufferSize,
        )

        setVisibleRange({ start: startIndex, end: endIndex })
      }

      // Trigger load more se necessário
      if (nearBottom && canLoadMore && !isLoadingMore) {
        console.log('🔄 Near bottom detected, loading more...')
        throttledLoadMore()
      }

      // Preload se está a scrollar rápido e perto do fim
      if (
        preloadNext &&
        scrollVelocityRef.current > 1 &&
        distanceFromBottom <= scrollThreshold * 2
      ) {
        throttledLoadMore()
      }
    },
    [
      scrollPosition.scrollTop,
      scrollThreshold,
      canLoadMore,
      isLoadingMore,
      throttledLoadMore,
      enableVirtualization,
      bufferSize,
      news.length,
      preloadNext,
    ],
  )

  // === ATTACH SCROLL LISTENER ===
  const attachScrollListener = useCallback(
    (element: HTMLElement) => {
      scrollContainerRef.current = element
      element.addEventListener('scroll', handleScroll, { passive: true })

      console.log('📜 Scroll listener attached to:', element.tagName)

      return () => {
        element.removeEventListener('scroll', handleScroll)
        console.log('📜 Scroll listener removed')
      }
    },
    [handleScroll],
  )

  // === AUTO LOAD INICIAL ===
  useEffect(() => {
    if (autoLoadOnMount && canLoadMore && news.length === 0) {
      console.log('🚀 Auto load on mount')
      loadMore()
    }
  }, [autoLoadOnMount, canLoadMore, news.length, loadMore])

  // === INTERSECTION OBSERVER para detecção de elementos ===
  const observeElement = useCallback(
    (element: HTMLElement, callback: () => void) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback()
            }
          })
        },
        {
          rootMargin: `${scrollThreshold}px`,
          threshold: 0.1,
        },
      )

      observer.observe(element)

      return () => {
        observer.unobserve(element)
        observer.disconnect()
      }
    },
    [scrollThreshold],
  )

  // === LOAD MORE com Intersection Observer ===
  const createLoadMoreTrigger = useCallback(() => {
    const triggerElement = document.createElement('div')
    triggerElement.style.height = '1px'
    triggerElement.style.width = '100%'
    triggerElement.dataset.loadMoreTrigger = 'true'

    const cleanup = observeElement(triggerElement, () => {
      if (canLoadMore && !isLoadingMore) {
        loadMore()
      }
    })

    return { triggerElement, cleanup }
  }, [observeElement, canLoadMore, isLoadingMore, loadMore])

  // === OPTIMISTIC LOADING ===
  const optimisticLoad = useCallback(
    async (count: number = loadAmount) => {
      console.log(`🔮 Optimistic loading: ${count} items`)

      // Aumentar temporariamente o número de items
      const originalAmount = itemsPerPage
      setItemsPerPage(count)

      try {
        await loadMore()
      } finally {
        // Restaurar valor original
        setItemsPerPage(originalAmount)
      }
    },
    [loadAmount, itemsPerPage, setItemsPerPage, loadMore],
  )

  // === BATCH LOADING ===
  const batchLoad = useCallback(
    async (batches: number = 3, delay: number = 1000) => {
      console.log(`📦 Batch loading: ${batches} batches com delay de ${delay}ms`)

      for (let i = 0; i < batches; i++) {
        if (!canLoadMore) break

        await loadMore()

        if (i < batches - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    },
    [canLoadMore, loadMore],
  )

  // === CLEANUP ===
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  // === RETORNO DO HOOK ===
  return {
    // Estado
    hasMore,
    isLoading: isLoadingMore,
    canLoadMore,
    loadedItems,
    totalCount,
    progress: loadingStats,
    isNearBottom,
    scrollPosition,
    visibleRange: enableVirtualization ? visibleRange : null,

    // Informações de performance
    scrollVelocity: scrollVelocityRef.current,
    remainingItems: totalCount - loadedItems,
    estimatedScrollsToEnd: Math.ceil((totalCount - loadedItems) / loadAmount),

    // Actions principais
    loadMore,
    optimisticLoad,
    batchLoad,

    // Configuração de scroll
    attachScrollListener,
    observeElement,
    createLoadMoreTrigger,

    // Helpers para componentes
    getProgressPercentage: () => Math.round((loadedItems / totalCount) * 100),
    isComplete: !hasMore,
    needsMoreData: canLoadMore && scrollPosition.percentage > 70,

    // Configuração dinâmica
    updateScrollThreshold: (newThreshold: number) => {
      // Esta funcionalidade poderia ser expandida
      console.log(`📏 Novo scroll threshold: ${newThreshold}px`)
    },

    updateLoadAmount: (newAmount: number) => {
      setItemsPerPage(newAmount)
    },

    // Debug helpers
    debugInfo: {
      scrollPosition,
      isNearBottom,
      canLoadMore,
      isLoadingMore,
      hasMore,
      scrollVelocity: scrollVelocityRef.current,
      visibleRange: enableVirtualization ? visibleRange : null,
    },
  }
}

export default useNewsIncremental
