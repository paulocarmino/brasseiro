import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGlossary } from "@/hooks/useGlossary"

interface GlossaryTermProps {
  term: string
  children?: React.ReactNode
}

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const { lookup } = useGlossary()
  const entry = lookup(term)

  if (!entry) {
    return <>{children ?? term}</>
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="underline decoration-dotted decoration-primary/40 underline-offset-2 hover:decoration-primary transition-colors"
        >
          {children ?? term}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-1">
          <h4 className="font-display font-bold text-sm">{entry.term}</h4>
          <p className="text-sm text-muted-foreground">{entry.definition}</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
