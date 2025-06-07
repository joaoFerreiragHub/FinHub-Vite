import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'

import { StockData } from '../../types/stocks'
import { WatchlistButton } from './WatchlistButton'
import { GeneralInfoSection } from './sections/GeneralInfoSection'
import { QuickAnalysis } from './quickAnalysis/QuickAnalysis'
import { FullDetailedAnalysis } from './sections/FullDetailedAnalysis'
import { useQuickAnalysis } from './hooks/useQuickAnalysis'
import { mergeStockData } from '../../utils/mergeStockData'

interface StockDetailsProps {
  stockData: StockData
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export function StockDetails({ stockData, isInWatchlist, onToggleWatchlist }: StockDetailsProps) {
  const { symbol } = stockData
  const [tab, setTab] = useState<'resumo' | 'detalhada'>('resumo')
  const { data: quickData, loading, error } = useQuickAnalysis(symbol)

  // Função para mesclar quickData com stockData, priorizando dados mais atuais do quickData


  function handlePeerClick(symbol: string) {
    console.log('Peer clicked:', symbol)
  }

  // Dados mesclados para usar no GeneralInfoSection
  const mergedData = quickData ? mergeStockData(stockData, quickData) : stockData

// Substituir valores diretamente com fallback
const displayName = quickData?.name || stockData.companyName
const displaySymbol = quickData?.symbol || stockData.symbol
const displayImage = quickData?.image || stockData.image

  console.log('quickData', quickData)
  return (
    <div className="space-y-6">
     <div className="flex items-center gap-4">
        {displayImage && (
          <img
            src={displayImage}
            alt={`Logo da ${displayName}`}
            className="w-10 h-10 rounded shadow-sm"
          />
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <h2 className="text-xl font-bold">
            {displayName} <span className="text-muted-foreground">({displaySymbol})</span>
          </h2>
        </div>
        <WatchlistButton isInWatchlist={isInWatchlist} onToggle={onToggleWatchlist} />
      </div>


      <Tabs value={tab} onValueChange={(v) => setTab(v as 'resumo' | 'detalhada')} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resumo">Análise Rápida</TabsTrigger>
          <TabsTrigger value="detalhada">Análise Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          {loading ? (
            <p>A carregar análise rápida...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : quickData ? (
            <>
              <GeneralInfoSection data={mergedData} />
              <QuickAnalysis
                data={quickData}
                onToggleWatchlist={onToggleWatchlist}
                onPeerClick={handlePeerClick}
              />
            </>
          ) : (
            // Fallback: se não há quickData, usa apenas stockData
            <GeneralInfoSection data={stockData} />
          )}
        </TabsContent>

        <TabsContent value="detalhada">
          <FullDetailedAnalysis data={stockData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
