import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StepCardProps {
  stepNumber: number
  title: string
  children: React.ReactNode
  isCompleted?: boolean
  className?: string
}

export function StepCard({ stepNumber, title, children, isCompleted, className }: StepCardProps) {
  return (
    <Card className={cn("transition-all", isCompleted && "opacity-60", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              isCompleted ? "bg-success text-success-foreground" : "bg-primary/10 text-primary"
            )}
          >
            {isCompleted ? "✓" : stepNumber}
          </div>
          <h3 className="font-display font-bold text-base leading-snug pt-0.5">{title}</h3>
        </div>
        <div className="pl-10">{children}</div>
      </CardContent>
    </Card>
  )
}
