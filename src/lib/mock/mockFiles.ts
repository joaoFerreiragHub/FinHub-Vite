import { CreatorFile } from "../types/creatorFile"

export const mockCreatorFiles: CreatorFile[] = [
  {
    _id: "1",
    name: "Guia de ETFs",
    url: "/mock/guia-etfs.pdf",
    topic: "ETFs",
    mimeType: "application/pdf",
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    _id: "2",
    name: "Planilha de Ações",
    url: "/mock/acoes.xlsx",
    topic: "Ações",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    createdAt: "2024-12-03T15:30:00Z",
  },
  {
    _id: "3",
    name: "Dicas de Poupança",
    url: "/mock/dicas-poupanca.pdf",
    topic: "Poupança",
    mimeType: "application/pdf",
    createdAt: "2024-12-05T08:20:00Z",
  },
]
