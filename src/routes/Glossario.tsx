import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useGlossary } from "@/hooks/useGlossary"

export function Glossario() {
  const [query, setQuery] = useState("")
  const [openTerm, setOpenTerm] = useState<string | null>(null)
  const { search } = useGlossary()

  const results = search(query)

  const grouped = useMemo(() => {
    const groups: Record<string, typeof results> = {}
    for (const entry of results) {
      const letter = entry.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(entry)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [results])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Glossario</h1>
        <p className="text-sm text-muted-foreground">Termos cervejeiros de A a Z</p>
      </div>

      <div className="sticky top-14 z-10 bg-background pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar termo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {grouped.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhum termo encontrado para &quot;{query}&quot;
        </p>
      )}

      <div className="space-y-6">
        {grouped.map(([letter, entries]) => (
          <div key={letter}>
            <h2 className="font-display text-lg font-bold text-primary sticky top-28 bg-background py-1">
              {letter}
            </h2>
            <div className="space-y-1">
              {entries.map((entry) => (
                <Collapsible
                  key={entry.term}
                  open={openTerm === entry.term}
                  onOpenChange={(open) => setOpenTerm(open ? entry.term : null)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left hover:bg-muted transition-colors">
                    <span className="font-medium">{entry.term}</span>
                    {entry.aliases.length > 0 && (
                      <span className="text-xs text-muted-foreground">{entry.aliases[0]}</span>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {entry.definition}
                    </p>
                    {entry.aliases.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Tambem:{" "}
                        {entry.aliases.map((a, i) => (
                          <span key={a}>
                            {i > 0 && ", "}
                            <span className="text-foreground">{a}</span>
                          </span>
                        ))}
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
