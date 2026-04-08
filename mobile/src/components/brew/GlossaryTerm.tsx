import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, Modal, View, Pressable } from "react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { glossary } from "@/mocks/glossary"

interface GlossaryTermProps {
  term: string
}

export function GlossaryTerm({ term }: GlossaryTermProps) {
  const c = useThemeColors()
  const [visible, setVisible] = useState(false)

  const entry = glossary.find(
    (g) =>
      g.term.toLowerCase() === term.toLowerCase() ||
      g.aliases.some((a) => a.toLowerCase() === term.toLowerCase())
  )

  if (!entry) return <Text style={{ color: c.primary }}>{term}</Text>

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={[styles.termLink, { color: c.primary }]}>{term}</Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View
            style={[
              styles.popover,
              { backgroundColor: c.card, borderColor: c.border },
            ]}
          >
            <Text style={[styles.popoverTerm, { color: c.foreground }]}>
              {entry.term}
            </Text>
            <Text style={[styles.popoverDef, { color: c.foreground }]}>
              {entry.definition}
            </Text>
            {entry.aliases.length > 0 && (
              <Text style={[styles.popoverAliases, { color: c.mutedForeground }]}>
                Tambem: {entry.aliases.join(", ")}
              </Text>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  termLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
    textDecorationLine: "underline",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  popover: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    maxWidth: 320,
    width: "100%",
  },
  popoverTerm: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    marginBottom: spacing.sm,
  },
  popoverDef: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    lineHeight: 24,
  },
  popoverAliases: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    marginTop: spacing.sm,
  },
})
