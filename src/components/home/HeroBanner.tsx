import { useState, useEffect, useCallback } from 'react'
import { Button, Badge } from '@/components/ui'

export interface HeroBannerSlide {
  id: string
  title: string
  description: string
  imageUrl: string
  ctaLabel: string
  ctaHref: string
  secondaryLabel?: string
  secondaryHref?: string
  badge?: string
}

interface HeroBannerProps {
  slides: HeroBannerSlide[]
  autoplayInterval?: number
}

export function HeroBanner({ slides, autoplayInterval = 7000 }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (isPaused || slides.length <= 1) return
    const timer = setInterval(next, autoplayInterval)
    return () => clearInterval(timer)
  }, [isPaused, next, autoplayInterval, slides.length])

  if (slides.length === 0) return null

  const slide = slides[current]

  return (
    <div
      className="hero-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images - all preloaded, toggled via opacity */}
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.imageUrl}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
          aria-hidden="true"
        />
      ))}

      {/* Gradient overlay */}
      <div className="hero-banner__gradient" />

      {/* Content */}
      <div className="hero-banner__content">
        {slide.badge && (
          <Badge
            variant="secondary"
            className="w-fit text-xs sm:text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm"
          >
            {slide.badge}
          </Badge>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-foreground">
          {slide.title}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {slide.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-1">
          <a href={slide.ctaHref}>
            <Button size="lg" className="font-semibold shadow-lg text-sm sm:text-base px-6 sm:px-8">
              {slide.ctaLabel}
            </Button>
          </a>
          {slide.secondaryLabel && slide.secondaryHref && (
            <a href={slide.secondaryHref}>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold backdrop-blur-sm bg-background/50 text-sm sm:text-base px-6 sm:px-8"
              >
                {slide.secondaryLabel}
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="hero-banner__dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`hero-banner__dot ${i === current ? 'hero-banner__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
