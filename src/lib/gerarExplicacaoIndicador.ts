import { IndicadorExplicacaoContexto } from "../components/stocks/sections/indicadoresMeta"

export function gerarExplicacaoIndicador(ctx: IndicadorExplicacaoContexto): string {
  const { valor, valorAnterior, score, meta } = ctx

  if (meta.explicacaoCustom) {
    return typeof meta.explicacaoCustom === 'string'
      ? meta.explicacaoCustom
      : meta.explicacaoCustom(ctx)
  }

  if (meta.explicacaoAuto) {
    const partes = []

    // ✏️ Interpretação do score
    const scoreTexto = {
      good: 'está num nível considerado positivo',
      medium: 'está num nível aceitável, mas com margem para melhoria',
      bad: 'está num nível considerado negativo',
    }[score]

    partes.push(`O valor ${scoreTexto}.`)

    // 🟡 Avaliação da evolução (delta)
    if (meta.ajustarComDelta && valorAnterior != null) {
      const delta = Number(valor) - Number(valorAnterior)
      const melhoria = delta > 0 ? 'melhorou' : delta < 0 ? 'piorou' : 'mantém-se estável'
      partes.push(`Comparado com o ano anterior, o valor ${melhoria}.`)
    }

    // 🧠 Sensibilidade do setor
    if (meta.setorSensível) {
      partes.push(`Este indicador é especialmente relevante no setor analisado.`)
    }

    // 🔗 Indicadores complementares
    if (meta.complementar?.length) {
      partes.push(`Deve ser analisado em conjunto com: ${meta.complementar.join(', ')}.`)
    }

    return partes.join(' ')
  }

  return `Benchmark definido para o indicador "${meta.label}".`
}
