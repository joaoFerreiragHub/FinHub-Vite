import { FormDataType } from '@/features/auth/types/creatorForm'
import { topicOptions } from "./constants"
import { Textarea } from "../../ui/textarea"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Calendar } from "../../ui/calendar"
import { Checkbox } from "../../ui/checkbox"
import { CalendarIcon, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { ScrollArea } from "../../ui/scroll-area"
import { cn } from "../../../lib/utils"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

export interface StepExtraProps {
  formData: FormDataType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  attemptedSubmit: boolean
  onBack: () => void
}

export default function StepExtra({
  formData,
  onChange,
  setFormData,
  isSubmitting,
  attemptedSubmit,
  onBack
}: StepExtraProps) {
  return (
    <>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onChange}
          placeholder="Conta-nos um pouco sobre ti..."
        />
      </div>

      <div>
        <Label>Data de Nascimento *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                attemptedSubmit && !formData.dateOfBirth && "border-red-500 text-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dateOfBirth
                ? format(formData.dateOfBirth, "dd/MM/yyyy")
                : "Escolher data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.dateOfBirth ?? undefined}
              onSelect={(date) =>
                setFormData((prev) => ({ ...prev, dateOfBirth: date ?? null }))
              }
              initialFocus
              locale={pt}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Tópicos Favoritos *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                attemptedSubmit && formData.topics.length === 0 && "border-red-500 text-red-500"
              )}
            >
              {formData.topics.length
                ? formData.topics.join(", ")
                : "Seleciona até 3 tópicos"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-2">
            <ScrollArea className="max-h-60">
              <div className="grid gap-2">
                {topicOptions.map((topic) => {
                  const checked = formData.topics.includes(topic.value)
                  return (
                    <Button
                      key={topic.value}
                      type="button"
                      onClick={() => {
                        const already = formData.topics.includes(topic.value)
                        const newTopics = already
                          ? formData.topics.filter((t) => t !== topic.value)
                          : [...formData.topics, topic.value]
                        setFormData((prev) => ({
                          ...prev,
                          topics: newTopics.slice(0, 3)
                        }))
                      }}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-md text-left text-sm transition hover:bg-accent",
                        checked && "bg-muted font-medium"
                      )}
                    >
                      {topic.label}
                      {checked && <Check className="h-4 w-4" />}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {(["termsAgreement", "contentLicenseAgreement", "paymentTermsAgreement"] as const).map(
        (key) => (
          <div className="flex items-start gap-2" key={key}>
            <Checkbox
              id={key}
              checked={formData[key]}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, [key]: !!checked }))
              }
              className={cn(!formData[key] && attemptedSubmit && "border-red-500")}
            />
            <Label htmlFor={key} className="text-sm">
              {key === "termsAgreement"
                ? "Eu aceito os Termos de Serviço e Diretrizes de Conteúdo *"
                : key === "contentLicenseAgreement"
                ? "Eu aceito os Termos de Licenciamento de Conteúdo *"
                : "Eu aceito os Termos de Pagamento *"}
            </Label>
          </div>
        )
      )}

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          ← Voltar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A criar..." : "Criar Conta"}
        </Button>
      </div>
    </>
  )
}
