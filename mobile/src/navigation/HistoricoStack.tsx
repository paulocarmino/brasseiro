import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HistoricoScreen } from "@/screens/HistoricoScreen"
import type { HistoricoStackParamList } from "./types"

const Stack = createNativeStackNavigator<HistoricoStackParamList>()

export function HistoricoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Historico" component={HistoricoScreen} />
    </Stack.Navigator>
  )
}
