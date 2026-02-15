// src/features/creators/components/filters/ContentTypeFilter.tsx

import { Button } from '@/components/ui'
import { ScrollArea, ScrollBar } from '@/components/ui'

const contentTypes = ['Vídeos', 'Artigos', 'Cursos', 'Playlists']

interface ContentTypeFilterProps {
  selectedTypes: string[]
  setSelectedTypes: (types: string[]) => void
}

export default function ContentTypeFilter({
  selectedTypes,
  setSelectedTypes,
}: ContentTypeFilterProps) {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Tipo de Conteúdo</p>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {contentTypes.map((type) => (
            <Button
              key={type}
              variant={selectedTypes.includes(type) ? 'default' : 'outline'}
              onClick={() => toggleType(type)}
              className="text-sm"
            >
              {type}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
