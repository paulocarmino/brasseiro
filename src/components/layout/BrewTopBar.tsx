import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Beer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBrewSessionStore } from "@/stores/brewSessionStore"

export function BrewTopBar() {
  const navigate = useNavigate()
  const { id } = useParams()
  const session = useBrewSessionStore((s) => s.sessions.find((sess) => sess.id === id))

  if (!session) return null

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Beer className="h-6 w-6 text-primary shrink-0" />
          <span className="truncate font-display text-lg font-bold">{session.name}</span>
        </div>
      </div>
    </header>
  )
}
