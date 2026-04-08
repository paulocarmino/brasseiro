import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { GlossarioScreen } from "@/screens/GlossarioScreen"
import type { GlossarioStackParamList } from "./types"

const Stack = createNativeStackNavigator<GlossarioStackParamList>()

export function GlossarioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Glossario" component={GlossarioScreen} />
    </Stack.Navigator>
  )
}
