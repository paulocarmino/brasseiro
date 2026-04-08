import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MeanwhileTaskProps {
  title: string
  children: React.ReactNode
}

export function MeanwhileTask({ title, children }: MeanwhileTaskProps) {
  return (
    <Card className="border-dashed border-accent/40">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-accent">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">Enquanto isso</span>
        </div>
        <h4 className="font-display font-bold text-sm">{title}</h4>
        <div className="text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  )
}
