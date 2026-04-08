import { useColorScheme } from "react-native"
import { colors, type ThemeColors } from "./colors"
import { fonts, fontSize } from "./typography"
import { spacing, borderRadius } from "./spacing"
import { useUiStore } from "@/stores/uiStore"

export { colors, fonts, fontSize, spacing, borderRadius }
export type { ThemeColors }

export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme()
  const theme = useUiStore((s) => s.theme)

  const resolved =
    theme === "system" ? (systemScheme === "dark" ? "dark" : "light") : theme

  return colors[resolved]
}
