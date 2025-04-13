// src/components/creators/cards/CreatorCardMini.tsx

import { Creator as CreatorType } from '../../../types/creator'
import { RatingDisplay } from '../../ratings/RatingDisplay'
import { AspectRatio } from '../../ui/aspect-ratio'

interface CreatorCardMiniProps {
  creator: CreatorType
  onClick?: () => void
}

export function CreatorCardMini({ creator, onClick }: CreatorCardMiniProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-muted transition"
    >
      <AspectRatio ratio={1} className="w-12 h-12 rounded-full overflow-hidden bg-muted">
        <img
          src={creator.profilePictureUrl || '/placeholder-user.jpg'}
          alt={`Foto de ${creator.username}`}
          className="object-cover w-full h-full"
        />
      </AspectRatio>

      <div className="flex flex-col">
        <span className="font-medium text-sm line-clamp-1">{creator.username}</span>
        <RatingDisplay rating={creator.averageRating || 0} size={14} />
      </div>
    </div>
  )
}
