// src/features/hub/news/services/mockNews.ts

import { NewsArticle } from '../types/news'

export const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Tesla Anuncia Entregas Recordes Q3, Ações Sobem 8%',
    summary:
      'Tesla reportou entregas trimestrais recordes, superando expectativas dos analistas e impulsionando valorização significativa das ações.',
    content:
      'Tesla Inc. reportou entregas recordes do terceiro trimestre, com um total de 435.000 veículos entregues globalmente, superando as expectativas dos analistas em 12%. A empresa atribuiu este sucesso à otimização da produção nas suas gigafábricas e ao aumento da demanda por veículos elétricos.',
    publishedDate: '2024-06-20T10:30:00Z',
    source: 'Financial Times',
    url: 'https://example.com/tesla-q3',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
    category: 'earnings',
    tickers: ['TSLA'],
    sentiment: 'positive',
    views: 15420,
  },
  {
    id: '2',
    title: 'Fed Sinaliza Possível Corte de Juros em 2024',
    summary:
      'Funcionários do Fed sugerem potenciais reduções de taxas à medida que a inflação mostra sinais de arrefecimento nas principais economias.',
    content:
      'A Reserva Federal dos Estados Unidos sinalizou uma possível mudança na política monetária, com vários membros do comité a sugerirem que cortes nas taxas de juro poderão ser considerados ainda este ano.',
    publishedDate: '2024-06-20T08:15:00Z',
    source: 'Reuters',
    url: 'https://example.com/fed-rates',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
    category: 'economy',
    sentiment: 'positive',
    views: 23100,
  },
  {
    id: '3',
    title: 'Bitcoin Quebra Resistência dos $70K',
    summary:
      'Mercados de criptomoedas em alta com Bitcoin a superar resistência chave, impulsionado pela adoção institucional e ETFs.',
    content:
      'Bitcoin conseguiu quebrar através da importante resistência dos $70.000, marcando um novo máximo histórico. Este movimento é atribuído ao crescente interesse institucional e à aprovação de novos ETFs de Bitcoin.',
    publishedDate: '2024-06-20T07:45:00Z',
    source: 'CoinDesk',
    url: 'https://example.com/bitcoin-70k',
    image: 'https://images.unsplash.com/photo-1518544866330-4e984dd64532?w=400&h=200&fit=crop',
    category: 'crypto',
    tickers: ['BTC'],
    sentiment: 'positive',
    views: 31250,
  },
  {
    id: '4',
    title: 'Mercados Europeus Reagem a Mudanças do BCE',
    summary:
      'Índices europeus mostram reações mistas após anúncio de política monetária do Banco Central Europeu.',
    content:
      'Os mercados europeus exibiram respostas variadas após o Banco Central Europeu anunciar mudanças na sua estratégia de política monetária, com alguns sectores a beneficiar enquanto outros mostraram cautela.',
    publishedDate: '2024-06-19T16:20:00Z',
    source: 'Bloomberg',
    url: 'https://example.com/ecb-policy',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop',
    category: 'market',
    sentiment: 'neutral',
    views: 8750,
  },
  {
    id: '5',
    title: 'Apple Revela Novas Funcionalidades de IA',
    summary:
      'Gigante tecnológica introduz capacidades avançadas de IA, potencialmente remodelando o panorama da tecnologia de consumo.',
    content:
      'A Apple Inc. anunciou uma integração abrangente de IA em toda a sua linha de produtos, prometendo revolucionar a experiência do utilizador e estabelecer novos padrões na indústria.',
    publishedDate: '2024-06-19T14:30:00Z',
    source: 'TechCrunch',
    url: 'https://example.com/apple-ai',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop',
    category: 'general',
    tickers: ['AAPL'],
    sentiment: 'positive',
    views: 19800,
  },
  {
    id: '6',
    title: 'Preços do Petróleo Caem Devido a Preocupações de Oferta',
    summary:
      'Futuros de crude recuam à medida que participantes do mercado avaliam disrupções na oferta versus previsões de demanda.',
    content:
      'Os mercados petrolíferos experienciaram volatilidade significativa, com preocupações sobre a oferta global a pesarem sobre as previsões de crescimento da demanda.',
    publishedDate: '2024-06-19T12:15:00Z',
    source: 'Wall Street Journal',
    url: 'https://example.com/oil-prices',
    image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400&h=200&fit=crop',
    category: 'market',
    sentiment: 'negative',
    views: 12300,
  },
  {
    id: '7',
    title: 'Microsoft Supera Expectativas de Receitas do Q4',
    summary:
      'Receitas do Azure e serviços cloud impulsionam resultados trimestrais da Microsoft, superando previsões dos analistas.',
    content:
      'A Microsoft Corporation reportou receitas do quarto trimestre que superaram as expectativas, impulsionadas pelo forte crescimento dos seus serviços de cloud computing.',
    publishedDate: '2024-06-19T11:00:00Z',
    source: 'CNBC',
    url: 'https://example.com/microsoft-q4',
    image: 'https://images.unsplash.com/photo-1633419461186-7d40221d946e?w=400&h=200&fit=crop',
    category: 'earnings',
    tickers: ['MSFT'],
    sentiment: 'positive',
    views: 18750,
  },
  {
    id: '8',
    title: 'Ethereum Prepara-se para Próxima Atualização',
    summary:
      'Rede Ethereum aproxima-se de importante upgrade que promete melhorar escalabilidade e reduzir custos de transação.',
    content:
      'A comunidade Ethereum está a preparar-se para uma das atualizações mais significativas da rede, que visa resolver questões de escalabilidade e custos elevados.',
    publishedDate: '2024-06-19T09:30:00Z',
    source: 'CryptoNews',
    url: 'https://example.com/ethereum-upgrade',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop',
    category: 'crypto',
    tickers: ['ETH'],
    sentiment: 'positive',
    views: 14200,
  },
  {
    id: '9',
    title: 'Inflação na Zona Euro Mostra Sinais de Estabilização',
    summary:
      'Últimos dados económicos indicam que a inflação na zona euro pode estar a estabilizar, oferecendo alívio aos decisores políticos.',
    content:
      'Os mais recentes indicadores económicos sugerem que a inflação na zona euro está a mostrar sinais de estabilização após meses de pressão elevada.',
    publishedDate: '2024-06-19T08:00:00Z',
    source: 'Financial Times',
    url: 'https://example.com/eurozone-inflation',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=200&fit=crop',
    category: 'economy',
    sentiment: 'neutral',
    views: 9800,
  },
  {
    id: '10',
    title: 'Nvidia Anuncia Nova Geração de Chips para IA',
    summary:
      'Líder em semicondutores revela chips de próxima geração otimizados para aplicações de inteligência artificial.',
    content:
      'A Nvidia Corporation apresentou a sua mais recente geração de processadores especializados para inteligência artificial, prometendo melhorias significativas de performance.',
    publishedDate: '2024-06-18T16:45:00Z',
    source: 'TechCrunch',
    url: 'https://example.com/nvidia-ai-chips',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
    category: 'general',
    tickers: ['NVDA'],
    sentiment: 'positive',
    views: 22100,
  },
]
