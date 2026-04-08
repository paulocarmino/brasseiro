import { Link } from "react-router-dom"
import { Beer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Beer className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="font-display text-3xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2 mb-6">Essa pagina evaporou durante a fervura...</p>
      <Link to="/">
        <Button>Voltar ao Inicio</Button>
      </Link>
    </div>
  )
}
