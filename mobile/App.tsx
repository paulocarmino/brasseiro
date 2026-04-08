import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display"
import { SourceSans3_400Regular, SourceSans3_600SemiBold, SourceSans3_700Bold } from "@expo-google-fonts/source-sans-3"
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono"
import { useColorScheme } from "react-native"
import { RootNavigator } from "@/navigation/RootNavigator"
import { colors } from "@/theme/colors"
import { useUiStore } from "@/stores/uiStore"

SplashScreen.preventAutoHideAsync()

const BrasseiroLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
    card: colors.light.card,
    text: colors.light.foreground,
    border: colors.light.border,
    notification: colors.light.primary,
  },
}

const BrasseiroDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    card: colors.dark.card,
    text: colors.dark.foreground,
    border: colors.dark.border,
    notification: colors.dark.primary,
  },
}

export default function App() {
  const systemScheme = useColorScheme()
  const theme = useUiStore((s) => s.theme)

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
    JetBrainsMono_400Regular,
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  const resolvedTheme =
    theme === "system" ? (systemScheme === "dark" ? "dark" : "light") : theme

  const navigationTheme =
    resolvedTheme === "dark" ? BrasseiroDarkTheme : BrasseiroLightTheme

  const statusBarStyle = resolvedTheme === "dark" ? "light" : "dark"

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
        <StatusBar style={statusBarStyle} />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
