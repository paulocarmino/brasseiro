import { useEffect, useState } from "react"
import type { BrewPhase } from "@/types/brew"

const phaseEmojis: Record<BrewPhase, string> = {
  preparacao: "📋",
  mostura: "🌡️",
  fervura: "🔥",
  resfriamento: "❄️",
  envase: "🍺",
}

const phaseMessages: Record<BrewPhase, string> = {
  preparacao: "Bora organizar tudo!",
  mostura: "Hora de cozinhar os graos!",
  fervura: "Lupulo entrando em acao!",
  resfriamento: "Quase la, cervejeiro!",
  envase: "A reta final!",
}

interface PhaseTransitionProps {
  phase: BrewPhase
  title: string
  onDismiss: () => void
}

export function PhaseTransition({ phase, title, onDismiss }: PhaseTransitionProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300) // wait for fade out
    }, 2500)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onDismiss}
    >
      <div className="text-center space-y-4">
        <span className="text-6xl block">{phaseEmojis[phase]}</span>
        <h2 className="font-display text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{phaseMessages[phase]}</p>
      </div>
    </div>
  )
}
