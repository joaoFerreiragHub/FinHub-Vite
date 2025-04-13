// src/components/creators/Creator.tsx

import { useState } from 'react'
import { Creator as CreatorType } from '../../types/creator'
import { CreatorCard } from './cards/CreatorCard'
import { CreatorModal } from './modals/CreatorModal'

interface CreatorProps {
  creator: CreatorType
}

export function Creator({ creator }: CreatorProps) {
  const [open, setOpen] = useState(false)

  if (!creator) return null

  return (
    <>
      <div className="rounded-xl  hover:shadow-xs transition-all duration-300">
        <CreatorCard creator={creator} onOpenModal={() => setOpen(true)} />
      </div>
      <CreatorModal open={open} onClose={() => setOpen(false)} creator={creator} />
    </>
  )
}
