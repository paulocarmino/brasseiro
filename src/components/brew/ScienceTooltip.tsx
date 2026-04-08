import { FlaskConical } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

interface ScienceTooltipProps {
  children: React.ReactNode
}

export function ScienceTooltip({ children }: ScienceTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary/80 hover:text-primary transition-colors py-1">
        <FlaskConical className="h-4 w-4" />
        <span className="underline underline-offset-2 decoration-dotted">
          {open ? "Esconder a ciencia" : "Por que isso?"}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex gap-2">
          <FlaskConical className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
