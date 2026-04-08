import { useRef, useCallback } from "react"
import { ArrowRight, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepCard } from "@/components/brew/StepCard"
import { WarningBanner } from "@/components/brew/WarningBanner"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import { CountdownTimer } from "@/components/brew/CountdownTimer"
import { TimerFloatingBar } from "@/components/brew/TimerFloatingBar"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { PhaseDefinition } from "@/types/brew"

interface MosturaPhaseProps {
  sessionId: string
  phase: PhaseDefinition
  onAdvance: () => void
}

export function MosturaPhase({ sessionId, phase, onAdvance }: MosturaPhaseProps) {
  const session = useBrewSessionStore((s) => s.getSession(sessionId))
  const { completeStep, toggleStep } = useBrewSessionStore()
  const timerRef = useRef<HTMLDivElement>(null)

  const handleTimerComplete = useCallback(() => {
    completeStep(sessionId, "mostura:timer")
  }, [sessionId, completeStep])

  if (!session) return null

  const actionSteps = phase.steps.filter((s) => s.type !== "warning")

  const warningsBefore: Record<number, string> = {}
  for (let i = 0; i < phase.steps.length; i++) {
    if (phase.steps[i].type === "warning" && i + 1 < phase.steps.length) {
      const nextActionIndex = actionSteps.findIndex((s) => s.index === phase.steps[i + 1].index)
      if (nextActionIndex >= 0) {
        warningsBefore[nextActionIndex] = phase.steps[i].warning ?? phase.steps[i].description
      }
    }
  }

  const stepKey = (i: number, step: (typeof actionSteps)[0]) =>
    step.type === "timer" ? "mostura:timer" : `mostura:${i}`

  const isStepDone = (i: number, step: (typeof actionSteps)[0]) =>
    !!session.completedSteps[stepKey(i, step)]

  // Find the first pending step — that's the current one to show
  const firstPendingIndex = actionSteps.findIndex((step, i) => !isStepDone(i, step))
  const allDone = firstPendingIndex === -1

  // Current step = first pending. Completed = everything before it + anything else marked done.
  const pendingSteps = allDone
    ? []
    : [{ step: actionSteps[firstPendingIndex], i: firstPendingIndex }]
  const completedStepsList = actionSteps
    .map((step, i) => ({ step, i }))
    .filter(({ step, i }) => isStepDone(i, step))

  function renderStep({ step, i }: { step: (typeof actionSteps)[0]; i: number }, done: boolean) {
    const warning = warningsBefore[i]

    if (step.type === "timer") {
      return (
        <div key={i} className="space-y-3">
          {warning && !done && <WarningBanner variant="danger">{warning}</WarningBanner>}
          <StepCard stepNumber={i + 1} title={step.title} isCompleted={done}>
            {!done ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                <div ref={timerRef}>
                  <CountdownTimer
                    timerId={`mostura-${sessionId}`}
                    durationMin={step.timerConfig!.durationMin}
                    alerts={step.timerConfig!.alerts}
                    label="Mostura"
                    onComplete={handleTimerComplete}
                  />
                </div>
                {step.scienceNote && (
                  <div className="mt-4">
                    <ScienceTooltip>{step.scienceNote}</ScienceTooltip>
                  </div>
                )}
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={() => toggleStep(sessionId, "mostura:timer")}
              >
                <Undo2 className="h-3.5 w-3.5" />
                Reabrir timer
              </Button>
            )}
          </StepCard>
        </div>
      )
    }

    return (
      <div key={i} className="space-y-3">
        {warning && !done && <WarningBanner variant="danger">{warning}</WarningBanner>}
        <StepCard stepNumber={i + 1} title={step.title} isCompleted={done}>
          {!done && (
            <>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {step.scienceNote && (
                <div className="mt-3">
                  <ScienceTooltip>{step.scienceNote}</ScienceTooltip>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => completeStep(sessionId, `mostura:${i}`)}
                className="mt-3"
              >
                Feito
              </Button>
            </>
          )}
        </StepCard>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pendingSteps.map((entry) => renderStep(entry, false))}

      {allDone && (
        <Button onClick={onAdvance} className="w-full h-12 gap-2">
          Proximo: Fervura
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {completedStepsList.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Concluidos</p>
          {completedStepsList.map((entry) => renderStep(entry, true))}
        </div>
      )}

      <TimerFloatingBar timerElementRef={timerRef} label="Mostura" />
    </div>
  )
}
