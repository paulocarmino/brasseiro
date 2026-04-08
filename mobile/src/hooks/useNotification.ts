import { useCallback, useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export function useNotification() {
  const permissionRequested = useRef(false)

  useEffect(() => {
    if (!permissionRequested.current) {
      permissionRequested.current = true
      Notifications.requestPermissionsAsync().catch(() => {})
    }
  }, [])

  const sendNotification = useCallback(async (title: string, body: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // immediate
      })
    } catch {
      // Notifications not available
    }
  }, [])

  return { sendNotification }
}
