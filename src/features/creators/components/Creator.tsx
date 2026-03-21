// src/features/creators/components/Creator.tsx

import { useState } from 'react'
import { Creator as CreatorType } from '@/features/creators/types/creator'
import { CreatorCard } from './cards/CreatorCard'
import { CreatorModal } from './modals/CreatorModal'

type CreatorCardVariant = 'grid' | 'row'

interface CreatorProps {
  creator: CreatorType
  variant?: CreatorCardVariant
  className?: string
}

export function Creator({ creator, variant = 'grid', className }: CreatorProps) {
  const [open, setOpen] = useState(false)

  if (!creator) return null

  return (
    <>
      <div className="rounded-xl  hover:shadow-xs transition-all duration-300">
        <CreatorCard
          creator={creator}
          onOpenModal={() => setOpen(true)}
          variant={variant}
          className={className}
        />
      </div>
      <CreatorModal open={open} onClose={() => setOpen(false)} creator={creator} />
    </>
  )
}
