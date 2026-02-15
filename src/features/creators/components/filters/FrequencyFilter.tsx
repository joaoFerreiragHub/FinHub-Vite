import { Label } from '@/components/ui'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui'

interface FrequencyFilterProps {
  selected: string
  setSelected: (value: string) => void
}

const frequencies = ['Diário', 'Semanal', 'Mensal', 'Ocasional']

export function FrequencyFilter({ selected, setSelected }: FrequencyFilterProps) {
  return (
    <div className="space-y-2">
      <Label className="text-base">🕒 Frequência de Publicação</Label>
      <ToggleGroup
        type="single"
        value={selected}
        onValueChange={setSelected}
        className="flex gap-2 flex-wrap"
      >
        {frequencies.map((freq) => (
          <ToggleGroupItem key={freq} value={freq} className="capitalize">
            {freq}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
