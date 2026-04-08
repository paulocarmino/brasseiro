import { useParams, Navigate } from "react-router-dom"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import { PhaseRenderer } from "@/features/brassagem/phases/PhaseRenderer"
import { PhaseWizard } from "@/components/brew/PhaseWizard"

export function Brassagem() {
  const { id } = useParams()
  const session = useBrewSessionStore((s) => s.sessions.find((sess) => sess.id === id))

  if (!session || !id) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6">
      <PhaseWizard currentPhase={session.currentPhase} />
      <PhaseRenderer sessionId={id} />
    </div>
  )
}
