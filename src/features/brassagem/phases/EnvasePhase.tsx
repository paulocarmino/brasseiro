import { useState } from "react"
import { Beer, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StepCard } from "@/components/brew/StepCard"
import { ChecklistItem } from "@/components/brew/ChecklistItem"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { PhaseDefinition } from "@/types/brew"
import { useNavigate } from "react-router-dom"

interface EnvasePhaseProps {
  sessionId: string
  phase: PhaseDefinition
}

export function EnvasePhase({ sessionId, phase }: EnvasePhaseProps) {
  const session = useBrewSessionStore((s) => s.getSession(sessionId))
  const { completeStep, toggleStep, setStatus } = useBrewSessionStore()
  const navigate = useNavigate()
  const [showCelebration, setShowCelebration] = useState(false)

  if (!session) return null

  const isStepDone = (i: number) => !!session.completedSteps[`envase:${i}`]
  const firstPendingIndex = phase.steps.findIndex((_, i) => !isStepDone(i))
  const allDone = firstPendingIndex === -1

  function handleComplete() {
    setStatus(sessionId, "completed")
    setShowCelebration(true)
  }

  if (showCelebration) {
    const abv =
      session.ogReading && session.fgReading
        ? ((session.ogReading - session.fgReading) * 131.25).toFixed(1)
        : null

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <PartyPopper className="h-16 w-16 text-primary" />
        <h1 className="font-display text-3xl font-bold">Parabens, Brasseiro!</h1>
        <p className="text-muted-foreground">
          Sua cerveja &quot;{session.name}&quot; esta a caminho!
        </p>

        <Card className="w-full max-w-xs">
          <CardContent className="p-4 space-y-2">
            {session.ogReading && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">OG</span>
                <span className="font-mono">{session.ogReading.toFixed(3)}</span>
              </div>
            )}
            {session.fgReading && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">FG</span>
                <span className="font-mono">{session.fgReading.toFixed(3)}</span>
              </div>
            )}
            {abv && (
              <div className="flex justify-between text-sm font-bold">
                <span>ABV</span>
                <span className="text-primary">{abv}%</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envase</span>
              <span>{session.envaseType === "priming" ? "Priming (PET)" : "CO2 (Barril)"}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 w-full max-w-xs">
          <Button onClick={() => navigate("/historico")} className="w-full gap-2">
            <Beer className="h-4 w-4" />
            Ver no Historico
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
            Voltar ao Inicio
          </Button>
        </div>
      </div>
    )
  }

  const pendingStep = allDone ? null : { step: phase.steps[firstPendingIndex], i: firstPendingIndex }
  const completedStepsList = phase.steps
    .map((step, i) => ({ step, i }))
    .filter(({ i }) => isStepDone(i))

  function renderStep({ step, i }: { step: (typeof phase.steps)[0]; i: number }, done: boolean) {
    return (
      <StepCard key={i} stepNumber={i + 1} title={step.title} isCompleted={done}>
        {!done ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

            {step.checklistItems && (
              <div className="space-y-1 mb-3">
                {step.checklistItems.map((item, ci) => {
                  const key = `envase:${i}:${ci}`
                  return (
                    <ChecklistItem
                      key={key}
                      id={key}
                      label={item}
                      checked={!!session?.completedSteps[key]}
                      onToggle={() => toggleStep(sessionId, key)}
                    />
                  )
                })}
              </div>
            )}

            {step.scienceNote && (
              <div className="mt-3">
                <ScienceTooltip>{step.scienceNote}</ScienceTooltip>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => completeStep(sessionId, `envase:${i}`)}
              className="mt-3"
            >
              Feito
            </Button>
          </>
        ) : null}
      </StepCard>
    )
  }

  return (
    <div className="space-y-4">
      {pendingStep && renderStep(pendingStep, false)}

      {allDone && (
        <Button onClick={handleComplete} className="w-full h-14 text-lg gap-2">
          <Beer className="h-5 w-5" />
          Brassagem Concluida!
        </Button>
      )}

      {completedStepsList.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Concluidos</p>
          {completedStepsList.map((entry) => renderStep(entry, true))}
        </div>
      )}
    </div>
  )
}
