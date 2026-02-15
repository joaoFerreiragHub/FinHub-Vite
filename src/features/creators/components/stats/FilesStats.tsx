import { useState } from 'react'

import { FileText, DownloadCloud, PieChart, Filter } from 'lucide-react'
import { ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Tooltip } from 'recharts'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

const mockFilesStats = {
  totalFiles: 34,
  totalDownloads: 520,
  averageSizeMB: 2.4,
  topTypes: [
    { type: 'PDF', count: 18 },
    { type: 'Imagem', count: 9 },
    { type: 'Excel', count: 7 },
  ],
  files: [
    { id: '1', name: 'Guia Prático de Poupança', type: 'PDF', downloads: 140 },
    { id: '2', name: 'Infográfico Orçamento', type: 'Imagem', downloads: 98 },
    { id: '3', name: 'Template de Gastos.xlsx', type: 'Excel', downloads: 80 },
    { id: '4', name: 'Dicas Rápidas.pdf', type: 'PDF', downloads: 60 },
    { id: '5', name: 'Planeador Mensal.pdf', type: 'PDF', downloads: 50 },
    { id: '6', name: 'Resumo Visual', type: 'Imagem', downloads: 30 },
  ],
}

export default function FilesStats() {
  const [filterType, setFilterType] = useState<FileType>('Todos')
  const fileTypes = ['Todos', 'PDF', 'Imagem', 'Excel'] as const
  type FileType = (typeof fileTypes)[number]

  const filteredFiles =
    filterType === 'Todos'
      ? mockFilesStats.files
      : mockFilesStats.files.filter((f) => f.type === filterType)

  return (
    <div className="space-y-6">
      {/* KPIs + gráfico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Total de Ficheiros
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockFilesStats.totalFiles}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-green-600" />
              Downloads Totais
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {mockFilesStats.totalDownloads.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-yellow-500" />
              Tipos de Ficheiro
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={mockFilesStats.topTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {mockFilesStats.topTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filtro por tipo */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filtrar por tipo:</span>
        {fileTypes.map((type) => (
          <Button
            key={type}
            size="sm"
            variant={filterType === type ? 'default' : 'outline'}
            onClick={() => setFilterType(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Lista de ficheiros */}
      <div className="space-y-2">
        {filteredFiles.map((file) => (
          <Card key={file.id}>
            <CardContent className="flex justify-between items-center py-2">
              <div className="text-sm">{file.name}</div>
              <div className="text-sm text-muted-foreground">{file.downloads} downloads</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
