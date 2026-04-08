import { useState, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TextInput,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search, ChevronDown, ChevronUp } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { glossary, type GlossaryEntry } from "@/mocks/glossary"

interface Section {
  title: string
  data: GlossaryEntry[]
}

export function GlossarioScreen() {
  const c = useThemeColors()
  const [query, setQuery] = useState("")
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return glossary
    const lower = query.toLowerCase()
    return glossary.filter(
      (entry) =>
        entry.term.toLowerCase().includes(lower) ||
        entry.definition.toLowerCase().includes(lower) ||
        entry.aliases.some((a) => a.toLowerCase().includes(lower))
    )
  }, [query])

  const sections: Section[] = useMemo(() => {
    const groups: Record<string, GlossaryEntry[]> = {}
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(entry)
    }
    return Object.keys(groups)
      .sort()
      .map((letter) => ({ title: letter, data: groups[letter] }))
  }, [filtered])

  function toggleEntry(term: string) {
    setExpandedTerm(expandedTerm === term ? null : term)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.foreground }]}>Glossario</Text>

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: c.card, borderColor: c.border },
        ]}
      >
        <Search size={18} color={c.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: c.foreground }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar termo..."
          placeholderTextColor={c.mutedForeground}
          autoCorrect={false}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.term}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: c.background }]}>
            <Text style={[styles.sectionLetter, { color: c.primary }]}>
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const isExpanded = expandedTerm === item.term
          return (
            <TouchableOpacity
              style={[
                styles.entry,
                {
                  backgroundColor: isExpanded ? c.muted : "transparent",
                },
              ]}
              onPress={() => toggleEntry(item.term)}
              activeOpacity={0.7}
            >
              <View style={styles.entryHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.entryTerm, { color: c.foreground }]}>
                    {item.term}
                  </Text>
                  {!isExpanded && item.aliases.length > 0 && (
                    <Text
                      style={[styles.aliasPreview, { color: c.mutedForeground }]}
                      numberOfLines={1}
                    >
                      {item.aliases.join(", ")}
                    </Text>
                  )}
                </View>
                {isExpanded ? (
                  <ChevronUp size={18} color={c.mutedForeground} />
                ) : (
                  <ChevronDown size={18} color={c.mutedForeground} />
                )}
              </View>
              {isExpanded && (
                <View style={styles.entryContent}>
                  <Text style={[styles.definition, { color: c.foreground }]}>
                    {item.definition}
                  </Text>
                  {item.aliases.length > 0 && (
                    <Text style={[styles.aliases, { color: c.mutedForeground }]}>
                      Tambem conhecido como: {item.aliases.join(", ")}
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          )
        }}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              Nenhum termo encontrado para "{query}"
            </Text>
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    paddingVertical: spacing.md,
  },
  list: {
    paddingBottom: spacing["2xl"],
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  sectionLetter: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
  },
  entry: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  entryTerm: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.base,
  },
  aliasPreview: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  entryContent: {
    marginTop: spacing.sm,
  },
  definition: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    lineHeight: 24,
  },
  aliases: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    marginTop: spacing.sm,
  },
  emptyList: {
    padding: spacing["2xl"],
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    textAlign: "center",
  },
})
