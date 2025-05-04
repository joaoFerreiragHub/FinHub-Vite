export interface CreatorFile {
  _id: string            // usado em delete e keys
  name: string           // exibição principal (title)
  url: string            // usado no botão "Descarregar"
  topic?: string         // categoria opcional
  mimeType?: string      // para ícones
  createdAt?: string     // exibição opcional
}
