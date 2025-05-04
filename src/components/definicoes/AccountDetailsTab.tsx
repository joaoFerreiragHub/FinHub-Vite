import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function AccountDetailsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <img
          src="/default-avatar.png"
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <Button variant="outline">Alterar Imagem</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="sergiocriador" />
        </div>
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" defaultValue="Sérgio" />
        </div>
        <div>
          <Label htmlFor="lastName">Apelido</Label>
          <Input id="lastName" defaultValue="Criador" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue="sergio@finhub.pt" type="email" />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Input id="bio" defaultValue="Sou apaixonado por educação financeira." />
      </div>
    </div>
  )
}
