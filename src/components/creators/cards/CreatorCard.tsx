// src/components/creators/cards/CreatorCard.tsx
import { Creator as CreatorType } from '../../../types/creator'
import { AspectRatio } from '../../ui/aspect-ratio'
import { RatingDisplay } from '../../ratings/RatingDisplay'
import { Card, CardContent } from '../../ui/card'

interface CreatorCardProps {
  creator: CreatorType
  onOpenModal?: () => void
}

export function CreatorCard({ creator, onOpenModal }: CreatorCardProps) {
  return (
    <Card
      onClick={onOpenModal}
      className={`w-[160px] sm:w-[180px] rounded-lg border border-gray-200
        ${onOpenModal ? 'cursor-pointer hover:scale-[1.03] hover:shadow-sm hover:border-primary transition-all duration-300 ease-in-out' : ''}`}
    >
      <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
        <AspectRatio ratio={1} className="bg-muted rounded-full overflow-hidden w-20 h-20">
          <img
            src={creator.profilePictureUrl || '/placeholder-user.jpg'}
            alt={`Foto de ${creator.username}`}
            className="object-cover w-full h-full"
          />
        </AspectRatio>

        <div className="font-medium text-sm line-clamp-1">{creator.username}</div>
        <div className="flex items-center justify-center gap-1">
          <RatingDisplay rating={creator.averageRating || 0} />
        </div>
      </CardContent>
    </Card>
  )
}
