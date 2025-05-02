import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"


interface ArticleTopicDropdownProps {
  value: string
  onChange: (value: string) => void
}

const topics = [
  "ETFs",
  "Ações",
  "REITs",
  "Cripto Moedas",
  "Finanças Pessoais",
  "Poupança",
  "Imobiliário",
  "Obrigações",
  "Fundos Mútuos",
  "Empreendedorismo",
  "Futuros e Opções",
  "Trading",
]

export default function ArticleTopicDropdown({ value, onChange }: ArticleTopicDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Seleciona um tópico" />
      </SelectTrigger>
      <SelectContent>
        {topics.map(topic => (
          <SelectItem key={topic} value={topic}>
            {topic}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
