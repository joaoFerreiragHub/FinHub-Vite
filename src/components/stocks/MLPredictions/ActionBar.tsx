import { Download, Info } from "lucide-react"
import { Button } from "../../ui/button"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ActionBar({ data, symbol }: any) {
  const handleExport = () => {
    const exportData = {
      symbol,
      timestamp: new Date().toISOString(),
      earnings: data?.earnings,
      priceTarget: data?.priceTarget,
      riskFactors: data?.riskFactors,
      insights: data?.modelInsights
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ml-predictions-${symbol}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Info className="w-4 h-4" />
        <span>
          Previsões baseadas em {data ? 'análise completa' : 'análise rápida'} com IA sector-específica
        </span>
      </div>

      <div className="flex space-x-2">
        {data && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <a href={`#/stocks/${symbol}/analysis`}>
            Ver Análise Completa
          </a>
        </Button>
      </div>
    </div>
  )
}
