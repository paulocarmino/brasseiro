import { AlertTriangle, Flame } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WarningBannerProps {
  title?: string
  children: React.ReactNode
  variant?: "warning" | "danger"
}

export function WarningBanner({
  title = "ATENCAO",
  children,
  variant = "warning",
}: WarningBannerProps) {
  const Icon = variant === "danger" ? Flame : AlertTriangle

  return (
    <Alert
      className={
        variant === "danger"
          ? "border-destructive/50 bg-destructive/5 text-destructive"
          : "border-warning/50 bg-warning/5 text-foreground"
      }
    >
      <Icon className={`h-4 w-4 ${variant === "danger" ? "text-destructive" : "text-warning"}`} />
      <AlertTitle className="font-display font-bold">{title}</AlertTitle>
      <AlertDescription className="text-sm">{children}</AlertDescription>
    </Alert>
  )
}
