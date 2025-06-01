// src/components/stocks/detailedAnalysis/sections/NewsSection.tsx

import { NewsFeed } from '../news/NewsFeed'
import { SentimentScore } from '../news/SentimentScore'

export function NewsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold mb-2">📰 Notícias Recentes</h3>
        <NewsFeed />
      </div>
      <div>
        <h3 className="text-base font-semibold mb-2">📊 Sentimento de Mercado</h3>
        <SentimentScore />
      </div>
    </div>
  )
}
