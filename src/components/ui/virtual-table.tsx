import { ReactNode } from 'react'

type Props<T> = {
  data: T[]
  columns: {
    key: keyof T
    header: string
    render?: (value: T[keyof T], row: T) => ReactNode
  }[]
}

export function VirtualTable<T>({ data, columns }: Props<T>) {
  if (!data.length) return <div className="p-4 text-muted-foreground">Sem dados para mostrar.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted">
            {columns.map((col) => (
              <th key={col.key as string} className="text-left p-2 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/30">
              {columns.map((col) => (
                <td key={col.key as string} className="p-2">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
