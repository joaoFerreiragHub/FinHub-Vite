// Mapeamento dos principais indicadores por setor
export const indicadoresPorSetor: Record<string, string[]> = {
  'Tecnologia': [
    'MRR',
    'Crescimento da Receita',
    'Margem Bruta',
    'Margem EBITDA',
    'ROIC',
    'P/L',
    'P/VPA',
    'P/S',
    'P/LPA'
  ],
  'Bancos': [
    'ROE',
    'Índice de Eficiência',
    'Índice de Basileia',
    'Alavancagem Financeira',
    'Liquidez Corrente',
    'Índice de Inadimplência',
    'Cobertura de Provisões'
  ],
  'REITs': [
    'Dividend Yield',
    'P/VPA',
    'Taxa de Ocupação',
    'Cap Rate',
    'Cobertura de Juros',
    'Dívida Líquida/EBITDA'
  ],
  'Bens de Consumo': [
    'Margem Bruta',
    'Margem EBITDA',
    'Crescimento da Receita',
    'ROE',
    'P/L',
    'P/VPA',
    'P/S'
  ],
  'Indústria': [
    'Margem EBITDA',
    'ROIC',
    'Alavancagem Financeira',
    'Cobertura de Juros',
    'Liquidez Corrente',
    'Rotatividade de Estoques'
  ],
  'Saúde': [
    'Investimento em P&D',
    'Margem Bruta',
    'P/L',
    'P/S',
    'ROIC',
    'Liquidez Corrente'
  ],
  'Energia': [
    'Margem EBITDA',
    'P/L',
    'P/VPA',
    'Endividamento',
    'Cobertura de Juros',
    'Liquidez Corrente'
  ],
  'Construção': [
    'Endividamento',
    'Margem Bruta',
    'Liquidez Corrente',
    'ROIC',
    'Rotatividade de Estoques',
    'P/VPA'
  ],
  'Aviação': [
    'CASK',
    'RASK',
    'Índice de Ocupação',
    'Endividamento',
    'Liquidez Corrente',
    'Cobertura de Juros'
  ],
  'Varejo': [
    'Margem Bruta',
    'Margem EBITDA',
    'Rotatividade de Estoques',
    'Liquidez Corrente',
    'P/L',
    'P/S'
  ]
};
