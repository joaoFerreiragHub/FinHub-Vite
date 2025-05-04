declare module '@mantine/rte' {
  import { ComponentType } from 'react'
  export const RichTextEditor: ComponentType<{
    value: string
    onChange: (value: string) => void
  }>
}
