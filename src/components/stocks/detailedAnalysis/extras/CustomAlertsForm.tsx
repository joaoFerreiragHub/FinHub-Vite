// CustomAlertsForm.tsx
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import { useState } from 'react'

export function CustomAlertsForm() {
  const [peThreshold, setPeThreshold] = useState(15)
  const [dividendYield, setDividendYield] = useState(5)

  const handleSave = () => {
    alert(`Alerta guardado para P/E < ${peThreshold} e Dividend > ${dividendYield}%`)
  }

  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold">📬 Alertas Personalizados</h4>
      <div className="space-y-2">
        <div>
          <Label htmlFor="pe">P/E inferior a:</Label>
          <Input
            id="pe"
            type="number"
            value={peThreshold}
            onChange={(e) => setPeThreshold(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="dividend">Dividend Yield superior a:</Label>
          <Input
            id="dividend"
            type="number"
            value={dividendYield}
            onChange={(e) => setDividendYield(Number(e.target.value))}
          />
        </div>
      </div>
      <Button onClick={handleSave}>Guardar Alerta</Button>
    </div>
  )
}
