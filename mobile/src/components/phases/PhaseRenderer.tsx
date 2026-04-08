import { PreparacaoPhase } from "./PreparacaoPhase"
import { MosturaPhase } from "./MosturaPhase"
import { FervuraPhase } from "./FervuraPhase"
import { ResfriamentoPhase } from "./ResfriamentoPhase"
import { EnvasePhase } from "./EnvasePhase"
import type { BrewSession, PhaseDefinition } from "@/types/brew"

interface PhaseRendererProps {
  session: BrewSession
  phases: PhaseDefinition[]
}

export function PhaseRenderer({ session, phases }: PhaseRendererProps) {
  const currentPhase = phases.find((p) => p.id === session.currentPhase)
  if (!currentPhase) return null

  switch (session.currentPhase) {
    case "preparacao":
      return <PreparacaoPhase phase={currentPhase} session={session} />
    case "mostura":
      return <MosturaPhase phase={currentPhase} session={session} />
    case "fervura":
      return <FervuraPhase phase={currentPhase} session={session} />
    case "resfriamento":
      return <ResfriamentoPhase phase={currentPhase} session={session} />
    case "envase":
      return <EnvasePhase phase={currentPhase} session={session} />
    default:
      return null
  }
}
