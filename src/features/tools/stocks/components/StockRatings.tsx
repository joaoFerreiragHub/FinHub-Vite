// components/stocks/StockRatings.tsx
interface StockRatingsProps {
  pe: string
  peg: string
  dcf: string
  roe: string
}

export function StockRatings({ pe, peg, dcf, roe }: StockRatingsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <strong>P/E:</strong> {pe}
      </div>
      <div>
        <strong>PEG:</strong> {peg}
      </div>
      <div>
        <strong>DCF:</strong> {dcf}
      </div>
      <div>
        <strong>ROE:</strong> {roe}
      </div>
    </div>
  )
}
