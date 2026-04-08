import { Check, ClipboardCheck, Thermometer, Flame, Snowflake, Wine } from "lucide-react"
import type { BrewPhase } from "@/types/brew"
import type { LucideIcon } from "lucide-react"

const phases: { id: BrewPhase; label: string; icon: LucideIcon }[] = [
  { id: "preparacao", label: "Prep", icon: ClipboardCheck },
  { id: "mostura", label: "Mostura", icon: Thermometer },
  { id: "fervura", label: "Fervura", icon: Flame },
  { id: "resfriamento", label: "Ferm.", icon: Snowflake },
  { id: "envase", label: "Envase", icon: Wine },
]

interface PhaseWizardProps {
  currentPhase: BrewPhase
}

export function PhaseWizard({ currentPhase }: PhaseWizardProps) {
  const currentPhaseIndex = phases.findIndex((p) => p.id === currentPhase)

  return (
    <div className="flex items-start gap-1">
      {phases.map((phase, i) => {
        const isCompleted = i < currentPhaseIndex
        const isCurrent = i === currentPhaseIndex
        const Icon = isCompleted ? Check : phase.icon
        const isLast = i === phases.length - 1

        return (
          <div key={phase.id} className="flex flex-1 flex-col items-center gap-1.5">
            {/* Icon + connector row */}
            <div className="flex w-full items-center">
              {/* Left connector (invisible on first) */}
              <div
                className={`h-0.5 flex-1 rounded-full ${
                  i === 0
                    ? "bg-transparent"
                    : i <= currentPhaseIndex
                      ? "bg-success"
                      : "bg-muted"
                }`}
              />

              {/* Icon circle */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? "bg-success text-success-foreground"
                    : isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Right connector (invisible on last) */}
              <div
                className={`h-0.5 flex-1 rounded-full ${
                  isLast
                    ? "bg-transparent"
                    : i < currentPhaseIndex
                      ? "bg-success"
                      : "bg-muted"
                }`}
              />
            </div>

            {/* Label */}
            <span
              className={`text-xs font-medium ${
                isCurrent
                  ? "text-primary"
                  : isCompleted
                    ? "text-success"
                    : "text-muted-foreground"
              }`}
            >
              {phase.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
