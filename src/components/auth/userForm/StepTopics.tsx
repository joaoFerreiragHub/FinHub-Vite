// components/userForm/StepTopics.tsx
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { ScrollArea } from "../../ui/scroll-area"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Check } from "lucide-react"
import { cn } from "../../../lib/utils"
import { FormikProps } from "formik"
import { FormValues } from "../../../types/FormValues"


const topicOptions = [
  "ETFs", "Ações", "Reits", "Cryptos", "Finanças Pessoais",
  "Poupança", "Imobiliário", "Obrigacões", "Fundos mútuos",
  "Empreendedorismo", "Futuros e Opções", "Trading",
].map((label) => ({ label, value: label }))

interface Props {
  formik: FormikProps<FormValues>
  isInvalid: (name: keyof FormValues) => boolean
  errorMessage: (name: keyof FormValues) => React.ReactNode
}

export default function StepTopics({ formik, isInvalid, errorMessage }: Props) {
  return (
    <div>
      <Label htmlFor="topics">Tópicos favoritos *</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !formik.values.topics.length && "text-muted-foreground",
              isInvalid("topics") && "border-red-500"
            )}
          >
            {formik.values.topics.length
              ? formik.values.topics.join(", ")
              : "Seleciona entre 1 a 3 tópicos"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-2">
          <ScrollArea className="max-h-80">
            <div className="grid gap-2">
              {topicOptions.map((topic) => {
                const checked = formik.values.topics.includes(topic.value)
                return (
                  <button
                    key={topic.value}
                    type="button"
                    onClick={() => {
                      const selected = formik.values.topics.includes(topic.value)
                      const newTopics = selected
                        ? formik.values.topics.filter((t) => t !== topic.value)
                        : [...formik.values.topics, topic.value]

                      formik.setFieldValue("topics", newTopics.slice(0, 3))
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-md text-left text-sm transition hover:bg-accent",
                      checked && "bg-muted font-medium"
                    )}
                  >
                    {topic.label}
                    {checked && <Check className="h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {errorMessage("topics")}
    </div>
  )
}
