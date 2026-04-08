import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ArrowRight, Check, Plus, Snowflake } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { StepCard } from "@/components/brew/StepCard"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import { WarningBanner } from "@/components/brew/WarningBanner"
import { DensityInput } from "@/components/brew/DensityInput"
import { FermentationDayCard } from "@/components/brew/FermentationDayCard"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { PhaseDefinition, BrewSession } from "@/types/brew"

interface ResfriamentoPhaseProps {
  phase: PhaseDefinition
  session: BrewSession
}

export function ResfriamentoPhase({ phase, session }: ResfriamentoPhaseProps) {
  const c = useThemeColors()
  const store = useBrewSessionStore()

  const isFermenting = session.status === "fermenting"
  const isConditioning = session.status === "conditioning"

  function isStepDone(index: number) {
    return !!session.completedSteps[`resfriamento:${index}`]
  }

  function handleDone(index: number) {
    store.completeStep(session.id, `resfriamento:${index}`)
    store.advanceStep(session.id, phase.steps.length)
  }

  function handleStartFermentation() {
    store.setStatus(session.id, "fermenting")
  }

  function handleStartColdCrash() {
    store.setStatus(session.id, "conditioning")
  }

  function addTodayLog() {
    const today = new Date().toISOString().split("T")[0]
    const exists = session.fermentationDays.find((d) => d.date === today)
    if (!exists) {
      store.addFermentationDay(session.id, {
        date: today,
        notes: "",
      })
    }
  }

  // Calculate fermentation day count
  const fermDayCount = session.fermentationStartedAt
    ? Math.ceil((Date.now() - session.fermentationStartedAt) / (1000 * 60 * 60 * 24))
    : 0

  const condDayCount = session.conditioningStartedAt
    ? Math.ceil((Date.now() - session.conditioningStartedAt) / (1000 * 60 * 60 * 24))
    : 0

  // ABV calculation
  const abv =
    session.ogReading && session.fgReading
      ? ((session.ogReading - session.fgReading) * 131.25).toFixed(1)
      : null

  // Pre-fermentation steps (brew day)
  if (!isFermenting && !isConditioning) {
    const currentStepIndex = session.currentStepIndex

    return (
      <View>
        {phase.steps.slice(0, 5).map((step, index) => {
          const done = isStepDone(index)
          const isPending = index === currentStepIndex && !done

          if (done && index < currentStepIndex) return null
          if (index > currentStepIndex && !done) return null

          if (step.type === "input") {
            if (!isPending) return null
            return (
              <StepCard key={index} number={index + 1} title={step.title}>
                <Text style={[styles.description, { color: c.mutedForeground }]}>
                  {step.description}
                </Text>
                <DensityInput
                  label="Densidade Original (OG)"
                  value={session.ogReading}
                  onChange={(v) => store.updateSession(session.id, { ogReading: v })}
                  helperText="Valor tipico: 1.035-1.080"
                />
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

        {/* Show "Iniciar Fermentacao" after all brew-day steps are done */}
        {phase.steps.slice(0, 5).every((_, i) => isStepDone(i)) && (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: c.primary }]}
            onPress={handleStartFermentation}
          >
            <Text style={[styles.nextBtnText, { color: c.primaryForeground }]}>
              Iniciar Fermentacao
            </Text>
            <ArrowRight size={18} color={c.primaryForeground} />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  // Fermentation tracking
  if (isFermenting) {
    return (
      <View>
        <View style={[styles.badge, { backgroundColor: c.secondary }]}>
          <Snowflake size={14} color={c.primary} />
          <Text style={[styles.badgeText, { color: c.secondaryForeground }]}>
            Fermentacao — Dia {fermDayCount}/7
          </Text>
        </View>

        <WarningBanner
          message={
            session.fermentationType === "cooler"
              ? "Mantenha abaixo de 20C. Troque o gelo de manha e a noite."
              : "Mantenha a temperatura estavel no frigobar."
          }
        />

        {/* Fermentation day cards */}
        {session.fermentationDays.map((day, i) => {
          const today = new Date().toISOString().split("T")[0]
          return (
            <FermentationDayCard
              key={day.date}
              day={day}
              dayNumber={i + 1}
              isToday={day.date === today}
              fermentationType={session.fermentationType}
              onUpdate={(updates) =>
                store.updateFermentationDay(session.id, day.date, updates)
              }
            />
          )
        })}

        <TouchableOpacity
          style={[styles.addDayBtn, { borderColor: c.border }]}
          onPress={addTodayLog}
        >
          <Plus size={16} color={c.primary} />
          <Text style={[styles.addDayText, { color: c.primary }]}>
            Adicionar registro de hoje
          </Text>
        </TouchableOpacity>

        {/* FG Reading */}
        <DensityInput
          label="Densidade Final (FG)"
          value={session.fgReading}
          onChange={(v) => store.updateSession(session.id, { fgReading: v })}
          helperText="Meca apos a fermentacao estabilizar (2-3 dias sem variar)"
        />

        {abv && (
          <View style={[styles.abvBox, { backgroundColor: c.primary + "1A" }]}>
            <Text style={[styles.abvLabel, { color: c.foreground }]}>ABV estimado</Text>
            <Text style={[styles.abvValue, { color: c.primary }]}>{abv}%</Text>
          </View>
        )}

        {fermDayCount < 6 && (
          <Text style={[styles.hint, { color: c.mutedForeground }]}>
            Recomendado esperar pelo menos 6 dias antes do cold crash (dia {fermDayCount}/6)
          </Text>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: c.primary }]}
          onPress={handleStartColdCrash}
        >
          <Text style={[styles.nextBtnText, { color: c.primaryForeground }]}>
            Iniciar Cold Crash (Geladeira)
          </Text>
          <ArrowRight size={18} color={c.primaryForeground} />
        </TouchableOpacity>
      </View>
    )
  }

  // Conditioning / Cold Crash
  return (
    <View>
      <View style={[styles.badge, { backgroundColor: c.secondary }]}>
        <Snowflake size={14} color={c.primary} />
        <Text style={[styles.badgeText, { color: c.secondaryForeground }]}>
          Cold Crash — Dia {condDayCount}/5
        </Text>
      </View>

      <WarningBanner message="Nao mexa no fermentador! Deixe na geladeira parado." />

      {condDayCount < 4 && (
        <Text style={[styles.hint, { color: c.mutedForeground }]}>
          Recomendado pelo menos 4 dias de cold crash (dia {condDayCount}/4)
        </Text>
      )}
      <TouchableOpacity
        style={[styles.nextBtn, { backgroundColor: c.primary }]}
        onPress={() => store.setPhase(session.id, "envase")}
      >
        <Text style={[styles.nextBtnText, { color: c.primaryForeground }]}>
          Proximo: Envase
        </Text>
        <ArrowRight size={18} color={c.primaryForeground} />
      </TouchableOpacity>
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
    marginTop: spacing.lg,
  },
  nextBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.base,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
  },
  addDayBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.base,
  },
  addDayText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
  },
  abvBox: {
    alignItems: "center",
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.md,
  },
  abvLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
  },
  abvValue: {
    fontFamily: fonts.mono,
    fontSize: fontSize["3xl"],
    fontWeight: "700",
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    textAlign: "center" as const,
    marginTop: spacing.md,
  },
})
