import { Button } from '@/components/ui'

const frequencies = ['Diário', 'Semanal', 'Mensal', 'Ocasional']

interface Props {
  selected: string | null
  onSelect: (freq: string | null) => void
}

export default function PublicationFrequencyFilter({ selected, onSelect }: Props) {
  return (
    <div className="space-x-2 overflow-x-auto pb-2">
      {frequencies.map((freq) => (
        <Button
          key={freq}
          variant={selected === freq ? 'default' : 'outline'}
          onClick={() => onSelect(selected === freq ? null : freq)}
        >
          {freq}
        </Button>
      ))}
    </div>
  )
}
