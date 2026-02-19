import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ContentRowProps {
  title: string
  subtitle?: string
  href?: string
  children: React.ReactNode
  className?: string
}

export function ContentRow({ title, subtitle, href, children, className }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      ro.disconnect()
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.75
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className={`content-row ${className ?? ''}`}>
      <div className="content-row__header">
        <div>
          <h2 className="content-row__title">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">{subtitle}</p>
          )}
        </div>
        {href && (
          <a href={href} className="content-row__link">
            Ver tudo &rarr;
          </a>
        )}
      </div>

      <div className="content-row__container">
        {canScrollLeft && (
          <button
            className="content-row__arrow content-row__arrow--left"
            onClick={() => scroll('left')}
            aria-label="Scroll para a esquerda"
          >
            <ChevronLeft />
          </button>
        )}

        <div ref={scrollRef} className="content-row__scroll">
          {children}
        </div>

        {canScrollRight && (
          <button
            className="content-row__arrow content-row__arrow--right"
            onClick={() => scroll('right')}
            aria-label="Scroll para a direita"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </section>
  )
}
