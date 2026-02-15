import { Card, CardContent } from '@/components/ui'

const mockNews = [
  {
    title: 'Apple Reports Record Earnings in Q2',
    source: 'Reuters',
    date: '2024-05-15',
    url: 'https://example.com/news1',
  },
  {
    title: 'Microsoft Acquires AI Startup for $1.2B',
    source: 'Bloomberg',
    date: '2024-05-14',
    url: 'https://example.com/news2',
  },
  {
    title: 'Tesla Announces New Battery Technology',
    source: 'CNBC',
    date: '2024-05-13',
    url: 'https://example.com/news3',
  },
]

export function NewsFeed() {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <h4 className="text-base font-semibold">📰 Últimas Notícias</h4>
        <ul className="space-y-2 text-sm">
          {mockNews.map((news, idx) => (
            <li key={idx} className="border-b pb-2">
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {news.title}
              </a>
              <div className="text-muted-foreground">
                {news.source} • {news.date}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
