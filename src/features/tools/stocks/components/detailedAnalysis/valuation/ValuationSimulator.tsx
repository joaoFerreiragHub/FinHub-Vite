import { useState } from 'react'

import { simulateDCF } from '@/features/tools/stocks/utils/simulateDCF'
import { IndicatorValue } from '../../IndicatorValue'
import { Button } from '@/components/ui'
import { Label } from '@/components/ui'
import { Input } from '@/components/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui'

interface ValuationSimulatorProps {
  precoAtual: number
  defaultFCF?: number
  defaultWACC?: number
}

export function ValuationSimulator({
  precoAtual,
  defaultFCF,
  defaultWACC,
}: ValuationSimulatorProps) {
  const [fcf, setFcf] = useState(defaultFCF ?? 1000)
  const [growth, setGrowth] = useState(0.1)
  const [g, setG] = useState(0.025)
  const [wacc, setWacc] = useState(defaultWACC ?? 0.09)
  const [valuation, setValuation] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const handleSimulate = () => {
    const val = simulateDCF({ fcff: fcf, growthRate: growth, g, wacc })
    setValuation(val)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Simular Valuation</p>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">
            {open ? 'Fechar' : 'Abrir'}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="fcf">FCF Atual</Label>
            <Input
              id="fcf"
              type="number"
              value={fcf}
              onChange={(e) => setFcf(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="growth">Crescimento (5 anos)</Label>
            <Input
              id="growth"
              type="number"
              step="0.01"
              value={growth}
              onChange={(e) => setGrowth(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="g">Crescimento Perpétuo (g)</Label>
            <Input
              id="g"
              type="number"
              step="0.001"
              value={g}
              onChange={(e) => setG(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="wacc">WACC</Label>
            <Input
              id="wacc"
              type="number"
              step="0.01"
              value={wacc}
              onChange={(e) => setWacc(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleSimulate} className="w-full sm:w-fit">
          Calcular
        </Button>

        {valuation && (
          <div className="text-sm mt-2">
            <p>
              <strong>Valuation estimado:</strong> ${valuation.toFixed(2)}
            </p>
            <p>
              <strong>Preço atual:</strong> ${precoAtual.toFixed(2)}
            </p>
            <p className="flex items-center gap-1">
              Diferença:
              <IndicatorValue value={valuation} isGood={(v) => v > precoAtual} />
              <span className="ml-1">
                {(((valuation - precoAtual) / precoAtual) * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
