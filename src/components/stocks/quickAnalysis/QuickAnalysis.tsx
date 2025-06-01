import { ScoreBadge } from './ScoreBadge'
import { ScoresSummary } from './ScoresSummary'
import { RiskAlert } from './RiskAlert'
import { PerformanceRadarChart } from './PerformanceRadarChart'
import { PeersMiniTable } from './PeersMiniTable'
import { QuickActions } from './QuickActions'
import { StockRatingsBySector } from '../StockSectors/StockRatingsBySector'
import { StockData } from '../../../types/stocks'
import { mapToIndicadores } from '../../../types/mapToIndicadores'

interface QuickAnalysisProps {
  data: StockData
  onToggleWatchlist: () => void
  onPeerClick?: (symbol: string) => void
}

export function QuickAnalysis({
  data,
  onToggleWatchlist,
  onPeerClick,
}: QuickAnalysisProps) {
  const quality = data.qualityScore ?? 0
  const growth = data.growthScore ?? 0
  const valuation = (data.valuationGrade || 'C') as 'A' | 'B' | 'C' | 'D' | 'F'
  const risk = data.riskScore ?? 0

  return (
    <div className="space-y-6">
      {/* Destaques rápidos com ScoreBadge */}
      <div className="flex flex-wrap gap-3">
        <ScoreBadge label="Qualidade" score={quality * 10} />
        <ScoreBadge label="Crescimento" score={growth * 10} />
        <ScoreBadge
          label="Valuation"
          score={
            valuation === 'A' ? 90 :
            valuation === 'B' ? 75 :
            valuation === 'C' ? 55 :
            valuation === 'D' ? 40 : 20
          }
        />
        <ScoreBadge label="Risco" score={(10 - risk) * 10} />
      </div>

      {/* Scores visuais */}
      <ScoresSummary
        data={{
          qualidadeScore: quality,
          crescimentoScore: growth,
          valuationGrade: valuation,
          riscoScore: risk,
        }}
      />

      {/* Alertas de risco */}
      <RiskAlert />

      {/* Radar de performance (mock) */}
      <PerformanceRadarChart
        data={[
          { metric: 'Valuation', value: 70 },
          { metric: 'Rentabilidade', value: 80 },
          { metric: 'Crescimento', value: 65 },
          { metric: 'Solidez', value: 75 },
          { metric: 'Risco', value: 40 },
          { metric: 'Dividendos', value: 60 },
        ]}
      />

      {/* Ratings por setor */}
      <StockRatingsBySector
        setor={data.setor}
        indicadores={mapToIndicadores(data)}
      />

      {/* Tabela de peers */}
      {data.peers?.length > 0 && (
        <PeersMiniTable
          peers={data.peers.slice(0, 5).map((p) => ({
            symbol: p,
            name: p,
            price: Math.random() * 100 + 50,
            change: (Math.random() - 0.5) * 10,
          }))}
          onPeerClick={onPeerClick}
        />
      )}

      {/* Ações rápidas */}
      {data.symbol && (
        <QuickActions
          onToggleWatchlist={onToggleWatchlist}
          externalUrl={`https://www.google.com/finance/quote/${data.symbol}`}
        />
      )}
    </div>
  )
}
