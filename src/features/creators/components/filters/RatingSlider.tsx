// src/features/creators/components/filters/RatingSlider.tsx

import { Label } from '@/components/ui'
import { Slider } from '@/components/ui'

interface RatingSliderProps {
  value: number
  onChange: (value: number) => void
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">🌟 Classificação mínima</Label>
      <Slider
        min={0}
        max={5}
        step={0.5}
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
      />
      <div className="text-sm text-muted-foreground">Acima de {value} estrelas</div>
    </div>
  )
}
