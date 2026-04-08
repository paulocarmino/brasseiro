import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BottomTabNavigator } from "./BottomTabNavigator"
import { BrassagemScreen } from "@/screens/BrassagemScreen"
import type { RootStackParamList } from "./types"

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="Brassagem"
        component={BrassagemScreen}
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  )
}
