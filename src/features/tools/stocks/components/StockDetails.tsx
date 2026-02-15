// components/stocks/StockDetails.tsx
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'

import { WatchlistButton } from './WatchlistButton'
import { GeneralInfoSection } from './sections/GeneralInfoSection'
import { QuickAnalysis } from './quickAnalysis/QuickAnalysis'
import { FullDetailedAnalysis } from './sections/FullDetailedAnalysis'

import { useQuickAnalysis } from './hooks/useQuickAnalysis'
import { mergeStockData } from '@/features/tools/stocks/utils/mergeStockData'
import { MLPredictions } from './MLPredictions/MLPredictions'
import { StockData } from '~/features/tools/stocks/types/stocks'

interface StockDetailsProps {
  stockData: StockData
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export function StockDetails({ stockData, isInWatchlist, onToggleWatchlist }: StockDetailsProps) {
  const { symbol } = stockData
  // 🆕 Updated to include 'previsoes' tab
  const [tab, setTab] = useState<'resumo' | 'detalhada' | 'previsoes'>('resumo')
  const { data: quickData, loading, error } = useQuickAnalysis(symbol)

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

      {/* 🆕 Updated Tabs with ML Predictions */}
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as 'resumo' | 'detalhada' | 'previsoes')}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="resumo">Análise Rápida</TabsTrigger>
          <TabsTrigger value="detalhada">Análise Detalhada</TabsTrigger>
          <TabsTrigger
            value="previsoes"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600"
          >
            🤖 Previsões IA
          </TabsTrigger>
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

        {/* 🆕 NEW ML Predictions Tab */}
        <TabsContent value="previsoes">
          <MLPredictions symbol={displaySymbol} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
