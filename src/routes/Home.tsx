import { Link } from "react-router-dom"
import { Beer, Plus, ArrowRight, ListChecks, Timer, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useBrewSessionStore } from "@/stores/brewSessionStore"

const phaseLabels: Record<string, string> = {
  preparacao: "Preparacao",
  mostura: "Mostura",
  fervura: "Fervura",
  resfriamento: "Fermentacao",
  envase: "Envase",
}

export function Home() {
  const activeSession = useBrewSessionStore((s) => s.getActiveSession())
  const sessions = useBrewSessionStore((s) => s.sessions)
  const completedSessions = sessions.filter((s) => s.status === "completed")

  return (
    <div className="space-y-8">
      <div className="space-y-4 pt-8 pb-2">
        <div className="text-center space-y-1">
          <Beer className="mx-auto h-12 w-12 text-primary" />
          <h1 className="font-display text-3xl font-bold">Brasseiro</h1>
        </div>

        <p className="text-center text-muted-foreground text-sm leading-relaxed">
          Um checklist passo a passo para brassagem BIAB.
          <br />
          Ideal para quem esta comecando e nao quer se perder no processo.
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ListChecks className="h-3.5 w-3.5 text-primary/70" />
            <span>Checklist</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="h-3.5 w-3.5 text-primary/70" />
            <span>Timers</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary/70" />
            <span>Glossario</span>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/60">
          Inspirado nos ensinamentos de{" "}
          <a
            href="https://www.cervejafacil.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary/70 transition-colors"
          >
            Leandro — cervejafacil.com
          </a>
        </p>
      </div>

      {activeSession && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Brassagem em andamento</p>
                <h2 className="font-display text-lg font-bold">{activeSession.name}</h2>
                <p className="text-sm text-primary">
                  {activeSession.status === "fermenting"
                    ? "Fermentando"
                    : activeSession.status === "conditioning"
                      ? "Maturando (Cold Crash)"
                      : (phaseLabels[activeSession.currentPhase] ?? activeSession.currentPhase)}
                </p>
              </div>
              <Link to={`/brassagem/${activeSession.id}`}>
                <Button className="gap-2">
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Link to="/nova-brassagem" className="block">
        <Card className="cursor-pointer transition-colors hover:border-primary/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Nova Brassagem</h2>
              <p className="text-sm text-muted-foreground">Iniciar uma nova sessao de brassagem</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      {completedSessions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Historico</h3>
            <Link to="/historico" className="text-sm text-primary hover:underline">
              Ver todas
            </Link>
          </div>
          {completedSessions.slice(0, 3).map((session) => (
            <Card key={session.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{session.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                {session.ogReading && session.fgReading && (
                  <span className="text-sm font-mono text-accent">
                    {((session.ogReading - session.fgReading) * 131.25).toFixed(1)}% ABV
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
