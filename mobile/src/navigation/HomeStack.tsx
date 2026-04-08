import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HomeScreen } from "@/screens/HomeScreen"
import { NovaBrassagemScreen } from "@/screens/NovaBrassagemScreen"
import type { HomeStackParamList } from "./types"

const Stack = createNativeStackNavigator<HomeStackParamList>()

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NovaBrassagem" component={NovaBrassagemScreen} />
    </Stack.Navigator>
  )
}
