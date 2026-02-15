// src/features/creators/components/filters/RatingFilter.tsx

import { Label } from '@/components/ui'
import { Slider } from '@/components/ui'

interface RatingFilterProps {
  value: number
  onChange: (value: number) => void
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Classificação Média</Label>
      <Slider
        min={0}
        max={5}
        step={0.5}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        className="w-full"
      />
      <div className="text-sm text-muted-foreground">{value} estrelas ou mais</div>
    </div>
  )
}
