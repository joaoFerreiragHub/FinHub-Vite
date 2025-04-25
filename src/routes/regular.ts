import { UserRole } from "../stores/useUserStore"
import { LayoutDashboard, Wrench, BookOpen, Settings2 } from "lucide-react"

export const regularRoutes = [
  {
    path: "/dashboard",
    label: "Painel Público",
    icon: LayoutDashboard,
    allowedRoles: ["regular", "premium", "creator", "admin"] as UserRole[],
  },
  {
    path: "/tools",
    label: "Ferramentas Públicas",
    icon: Wrench,
    allowedRoles: ["regular", "premium", "creator", "admin"] as UserRole[],
  },
  {
    path: "/conteudos",
    label: "Conteúdos Recomendados",
    icon: BookOpen,
    allowedRoles: ["regular", "premium", "creator", "admin"] as UserRole[],
  },
  {
    path: "/configuracoes",
    label: "Configurações",
    icon: Settings2,
    allowedRoles: ["regular", "premium", "creator", "admin"] as UserRole[],
  },
]

export default regularRoutes
