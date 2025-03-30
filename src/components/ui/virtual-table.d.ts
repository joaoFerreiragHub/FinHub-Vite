import { ReactNode } from 'react'
type Props<T> = {
  data: T[]
  columns: {
    key: keyof T
    header: string
    render?: (value: T[keyof T], row: T) => ReactNode
  }[]
}
export declare function VirtualTable<T>({
  data,
  columns,
}: Props<T>): import('react/jsx-runtime').JSX.Element
export {}
