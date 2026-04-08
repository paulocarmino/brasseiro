import { useState } from "react"
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepCard } from "@/components/brew/StepCard"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import { DensityInput } from "@/components/brew/DensityInput"
import { FermentationDayCard } from "@/components/brew/FermentationDayCard"
import { WarningBanner } from "@/components/brew/WarningBanner"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { PhaseDefinition, FermentationDay } from "@/types/brew"

interface ResfriamentoPhaseProps {
  sessionId: string
  phase: PhaseDefinition
  onAdvance: () => void
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0]
}

export function ResfriamentoPhase({ sessionId, phase, onAdvance }: ResfriamentoPhaseProps) {
  const session = useBrewSessionStore((s) => s.getSession(sessionId))
  const { completeStep, updateSession, setStatus, addFermentationDay, updateFermentationDay } =
    useBrewSessionStore()
  const [now] = useState(() => Date.now())
  const [today] = useState(todayISO)

  if (!session) return null

  const isFermenting = session.status === "fermenting" || session.status === "conditioning"
  const isConditioning = session.status === "conditioning"

  const isStepDone = (i: number) => !!session.completedSteps[`resfriamento:${i}`]

  // Brew day steps (before fermentation starts)
  if (!isFermenting) {
    const brewDaySteps = phase.steps.slice(0, 5) // steps 0-4

    const firstPendingIdx = brewDaySteps.findIndex((_, i) => !isStepDone(i))
    const brewAllDone = firstPendingIdx === -1

    const pendingSteps = brewAllDone
      ? []
      : [{ step: brewDaySteps[firstPendingIdx], i: firstPendingIdx }]
    const completedStepsList = brewDaySteps
      .map((step, i) => ({ step, i }))
      .filter(({ i }) => isStepDone(i))

    function renderBrewStep(
      { step, i }: { step: (typeof brewDaySteps)[0]; i: number },
      done: boolean
    ) {
      if (step.type === "input" && i === 2) {
        return (
          <StepCard key={i} stepNumber={i + 1} title={step.title} isCompleted={done}>
            {!done ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <DensityInput
                  label="Densidade Original"
                  glossaryTerm="OG"
                  value={session?.ogReading}
                  onChange={(v) => updateSession(sessionId, { ogReading: v })}
                  helperText="Valor tipico: 1.035-1.080"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => completeStep(sessionId, `resfriamento:${i}`)}
                  className="mt-3"
                >
                  Anotado
                </Button>
              </>
            ) : null}
          </StepCard>
        )
      }

      return (
        <StepCard key={i} stepNumber={i + 1} title={step.title} isCompleted={done}>
          {!done ? (
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
                onClick={() => completeStep(sessionId, `resfriamento:${i}`)}
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
        {pendingSteps.map((entry) => renderBrewStep(entry, false))}

        {brewAllDone && (
          <Button
            onClick={() => {
              setStatus(sessionId, "fermenting")
            }}
            className="w-full h-12 gap-2"
          >
            Iniciar Fermentacao
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        {completedStepsList.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Concluidos</p>
            {completedStepsList.map((entry) => renderBrewStep(entry, true))}
          </div>
        )}
      </div>
    )
  }

  // Fermentation tracker (multi-day)
  const daysSinceStart = session.fermentationStartedAt
    ? Math.floor((now - session.fermentationStartedAt) / (1000 * 60 * 60 * 24)) + 1
    : 1

  const hasToday = session.fermentationDays.some((d) => d.date === today)

  function addTodayEntry() {
    const newDay: FermentationDay = {
      date: today,
      iceSwappedMorning: false,
      iceSwappedEvening: false,
      notes: "",
    }
    addFermentationDay(sessionId, newDay)
  }

  function startColdCrash() {
    setStatus(sessionId, "conditioning")
  }

  // Conditioning countdown
  const conditioningDays = session.conditioningStartedAt
    ? Math.floor((now - session.conditioningStartedAt) / (1000 * 60 * 60 * 24)) + 1
    : 0

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="text-base px-4 py-1">
          {isConditioning
            ? `Cold Crash — Dia ${conditioningDays}/5`
            : `Fermentacao — Dia ${daysSinceStart}`}
        </Badge>
        {!isConditioning && (
          <p className="text-sm text-muted-foreground">
            {session.fermentationType === "cooler"
              ? "Troque o gelo de manha e a noite. Mantenha abaixo de 20°C."
              : "Mantenha o frigobar entre 16-20°C. Confira a temperatura diariamente."}
          </p>
        )}
        {isConditioning && (
          <p className="text-sm text-muted-foreground">
            Mantenha na geladeira. Minimo 5 dias para clarificar.
          </p>
        )}
      </div>

      <WarningBanner>
        {isConditioning
          ? "Nao abra ou balance o fermentador! A levedura esta decantando."
          : session.fermentationType === "cooler"
            ? "Mantenha a temperatura abaixo de 20°C! Troque o gelo de manha e a noite."
            : "Mantenha o frigobar entre 16-20°C. Nao abra a porta desnecessariamente."}
      </WarningBanner>

      {/* Fermentation day entries */}
      {!isConditioning && (
        <>
          <div className="space-y-3">
            {session.fermentationDays.map((day, i) => (
              <FermentationDayCard
                key={day.date}
                dayNumber={i + 1}
                day={day}
                fermentationType={session.fermentationType}
                isToday={day.date === today}
                onUpdate={(updates) => updateFermentationDay(sessionId, day.date, updates)}
              />
            ))}
          </div>

          {!hasToday && (
            <Button variant="outline" onClick={addTodayEntry} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Adicionar registro de hoje
            </Button>
          )}

          <Separator />

          <div className="space-y-3">
            <DensityInput
              label="Densidade Final"
              glossaryTerm="FG"
              value={session.fgReading}
              onChange={(v) => updateSession(sessionId, { fgReading: v })}
              helperText="Quando a FG parar de baixar por 2-3 dias, a fermentacao terminou. Tipico: 1.006-1.015."
            />

            {session.ogReading && session.fgReading && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
                <p className="text-sm text-muted-foreground">ABV estimado</p>
                <p className="font-mono text-2xl font-bold text-primary">
                  {((session.ogReading - session.fgReading) * 131.25).toFixed(1)}%
                </p>
              </div>
            )}

            <div className="space-y-2">
              {daysSinceStart < 6 && (
                <p className="text-xs text-muted-foreground text-center">
                  Recomendado esperar pelo menos 6 dias antes do cold crash (dia {daysSinceStart}/6)
                </p>
              )}
              <Button onClick={startColdCrash} className="w-full h-12 gap-2">
                Iniciar Cold Crash (Geladeira)
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Conditioning phase */}
      {isConditioning && (
        <div className="space-y-2">
          {conditioningDays < 4 && (
            <p className="text-xs text-muted-foreground text-center">
              Recomendado pelo menos 4 dias de cold crash (dia {conditioningDays}/4)
            </p>
          )}
        <Button onClick={onAdvance} className="w-full h-12 gap-2">
          Proximo: Envase
          <ArrowRight className="h-4 w-4" />
        </Button>
        </div>
      )}
    </div>
  )
}
