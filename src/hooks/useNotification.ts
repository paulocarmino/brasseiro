import { useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

export function useNotification() {
  const { toast } = useToast()
  const permissionRef = useRef<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  )

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return false
    if (permissionRef.current === "granted") return true

    const result = await Notification.requestPermission()
    permissionRef.current = result
    return result === "granted"
  }, [])

  const sendNotification = useCallback(
    (title: string, body: string) => {
      if (
        typeof Notification !== "undefined" &&
        permissionRef.current === "granted" &&
        document.hidden
      ) {
        new Notification(title, {
          body,
          icon: "/vite.svg",
          tag: "brasseiro-alert",
        })
      } else {
        toast({
          title,
          description: body,
        })
      }
    },
    [toast]
  )

  return { requestPermission, sendNotification }
}
