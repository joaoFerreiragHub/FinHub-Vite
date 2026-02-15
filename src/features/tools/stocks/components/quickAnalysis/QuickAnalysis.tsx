import { ScoreBadge } from './ScoreBadge'
import { ScoresSummary } from './ScoresSummary'
import { RiskAlert } from './RiskAlert'
import { PerformanceRadarChart } from './PerformanceRadarChart'
import { PeersMiniTable } from './PeersMiniTable'
import { QuickActions } from './QuickActions'
import { StockRatingsBySector } from '../StockSectors/StockRatingsBySector'
import { ScoreData, StockData } from '@/features/tools/stocks/types/stocks'
import { mapAlertsToAlertItems } from '../hooks/mapAlertsToAlertItems'
import { mapCompanyDataToScoresSummary } from '../hooks/mapCompanyDataToScoresSummary'

interface QuickAnalysisProps {
  data: StockData
  onToggleWatchlist: () => void
  onPeerClick?: (symbol: string) => void
}

export function QuickAnalysis({ data, onToggleWatchlist, onPeerClick }: QuickAnalysisProps) {
  const quality = data.qualityScore ?? 0
  const growth = data.growthScore ?? 0
  const valuation = (data.valuationGrade || 'C') as 'A' | 'B' | 'C' | 'D' | 'F'
  const risk = data.riskScore ?? 0
  const qualityScore = data.qualityScore ?? 0
  const riskScore = data.riskScore ?? 0

  return (
    <div className="space-y-6">
      {/* Destaques rápidos com ScoreBadge */}
      <div className="flex flex-wrap gap-3">
        <ScoreBadge label="Qualidade" score={quality * 10} />
        <ScoreBadge label="Crescimento" score={growth * 10} />
        <ScoreBadge
          label="Valuation"
          score={
            valuation === 'A'
              ? 90
              : valuation === 'B'
                ? 75
                : valuation === 'C'
                  ? 55
                  : valuation === 'D'
                    ? 40
                    : 25
          }
        />
        <ScoreBadge
          label="Risco"
          score={Math.round((10 - Math.min(risk, 10)) * 10)} // já está correto!
        />
        <ScoreBadge label="Piotroski" score={(qualityScore / 9) * 100} />
        <ScoreBadge label="Altman Z" score={Math.round((riskScore / 10) * 100)} />
      </div>

      {/* Scores visuais */}
      <ScoresSummary data={mapCompanyDataToScoresSummary(data)} />

      {/* Alertas de risco */}
      <RiskAlert alerts={mapAlertsToAlertItems(data.alerts)} />

      {/* Radar de performance (mock) */}
      <div className="flex flex-wrap justify-center items-start">
        <PerformanceRadarChart title={data.symbol} data={data.radarData} />

        {data.radarPeers?.map((peer: { symbol: string; radar: ScoreData[] }) => (
          <PerformanceRadarChart key={peer.symbol} title={peer.symbol} data={peer.radar} />
        ))}
      </div>

      {/* Ratings por setor */}
      <StockRatingsBySector
        setor={data.sector} // era `data.setor`, corrigido
        indicadores={data.indicadores}
      />

      {/* Tabela de peers */}
      {data.peersQuotes?.length > 0 && (
        <PeersMiniTable
          peers={data.peersQuotes.map((peer) => ({
            symbol: peer.symbol,
            name: peer.name,
            price: peer.price,
            change: peer.changesPercentage || 0,
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
