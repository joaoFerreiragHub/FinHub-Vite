// src/components/stocks/detailedAnalysis/sections/ValuationSectionAdvanced.tsx

import { Card, CardContent } from '../../../ui/card'
import { HistoricalMultiplesChart } from './HistoricalMultiplesChart'
import { SectorMultiplesComparison } from './SectorMultiplesComparison'
import { ValuationComparison } from './ValuationComparison'
import { ValuationSimulator } from './ValuationSimulator'


export function ValuationSectionAdvanced() {
  const precoAtual = 230 // substituir por valor real vindo do stockData se necessário
  const valuation = 250; // substituir por valor real vindo do stockData se necessário
  const companyMultiples = {
    pe: 15.2,
    ps: 4.5,
    pb: 2.8,
    evEbitda: 10.4,
    roe: 18.2,
    ebitdaMargin: 32.5,
  }

  const sectorMultiples = {
    pe: 17.6,
    ps: 4.2,
    pb: 2.5,
    evEbitda: 11.1,
    roe: 14.7,
    ebitdaMargin: 28.9,
  }

  const historicalMultiplesData = [
    { year: '2019', pe: 18.2, ps: 4.3, pb: 3.1, evEbitda: 11.5 },
    { year: '2020', pe: 22.7, ps: 4.8, pb: 3.4, evEbitda: 12.8 },
    { year: '2021', pe: 19.5, ps: 4.2, pb: 2.9, evEbitda: 10.2 },
    { year: '2022', pe: 16.3, ps: 3.9, pb: 2.7, evEbitda: 9.8 },
    { year: '2023', pe: 17.1, ps: 4.0, pb: 2.8, evEbitda: 10.5 },
  ]



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <ValuationComparison valuation={valuation} currentPrice={precoAtual} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
        <Card>
      <CardContent className="p-4">
        <SectorMultiplesComparison
          company={companyMultiples}
          sector={sectorMultiples}
        />
      </CardContent>
    </Card>


        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <HistoricalMultiplesChart data={historicalMultiplesData} />
        </CardContent>
      </Card>


      <Card>
        <CardContent className="p-4">
          <ValuationSimulator precoAtual={precoAtual} />
        </CardContent>
      </Card>
    </div>
  )
}
