import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Beer, Plus, ArrowRight, ClipboardCheck, Timer, BookOpen } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { RootStackParamList } from "@/navigation/types"
import type { HomeStackParamList } from "@/navigation/types"

type HomeNav = NativeStackNavigationProp<HomeStackParamList & RootStackParamList>

export function HomeScreen() {
  const c = useThemeColors()
  const navigation = useNavigation<HomeNav>()
  const sessions = useBrewSessionStore((s) => s.sessions)
  const activeSessionId = useBrewSessionStore((s) => s.activeSessionId)

  const activeSession = sessions.find((s) => s.id === activeSessionId)
  const inProgressSessions = sessions.filter(
    (s) => s.status === "fermenting" || s.status === "conditioning"
  )
  const completedSessions = sessions
    .filter((s) => s.status === "completed")
    .slice(0, 3)

  const phaseLabels: Record<string, string> = {
    preparacao: "Preparacao",
    mostura: "Mostura",
    fervura: "Fervura",
    resfriamento: "Resfriamento",
    envase: "Envase",
  }

  const statusLabels: Record<string, string> = {
    fermenting: "Fermentando",
    conditioning: "Maturando",
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Beer size={48} color={c.primary} />
          <Text style={[styles.title, { color: c.foreground }]}>Brasseiro</Text>
          <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
            Seu checklist inteligente para brassagem BIAB.{"\n"}
            Do grao ao copo, passo a passo.
          </Text>
          <View style={styles.badges}>
            {[
              { icon: ClipboardCheck, label: "Checklist" },
              { icon: Timer, label: "Timers" },
              { icon: BookOpen, label: "Glossario" },
            ].map(({ icon: Icon, label }) => (
              <View
                key={label}
                style={[styles.badge, { backgroundColor: c.secondary }]}
              >
                <Icon size={14} color={c.primary} />
                <Text style={[styles.badgeText, { color: c.secondaryForeground }]}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Active Session */}
        {activeSession && (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: c.card,
                borderColor: c.primary + "4D",
              },
            ]}
            onPress={() =>
              navigation.navigate("Brassagem", { id: activeSession.id })
            }
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Beer size={20} color={c.primary} />
              <Text style={[styles.cardTitle, { color: c.foreground }]}>
                {activeSession.name}
              </Text>
            </View>
            <Text style={[styles.cardPhase, { color: c.mutedForeground }]}>
              Fase atual: {phaseLabels[activeSession.currentPhase]}
            </Text>
            <View style={[styles.continueBtn, { backgroundColor: c.primary }]}>
              <Text style={[styles.continueBtnText, { color: c.primaryForeground }]}>
                Continuar
              </Text>
              <ArrowRight size={16} color={c.primaryForeground} />
            </View>
          </TouchableOpacity>
        )}

        {/* Fermenting / Conditioning Sessions */}
        {inProgressSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>
              Em andamento
            </Text>
            {inProgressSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.card,
                  { backgroundColor: c.card, borderColor: c.border },
                ]}
                onPress={() => navigation.navigate("Brassagem", { id: session.id })}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Beer size={20} color={c.primary} />
                  <Text style={[styles.cardTitle, { color: c.foreground }]}>
                    {session.name}
                  </Text>
                </View>
                <Text style={[styles.cardPhase, { color: c.mutedForeground }]}>
                  {statusLabels[session.status] ?? session.status}
                </Text>
                <View style={[styles.continueBtn, { backgroundColor: c.secondary }]}>
                  <Text style={[styles.continueBtnText, { color: c.secondaryForeground }]}>
                    Acompanhar
                  </Text>
                  <ArrowRight size={16} color={c.secondaryForeground} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* New Brew CTA */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}
          onPress={() => navigation.navigate("NovaBrassagem")}
          activeOpacity={0.7}
        >
          <View style={[styles.plusCircle, { backgroundColor: c.primary + "1A" }]}>
            <Plus size={28} color={c.primary} />
          </View>
          <Text style={[styles.newBrewTitle, { color: c.foreground }]}>
            Nova Brassagem
          </Text>
          <Text style={[styles.newBrewSubtitle, { color: c.mutedForeground }]}>
            Comece uma nova receita do zero
          </Text>
        </TouchableOpacity>

        {/* Recent History */}
        {completedSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>
              Ultimas brassagens
            </Text>
            {completedSessions.map((session) => {
              const abv =
                session.ogReading && session.fgReading
                  ? ((session.ogReading - session.fgReading) * 131.25).toFixed(1)
                  : null
              const date = new Date(session.createdAt).toLocaleDateString("pt-BR")
              return (
                <View
                  key={session.id}
                  style={[
                    styles.historyItem,
                    { backgroundColor: c.card, borderColor: c.border },
                  ]}
                >
                  <View style={styles.historyLeft}>
                    <Text style={[styles.historyName, { color: c.foreground }]}>
                      {session.name}
                    </Text>
                    <Text style={[styles.historyDate, { color: c.mutedForeground }]}>
                      {date}
                    </Text>
                  </View>
                  {abv && (
                    <Text style={[styles.historyAbv, { color: c.primary }]}>
                      {abv}%
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing["2xl"],
  },
  hero: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize["3xl"],
    marginTop: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 24,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.xs,
  },
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    flex: 1,
  },
  cardPhase: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: 28,
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  continueBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
  },
  plusCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  newBrewTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    textAlign: "center",
  },
  newBrewSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    marginBottom: spacing.md,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyLeft: {
    flex: 1,
  },
  historyName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
  },
  historyDate: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  historyAbv: {
    fontFamily: fonts.mono,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
})
