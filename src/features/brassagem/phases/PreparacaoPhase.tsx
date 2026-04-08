import { Button } from "@/components/ui/button"
import { StepCard } from "@/components/brew/StepCard"
import { ChecklistItem } from "@/components/brew/ChecklistItem"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { PhaseDefinition } from "@/types/brew"
import { ArrowRight, CheckCheck } from "lucide-react"

interface PreparacaoPhaseProps {
  sessionId: string
  phase: PhaseDefinition
  onAdvance: () => void
}

export function PreparacaoPhase({ sessionId, phase, onAdvance }: PreparacaoPhaseProps) {
  const toggleStep = useBrewSessionStore((s) => s.toggleStep)
  const completeStep = useBrewSessionStore((s) => s.completeStep)
  const session = useBrewSessionStore((s) => s.getSession(sessionId))
  if (!session) return null

  const step = phase.steps[0]
  const items = step.checklistItems ?? []

  const allChecked = items.every((_, i) => session.completedSteps[`preparacao:0:${i}`])

  return (
    <div className="space-y-4">
      <StepCard stepNumber={1} title={step.title}>
        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

        {!allChecked && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => {
              items.forEach((_, i) => {
                const key = `preparacao:0:${i}`
                if (!session.completedSteps[key]) {
                  completeStep(sessionId, key)
                }
              })
            }}
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todos
          </Button>
        )}

        <div className="space-y-1">
          {items.map((item, i) => {
            const key = `preparacao:0:${i}`
            return (
              <ChecklistItem
                key={key}
                id={key}
                label={item}
                checked={!!session.completedSteps[key]}
                onToggle={() => toggleStep(sessionId, key)}
              />
            )
          })}
        </div>

        {step.scienceNote && (
          <div className="mt-3">
            <ScienceTooltip>{step.scienceNote}</ScienceTooltip>
          </div>
        )}
      </StepCard>

      <Button onClick={onAdvance} disabled={!allChecked} className="w-full h-12 gap-2">
        Proximo: Mostura
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
