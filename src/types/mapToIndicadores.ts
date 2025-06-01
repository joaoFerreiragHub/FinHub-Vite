import { StockData } from "./stocks"


export const mapToIndicadores = (data: StockData): Record<string, string> => {
  return {
    // Comuns
    'P/L': data.pe,
    'P/VPA': '', // Se tiveres este dado noutro campo, mapeia
    'P/S': '',

    'ROE': data.roe,
    'ROIC': data.roic,
    'Margem Bruta': data.margemBruta,
    'Margem EBITDA': data.margemEbitda,
    'Margem Operacional': '',

    'Liquidez Corrente': data.currentRatio,
    'Cobertura de Juros': data.interestCoverage,
    'Endividamento': data.debtToEBITDA, // ou outro campo que faças sentido

    'MRR': '', // se não tiveres, põe ''
    'Crescimento da Receita': data.receitaGrowth5y,
    'Rotatividade de Estoques': '',

    'Dividend Yield': data.dividendYield,
    'Índice de Eficiência': '',
    'Índice de Basileia': '',
    'Alavancagem Financeira': data.debtToEquity,
    'Índice de Inadimplência': '',
    'Cobertura de Provisões': '',

    'Investimento em P&D': '',
    'Cap Rate': '',
    'Taxa de Ocupação': '',
    'P/LPA': data.eps, // Se usares EPS como base
  }
}
