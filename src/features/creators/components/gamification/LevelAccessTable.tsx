// 3. LevelAccessTable.tsx
// Tabela que mostra os acessos por nível

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

const featureAccess = [
  { feature: 'Publicar Reels', access: [true, true, true, true, true] },
  { feature: 'Publicar Ficheiros', access: [true, true, true, true, true] },
  { feature: 'Estatísticas (KPIs)', access: [false, true, true, true, true] },
  { feature: 'Artigos / Podcasts', access: [false, true, true, true, true] },
  { feature: 'Publicidade e Ads', access: [false, false, false, true, true] },
  { feature: 'Lives e Cursos', access: [false, false, true, true, true] },
  { feature: 'Promoções especiais', access: [false, false, false, false, true] },
]

export function LevelAccessTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acessos por Nível</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Funcionalidade</th>
              {[1, 2, 3, 4, 5].map((n) => (
                <th key={n}>Nível {n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureAccess.map(({ feature, access }) => (
              <tr key={feature}>
                <td>{feature}</td>
                {access.map((val, i) => (
                  <td key={i} className="text-center">
                    {val ? '✅' : '❌'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
