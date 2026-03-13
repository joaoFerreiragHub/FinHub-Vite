import { useMemo, useState } from 'react'
import { Mail, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { Textarea } from '@/components/ui'

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'suporte@finhub.app'

const encodeMailto = (value: string) => encodeURIComponent(value.trim())

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const mailtoHref = useMemo(() => {
    const finalSubject = subject || 'Contacto via plataforma FinHub'
    const bodyLines = [
      name ? `Nome: ${name}` : '',
      email ? `Email: ${email}` : '',
      '',
      message || 'Escreve aqui a tua mensagem.',
    ].filter(Boolean)

    const body = bodyLines.join('\n')
    return `mailto:${supportEmail}?subject=${encodeMailto(finalSubject)}&body=${encodeMailto(body)}`
  }, [email, message, name, subject])

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Contacto
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Fala com a equipa FinHub
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Usa este formulario para suporte, duvidas de conta, bugs ou sugestoes de melhoria.
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nome</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="O teu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subject">Assunto</Label>
              <Input
                id="contact-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Ex.: Ajuda com autenticacao"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Mensagem</Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Descreve o tema com o maximo de contexto possivel."
                className="min-h-32"
              />
            </div>
            <div className="pt-1">
              <Button asChild>
                <a href={mailtoHref}>Enviar por email</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <article className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">Canal principal</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <Mail className="mr-2 inline h-4 w-4" />
              <a href={`mailto:${supportEmail}`} className="underline underline-offset-4">
                {supportEmail}
              </a>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Resposta tipica em dias uteis. Em casos de maior carga, podes receber atualizacao
              intermedia de estado.
            </p>
          </article>

          <article className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">Incidentes e seguranca</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <ShieldAlert className="mr-2 inline h-4 w-4" />
              Para comportamento suspeito, abuso ou risco de seguranca, inclui evidencias e links
              relevantes na mensagem.
            </p>
          </article>
        </section>
      </div>
    </div>
  )
}
