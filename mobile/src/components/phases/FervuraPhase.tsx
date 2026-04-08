import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ArrowRight, Check } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { StepCard } from "@/components/brew/StepCard"
import { CountdownTimer } from "@/components/brew/CountdownTimer"
import { WarningBanner } from "@/components/brew/WarningBanner"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import { MeanwhileTask } from "@/components/brew/MeanwhileTask"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import { useTimer } from "@/hooks/useTimer"
import type { PhaseDefinition, BrewSession } from "@/types/brew"

interface FervuraPhaseProps {
  phase: PhaseDefinition
  session: BrewSession
}

export function FervuraPhase({ phase, session }: FervuraPhaseProps) {
  const c = useThemeColors()
  const completeStep = useBrewSessionStore((s) => s.completeStep)
  const toggleStep = useBrewSessionStore((s) => s.toggleStep)
  const setPhase = useBrewSessionStore((s) => s.setPhase)
  const timer = useTimer()

  const currentStepIndex = session.currentStepIndex

  function isStepDone(index: number) {
    return !!session.completedSteps[`fervura:${index}`]
  }

  function handleDone(index: number) {
    completeStep(session.id, `fervura:${index}`)
    useBrewSessionStore.getState().advanceStep(session.id)
  }

  const allDone = phase.steps.every((_, i) => isStepDone(i))

  return (
    <View>
      {phase.steps.map((step, index) => {
        const done = isStepDone(index)
        const isPending = index === currentStepIndex && !done

        if (done && index < currentStepIndex) return null
        if (index > currentStepIndex + 1 && !done) return null

        if (step.type === "warning") {
          if (!isPending) return null
          return (
            <View key={index}>
              <WarningBanner message={step.warning || step.description} variant="danger" />
              <TouchableOpacity
                style={[styles.doneBtn, { backgroundColor: c.primary }]}
                onPress={() => handleDone(index)}
              >
                <Check size={16} color={c.primaryForeground} />
                <Text style={[styles.doneBtnText, { color: c.primaryForeground }]}>
                  Entendi
                </Text>
              </TouchableOpacity>
            </View>
          )
        }

        if (step.type === "timer") {
          const timerId = `fervura-${session.id}`
          const timerConfig = step.timerConfig!
          const isTimerForThis = timer.activeTimerId === timerId

          return (
            <StepCard key={index} number={index + 1} title={step.title}>
              <Text style={[styles.description, { color: c.mutedForeground }]}>
                {step.description}
              </Text>
              <CountdownTimer
                remainingMs={isTimerForThis ? timer.remainingMs : timerConfig.durationMin * 60 * 1000}
                totalMs={timerConfig.durationMin * 60 * 1000}
                progress={isTimerForThis ? timer.progress : 0}
                isRunning={isTimerForThis && timer.isRunning}
                isPaused={isTimerForThis && timer.isPaused}
                isComplete={isTimerForThis && timer.isComplete}
                label="Fervura"
                nextAlertLabel={isTimerForThis ? timer.nextAlert?.label : null}
                nextAlertMs={
                  isTimerForThis && timer.nextAlert
                    ? timer.nextAlert.atMs - timer.totalMs + timer.remainingMs
                    : null
                }
                onStart={() =>
                  timer.start(timerId, timerConfig.durationMin * 60 * 1000, timerConfig.alerts)
                }
                onPause={timer.pause}
                onResume={timer.resume}
                onReset={timer.reset}
                onSkip={() => {
                  timer.reset()
                  handleDone(index)
                }}
              />
              {isTimerForThis && timer.isComplete && !done && (
                <TouchableOpacity
                  style={[styles.doneBtn, { backgroundColor: c.primary }]}
                  onPress={() => handleDone(index)}
                >
                  <ArrowRight size={16} color={c.primaryForeground} />
                  <Text style={[styles.doneBtnText, { color: c.primaryForeground }]}>
                    Continuar
                  </Text>
                </TouchableOpacity>
              )}
              {step.scienceNote && <ScienceTooltip note={step.scienceNote} />}
            </StepCard>
          )
        }

        if (step.type === "parallel") {
          return (
            <MeanwhileTask
              key={index}
              step={step}
              completedSteps={session.completedSteps}
              sessionId={session.id}
              onToggleItem={(key) => toggleStep(session.id, key)}
              onComplete={() => handleDone(index)}
            />
          )
        }

        if (!isPending) return null

        return (
          <StepCard key={index} number={index + 1} title={step.title}>
            <Text style={[styles.description, { color: c.mutedForeground }]}>
              {step.description}
            </Text>
            {step.scienceNote && <ScienceTooltip note={step.scienceNote} />}
            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: c.primary }]}
              onPress={() => handleDone(index)}
            >
              <Check size={16} color={c.primaryForeground} />
              <Text style={[styles.doneBtnText, { color: c.primaryForeground }]}>
                Feito
              </Text>
            </TouchableOpacity>
          </StepCard>
        )
      })}

      {allDone && (
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: c.primary }]}
          onPress={() => setPhase(session.id, "resfriamento")}
        >
          <Text style={[styles.nextBtnText, { color: c.primaryForeground }]}>
            Proximo: Resfriamento
          </Text>
          <ArrowRight size={18} color={c.primaryForeground} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  description: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  doneBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  nextBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.base,
  },
})
