interface DCFParams {
  fcff: number      // Free Cash Flow atual
  growthRate: number // crescimento anual nos próximos 5 anos (ex: 0.10 = 10%)
  g: number         // crescimento perpétuo após 5 anos (ex: 0.025)
  wacc: number      // taxa de desconto (ex: 0.09 = 9%)
}

export function simulateDCF({ fcff, growthRate, g, wacc }: DCFParams): number {
  const years = 5
  let totalDCF = 0

  for (let t = 1; t <= years; t++) {
    const fcf_t = fcff * Math.pow(1 + growthRate, t)
    const discountedFCF = fcf_t / Math.pow(1 + wacc, t)
    totalDCF += discountedFCF
  }

  // FCF no ano 5
  const fcf5 = fcff * Math.pow(1 + growthRate, years)

  // Valor Terminal (TV)
  const terminalValue = (fcf5 * (1 + g)) / (wacc - g)
  const discountedTV = terminalValue / Math.pow(1 + wacc, years)

  return totalDCF + discountedTV
}
