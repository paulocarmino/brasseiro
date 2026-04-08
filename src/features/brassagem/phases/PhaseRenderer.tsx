import { useState, useCallback, useMemo } from "react"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import { useTimerStore } from "@/stores/timerStore"
import { buildPhaseSteps } from "@/mocks/phases"
import { PhaseTransition } from "@/components/brew/PhaseTransition"
import { PreparacaoPhase } from "./PreparacaoPhase"
import { MosturaPhase } from "./MosturaPhase"
import { FervuraPhase } from "./FervuraPhase"
import { ResfriamentoPhase } from "./ResfriamentoPhase"
import { EnvasePhase } from "./EnvasePhase"
import type { BrewPhase } from "@/types/brew"

const phaseOrder: BrewPhase[] = ["preparacao", "mostura", "fervura", "resfriamento", "envase"]

interface PhaseRendererProps {
  sessionId: string
}

export function PhaseRenderer({ sessionId }: PhaseRendererProps) {
  const session = useBrewSessionStore((s) => s.getSession(sessionId))
  const setPhase = useBrewSessionStore((s) => s.setPhase)
  const resetTimer = useTimerStore((s) => s.resetTimer)
  const [transition, setTransition] = useState<{
    phase: BrewPhase
    title: string
  } | null>(null)

  const phases = useMemo(() => (session ? buildPhaseSteps(session) : []), [session])

  const advancePhase = useCallback(() => {
    if (!session) return
    const currentIndex = phaseOrder.indexOf(session.currentPhase)
    if (currentIndex < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIndex + 1]
      const nextPhaseData = phases.find((p) => p.id === nextPhase)

      // Reset timer when changing phases
      resetTimer()

      // Show transition
      setTransition({
        phase: nextPhase,
        title: nextPhaseData?.title ?? nextPhase,
      })

      setPhase(sessionId, nextPhase)
    }
  }, [session, sessionId, setPhase, resetTimer, phases])

  if (!session) return null

  const currentPhaseData = phases.find((p) => p.id === session.currentPhase)
  if (!currentPhaseData) return null

  return (
    <>
      {transition && (
        <PhaseTransition
          phase={transition.phase}
          title={transition.title}
          onDismiss={() => setTransition(null)}
        />
      )}

      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="font-display text-xl font-bold">{currentPhaseData.title}</h2>
          <p className="text-sm text-muted-foreground">{currentPhaseData.description}</p>
        </div>

        {session.currentPhase === "preparacao" && (
          <PreparacaoPhase
            sessionId={sessionId}
            phase={currentPhaseData}
            onAdvance={advancePhase}
          />
        )}
        {session.currentPhase === "mostura" && (
          <MosturaPhase sessionId={sessionId} phase={currentPhaseData} onAdvance={advancePhase} />
        )}
        {session.currentPhase === "fervura" && (
          <FervuraPhase sessionId={sessionId} phase={currentPhaseData} onAdvance={advancePhase} />
        )}
        {session.currentPhase === "resfriamento" && (
          <ResfriamentoPhase
            sessionId={sessionId}
            phase={currentPhaseData}
            onAdvance={advancePhase}
          />
        )}
        {session.currentPhase === "envase" && (
          <EnvasePhase sessionId={sessionId} phase={currentPhaseData} />
        )}
      </div>
    </>
  )
}
