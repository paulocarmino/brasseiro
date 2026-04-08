import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Beer, Trash2 } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { BrewSession, SessionStatus } from "@/types/brew"

const statusLabels: Record<SessionStatus, string> = {
  active: "Em andamento",
  fermenting: "Fermentando",
  conditioning: "Maturando",
  completed: "Concluida",
}

export function HistoricoScreen() {
  const c = useThemeColors()
  const sessions = useBrewSessionStore((s) => s.sessions)
  const deleteSession = useBrewSessionStore((s) => s.deleteSession)

  const allSessions = sessions.filter((s) => s.status === "completed")

  function handleDelete(session: BrewSession) {
    Alert.alert(
      "Excluir brassagem",
      `Tem certeza que quer excluir "${session.name}"? Essa acao nao pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteSession(session.id),
        },
      ]
    )
  }

  function statusColor(status: SessionStatus) {
    switch (status) {
      case "completed":
        return c.success
      case "fermenting":
        return c.warning
      case "conditioning":
        return c.accent
      default:
        return c.mutedForeground
    }
  }

  function renderSession({ item }: { item: BrewSession }) {
    const abv =
      item.ogReading && item.fgReading
        ? ((item.ogReading - item.fgReading) * 131.25).toFixed(1)
        : null
    const date = new Date(item.createdAt).toLocaleDateString("pt-BR")
    const hopsStr = item.hops.map((h) => `${h.name} (${h.grams}g)`).join(", ")

    return (
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={styles.cardTop}>
          <Text style={[styles.cardName, { color: c.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor(item.status) + "1A" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusColor(item.status) },
              ]}
            >
              {statusLabels[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={[styles.detailText, { color: c.mutedForeground }]}>
            {date}
          </Text>
          {item.ogReading && (
            <Text style={[styles.detailText, { color: c.mutedForeground }]}>
              OG: <Text style={{ fontFamily: fonts.mono }}>{item.ogReading.toFixed(3)}</Text>
            </Text>
          )}
          {item.fgReading && (
            <Text style={[styles.detailText, { color: c.mutedForeground }]}>
              FG: <Text style={{ fontFamily: fonts.mono }}>{item.fgReading.toFixed(3)}</Text>
            </Text>
          )}
          {abv && (
            <Text style={[styles.abvText, { color: c.primary }]}>
              ABV: {abv}%
            </Text>
          )}
        </View>

        {hopsStr.length > 0 && (
          <Text
            style={[styles.hopsText, { color: c.mutedForeground }]}
            numberOfLines={1}
          >
            {hopsStr}
          </Text>
        )}

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Excluir brassagem ${item.name}`}
        >
          <Trash2 size={18} color={c.destructive} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.foreground }]}>Historico</Text>

      {allSessions.length === 0 ? (
        <View style={styles.empty}>
          <Beer size={48} color={c.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: c.foreground }]}>
            Historico vazio
          </Text>
          <Text style={[styles.emptySubtitle, { color: c.mutedForeground }]}>
            Suas brassagens concluidas aparecerao aqui.{"\n"}Brassagens em fermentacao aparecem na tela inicial.
          </Text>
        </View>
      ) : (
        <FlatList
          data={allSessions}
          keyExtractor={(item) => item.id}
          renderItem={renderSession}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize["2xl"],
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
  },
  list: {
    padding: spacing.base,
    paddingBottom: spacing["2xl"],
  },
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  cardName: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.xs,
  },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  detailText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
  },
  abvText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  hopsText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  deleteBtn: {
    position: "absolute",
    bottom: spacing.base,
    right: spacing.base,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    marginTop: spacing.base,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    textAlign: "center",
    marginTop: spacing.sm,
  },
})
