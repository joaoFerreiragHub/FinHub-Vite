// 1. Ajusta o componente StockDetails para incluir tabs
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'

import { StockData } from '../../types/stocks'
import { WatchlistButton } from './WatchlistButton'
import { GeneralInfoSection } from './sections/GeneralInfoSection'
import { QuickAnalysis } from './quickAnalysis/QuickAnalysis'
import { FullDetailedAnalysis } from './sections/FullDetailedAnalysis'

interface StockDetailsProps {
  stockData: StockData
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export function StockDetails({ stockData, isInWatchlist, onToggleWatchlist }: StockDetailsProps) {
  const { companyName, symbol, image } = stockData

  const [tab, setTab] = useState<'resumo' | 'detalhada'>('resumo')
  function handlePeerClick(symbol: string) {
    console.log('Peer clicked:', symbol)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {image && (
          <img
            src={image}
            alt={`Logo da ${companyName}`}
            className="w-10 h-10 rounded shadow-sm"
          />
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <h2 className="text-xl font-bold">
            {companyName} <span className="text-muted-foreground">({symbol})</span>
          </h2>
        </div>
        <WatchlistButton isInWatchlist={isInWatchlist} onToggle={onToggleWatchlist} />
      </div>

      <GeneralInfoSection data={stockData} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'resumo' | 'detalhada')} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resumo">Análise Rápida</TabsTrigger>
          <TabsTrigger value="detalhada">Análise Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <div className="grid grid-cols-1 gap-4">
          <h2 className="text-lg font-semibold mb-2">📊 Ratings Rápidos</h2>
          <QuickAnalysis
            data={stockData}
            onToggleWatchlist={onToggleWatchlist}
            onPeerClick={handlePeerClick}
          />

          </div>
        </TabsContent>

        <TabsContent value="detalhada">
        <FullDetailedAnalysis data={stockData} />
      </TabsContent>
      </Tabs>
    </div>
  )
}
