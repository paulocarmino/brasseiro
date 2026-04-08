import { useState } from "react"
import { Beer, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { SessionStatus } from "@/types/brew"

const statusLabels: Record<SessionStatus, string> = {
  active: "Em andamento",
  fermenting: "Fermentando",
  conditioning: "Maturando",
  completed: "Concluida",
}

const statusVariants: Record<SessionStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  fermenting: "secondary",
  conditioning: "secondary",
  completed: "outline",
}

export function Historico() {
  const sessions = useBrewSessionStore((s) => s.sessions)
  const deleteSession = useBrewSessionStore((s) => s.deleteSession)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const pastSessions = sessions.filter((s) => s.status !== "active")

  if (pastSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Beer className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold">Historico vazio</h1>
        <p className="text-muted-foreground mt-2">Suas brassagens completas aparecerao aqui.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Historico</h1>

      <div className="space-y-3">
        {pastSessions.map((session) => {
          const abv =
            session.ogReading && session.fgReading
              ? ((session.ogReading - session.fgReading) * 131.25).toFixed(1)
              : null

          return (
            <Card key={session.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-bold">{session.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.createdAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant={statusVariants[session.status]}>
                    {statusLabels[session.status]}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {session.ogReading && (
                    <span>
                      <span className="text-muted-foreground">OG:</span>{" "}
                      <span className="font-mono">{session.ogReading.toFixed(3)}</span>
                    </span>
                  )}
                  {session.fgReading && (
                    <span>
                      <span className="text-muted-foreground">FG:</span>{" "}
                      <span className="font-mono">{session.fgReading.toFixed(3)}</span>
                    </span>
                  )}
                  {abv && (
                    <span>
                      <span className="text-muted-foreground">ABV:</span>{" "}
                      <span className="font-mono text-primary font-bold">{abv}%</span>
                    </span>
                  )}
                  <span>
                    <span className="text-muted-foreground">Envase:</span>{" "}
                    {session.envaseType === "priming" ? "Priming" : "CO2"}
                  </span>
                </div>

                {session.hops.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Lupulos: {session.hops.map((h) => `${h.name} (${h.grams}g)`).join(", ")}
                  </p>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(session.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir brassagem?</DialogTitle>
            <DialogDescription>Essa acao nao pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) deleteSession(deleteId)
                setDeleteId(null)
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
