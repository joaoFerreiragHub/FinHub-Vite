import { Button } from '@/components/ui'
import { Download, FileText } from 'lucide-react'

export function ExportButtons() {
  const handleExportPDF = () => {
    console.log('Exportar para PDF')
    // aqui poderás ligar com jsPDF, react-pdf, etc.
  }

  const handleExportExcel = () => {
    console.log('Exportar para Excel')
    // aqui poderás usar SheetJS, xlsx ou outra lib
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        PDF
      </Button>
      <Button variant="outline" onClick={handleExportExcel} className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Excel
      </Button>
    </div>
  )
}
