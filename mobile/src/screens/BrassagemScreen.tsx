import { useMemo } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Beer } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import { PhaseWizard } from "@/components/brew/PhaseWizard"
import { PhaseRenderer } from "@/components/phases/PhaseRenderer"
import { buildPhaseSteps } from "@/mocks/phases"
import type { RootStackParamList } from "@/navigation/types"

type BrassagemRoute = RouteProp<RootStackParamList, "Brassagem">

export function BrassagemScreen() {
  const c = useThemeColors()
  const navigation = useNavigation()
  const route = useRoute<BrassagemRoute>()
  const { id } = route.params

  const session = useBrewSessionStore((s) => s.sessions.find((sess) => sess.id === id))

  const phases = useMemo(() => {
    if (!session) return []
    return buildPhaseSteps(session)
  }, [session])

  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
        <View style={styles.notFound}>
          <Beer size={48} color={c.mutedForeground} />
          <Text style={[styles.notFoundText, { color: c.foreground }]}>
            Sessao nao encontrada
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backLink, { color: c.primary }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const currentPhase = phases.find((p) => p.id === session.currentPhase)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={c.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Beer size={18} color={c.primary} />
          <Text
            style={[styles.headerTitle, { color: c.foreground }]}
            numberOfLines={1}
          >
            {session.name}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase Wizard */}
        <PhaseWizard currentPhase={session.currentPhase} />

        {/* Phase title */}
        {currentPhase && (
          <View style={styles.phaseHeader}>
            <Text style={[styles.phaseTitle, { color: c.foreground }]}>
              {currentPhase.title}
            </Text>
            <Text style={[styles.phaseDescription, { color: c.mutedForeground }]}>
              {currentPhase.description}
            </Text>
          </View>
        )}

        {/* Phase content */}
        <PhaseRenderer session={session} phases={phases} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    maxWidth: 200,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing["3xl"],
  },
  phaseHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  phaseTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize["2xl"],
  },
  phaseDescription: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    marginTop: spacing.base,
  },
  backLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
    marginTop: spacing.md,
  },
})
