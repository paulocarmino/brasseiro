import { glossary, type GlossaryEntry } from "@/mocks/glossary"

export function useGlossary() {
  function lookup(term: string): GlossaryEntry | undefined {
    const lower = term.toLowerCase()
    return glossary.find(
      (entry) =>
        entry.term.toLowerCase() === lower || entry.aliases.some((a) => a.toLowerCase() === lower)
    )
  }

  function search(query: string): GlossaryEntry[] {
    if (!query.trim()) return glossary
    const lower = query.toLowerCase()
    return glossary.filter(
      (entry) =>
        entry.term.toLowerCase().includes(lower) ||
        entry.definition.toLowerCase().includes(lower) ||
        entry.aliases.some((a) => a.toLowerCase().includes(lower))
    )
  }

  return { glossary, lookup, search }
}
