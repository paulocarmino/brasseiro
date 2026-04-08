import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Check, Beer, ArrowLeft } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { StepCard } from "@/components/brew/StepCard"
import { ChecklistItem } from "@/components/brew/ChecklistItem"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { PhaseDefinition, BrewSession } from "@/types/brew"

interface EnvasePhaseProps {
  phase: PhaseDefinition
  session: BrewSession
}

export function EnvasePhase({ phase, session }: EnvasePhaseProps) {
  const c = useThemeColors()
  const navigation = useNavigation()
  const store = useBrewSessionStore()

  const currentStepIndex = session.currentStepIndex
  const isCompleted = session.status === "completed"

  function isStepDone(index: number) {
    return !!session.completedSteps[`envase:${index}`]
  }

  function handleDone(index: number) {
    store.completeStep(session.id, `envase:${index}`)
    store.advanceStep(session.id)

    // Check if this was the last step
    if (index === phase.steps.length - 1) {
      store.setStatus(session.id, "completed")
    }
  }

  // Celebration screen
  if (isCompleted) {
    const abv =
      session.ogReading && session.fgReading
        ? ((session.ogReading - session.fgReading) * 131.25).toFixed(1)
        : null

    return (
      <View style={styles.celebration}>
        <Text style={styles.partyEmoji}>🎉</Text>
        <Text style={[styles.congratsTitle, { color: c.foreground }]}>
          Parabens, Brasseiro!
        </Text>
        <Text style={[styles.congratsText, { color: c.mutedForeground }]}>
          Sua cerveja esta a caminho. Agora e so esperar a carbonatacao e curtir!
        </Text>

        <View style={[styles.summaryCard, { backgroundColor: c.card, borderColor: c.border }]}>
          {session.ogReading && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>OG</Text>
              <Text style={[styles.summaryValue, { color: c.foreground }]}>
                {session.ogReading.toFixed(3)}
              </Text>
            </View>
          )}
          {session.fgReading && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>FG</Text>
              <Text style={[styles.summaryValue, { color: c.foreground }]}>
                {session.fgReading.toFixed(3)}
              </Text>
            </View>
          )}
          {abv && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>ABV</Text>
              <Text style={[styles.summaryValueBold, { color: c.primary }]}>
                {abv}%
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>Envase</Text>
            <Text style={[styles.summaryValue, { color: c.foreground }]}>
              {session.envaseType === "priming" ? "Priming (PET)" : "Barril (CO2)"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.historyBtn, { backgroundColor: c.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Beer size={18} color={c.primaryForeground} />
          <Text style={[styles.historyBtnText, { color: c.primaryForeground }]}>
            Voltar ao Inicio
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      {phase.steps.map((step, index) => {
        const done = isStepDone(index)
        const isPending = index === currentStepIndex && !done

        if (done && index < currentStepIndex) return null
        if (index > currentStepIndex && !done) return null

        if (step.type === "checklist") {
          if (!isPending) return null
          const items = step.checklistItems || []
          const allChecked = items.every(
            (_, i) => session.completedSteps[`envase:${index}:${i}`]
          )

          return (
            <StepCard key={index} number={index + 1} title={step.title}>
              <Text style={[styles.description, { color: c.mutedForeground }]}>
                {step.description}
              </Text>
              {items.map((item, i) => (
                <ChecklistItem
                  key={i}
                  label={item}
                  checked={!!session.completedSteps[`envase:${index}:${i}`]}
                  onToggle={() => store.toggleStep(session.id, `envase:${index}:${i}`)}
                />
              ))}
              {allChecked && (
                <TouchableOpacity
                  style={[styles.doneBtn, { backgroundColor: c.primary }]}
                  onPress={() => handleDone(index)}
                >
                  <Check size={16} color={c.primaryForeground} />
                  <Text style={[styles.doneBtnText, { color: c.primaryForeground }]}>
                    Continuar
                  </Text>
                </TouchableOpacity>
              )}
            </StepCard>
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
  celebration: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  partyEmoji: {
    fontSize: 64,
    marginBottom: spacing.base,
  },
  congratsTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize["3xl"],
    marginBottom: spacing.sm,
  },
  congratsText: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    width: "100%",
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
  },
  summaryValue: {
    fontFamily: fonts.mono,
    fontSize: fontSize.base,
  },
  summaryValueBold: {
    fontFamily: fonts.mono,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  historyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  historyBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.base,
  },
})
