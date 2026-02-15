// src/features/creators/components/carousel/CarouselCreators.tsx

import { Button } from '@/components/ui'
import { Creator } from '@/features/creators/components/Creator'
import type { Creator as CreatorType } from '@/features/creators/types/creator'

interface CarouselCreatorsProps {
  creators: CreatorType[]
  maxToShow?: number
}

export function CarouselCreators({ creators, maxToShow = 4 }: CarouselCreatorsProps) {
  const visibleCreators = creators.slice(0, maxToShow)

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">🎯 Criadores em Destaque</h3>
      <p className="text-muted-foreground text-center mb-8">
        Aprende com os melhores da comunidade.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {visibleCreators.map((creator) => (
          <Creator key={creator._id} creator={creator} />
        ))}
      </div>

      <div className="text-center mt-6">
        <a href="/criadores">
          <Button variant="secondary">Explora todos os criadores</Button>
        </a>
      </div>
    </div>
  )
}
