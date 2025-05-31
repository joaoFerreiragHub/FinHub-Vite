import { CardBlock } from "./StockCard"


interface StockData {
  symbol: string
  companyName: string
  image?: string
  setor: string
  industry: string
  exchange: string
  pais: string
  preco: string
  marketCap: string
  enterpriseValue: string
  eps: string
  pe: string
  pegRatio: string
  dcf: string
  ebitda: string
  lucroLiquido: string
  margemEbitda: string
  roe: string
  peers: string[]
}

interface StockDetailsProps {
  stockData: StockData
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export function StockDetails({
  stockData,
  isInWatchlist,
  onToggleWatchlist,
}: StockDetailsProps) {
  return (
    <CardBlock title={`${stockData.companyName} (${stockData.symbol})`}>
      <div className="grid grid-cols-2 gap-2">
        <p><strong>Setor:</strong> {stockData.setor}</p>
        <p><strong>Indústria:</strong> {stockData.industry}</p>
        <p><strong>Bolsa:</strong> {stockData.exchange}</p>
        <p><strong>País:</strong> {stockData.pais}</p>
        <p><strong>Preço:</strong> {stockData.preco}</p>
        <p><strong>Market Cap:</strong> {stockData.marketCap}</p>
        <p><strong>Enterprise Value:</strong> {stockData.enterpriseValue}</p>
        <p><strong>Lucro Líquido:</strong> {stockData.lucroLiquido}</p>
        <p><strong>EBITDA:</strong> {stockData.ebitda}</p>
        <p><strong>Margem EBITDA:</strong> {stockData.margemEbitda}</p>
        <p><strong>EPS:</strong> {stockData.eps}</p>
      </div>
      <button
        onClick={onToggleWatchlist}
        className="mt-4 underline text-blue-600 hover:text-blue-800"
      >
        {isInWatchlist ? "Remover da Watchlist" : "Adicionar à Watchlist"}
      </button>
    </CardBlock>
  )
}
