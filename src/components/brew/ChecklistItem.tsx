import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface ChecklistItemProps {
  id: string
  label: string
  checked: boolean
  onToggle: () => void
}

export function ChecklistItem({ id, label, checked, onToggle }: ChecklistItemProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 rounded-md p-3 min-h-[48px] cursor-pointer transition-colors hover:bg-muted/50",
        checked && "opacity-60"
      )}
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} className="h-5 w-5 shrink-0" />
      <span className={cn("text-sm leading-snug", checked && "line-through")}>{label}</span>
    </label>
  )
}
