import { Flame, Star, Clock, TrendingUp } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group'

type SortFilterProps = {
  sortOption: string
  setSortOption: (value: string) => void
}

export default function SortFilter({ sortOption, setSortOption }: SortFilterProps) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">📊 Ordenar por</p>
      <ToggleGroup
        type="single"
        value={sortOption}
        onValueChange={(value: string) => {
          if (value) setSortOption(value)
        }}
        className="flex flex-wrap gap-2"
      >
        <ToggleGroupItem value="popular" aria-label="Mais populares">
          <Flame className="w-4 h-4 mr-1" />
          Populares
        </ToggleGroupItem>
        <ToggleGroupItem value="rating" aria-label="Mais bem avaliados">
          <Star className="w-4 h-4 mr-1" />
          Avaliados
        </ToggleGroupItem>
        <ToggleGroupItem value="recent" aria-label="Mais recentes">
          <Clock className="w-4 h-4 mr-1" />
          Recentes
        </ToggleGroupItem>
        <ToggleGroupItem value="trending" aria-label="Tendência">
          <TrendingUp className="w-4 h-4 mr-1" />
          Tendência
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
