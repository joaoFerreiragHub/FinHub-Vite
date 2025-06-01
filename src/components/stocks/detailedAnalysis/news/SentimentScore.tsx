import { Progress } from '../../../ui/progress'
import { Card, CardContent } from '../../../ui/card'

export function SentimentScore() {
  const sentiment = {
    score: 72, // mock: 0–100
    positiveWords: ['crescimento', 'lucros', 'recorde'],
    negativeWords: ['volatilidade', 'incerteza'],
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h4 className="text-base font-semibold">📈 Sentimento de Mercado</h4>
        <div className="text-sm">
          <p className="mb-1">Pontuação: <strong>{sentiment.score}/100</strong></p>
          <Progress value={sentiment.score} className="h-2" />
        </div>
        <div className="text-sm text-muted-foreground">
          <p><strong>Palavras positivas:</strong> {sentiment.positiveWords.join(', ')}</p>
          <p><strong>Palavras negativas:</strong> {sentiment.negativeWords.join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  )
}
