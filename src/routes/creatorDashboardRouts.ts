import { UserRole } from "../stores/useUserStore"
import { LayoutDashboard, FileText, BarChart, Megaphone, Settings } from "lucide-react"

export const creatorDashboardRouts = [
  {
    path: "/creators/dashboard",
    label: "Painel do Criador",
    icon: LayoutDashboard,
    allowedRoles: ["creator", "admin"] as UserRole[],
  },
  {
    path: "/creators/conteudos",
    label: "Gerir Conteúdos",
    icon: FileText,
    allowedRoles: ["creator", "admin"] as UserRole[],
  },
  {
    path: "/creators/estatisticas",
    label: "Estatísticas dos Conteúdos",
    icon: BarChart,
    allowedRoles: ["creator", "admin"] as UserRole[],
  },
  {
    path: "/creators/publicidade",
    label: "Gerir Publicidade",
    icon: Megaphone,
    allowedRoles: ["creator", "admin"] as UserRole[],
  },
  {
    path: "/creators/configuracoes", // nova rota
    label: "Configurações",
    icon: Settings,
    allowedRoles: ["creator", "admin"] as UserRole[],
  }
]
