import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlossaryTerm } from "./GlossaryTerm"

interface DensityInputProps {
  label: string
  glossaryTerm: string
  value?: number
  onChange: (value: number | undefined) => void
  helperText?: string
}

export function DensityInput({
  label,
  glossaryTerm,
  value,
  onChange,
  helperText,
}: DensityInputProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label} (<GlossaryTerm term={glossaryTerm}>{glossaryTerm}</GlossaryTerm>)
      </Label>
      <Input
        type="number"
        step={0.001}
        min={0.99}
        max={1.15}
        placeholder="1.050"
        value={value ?? ""}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          onChange(isNaN(v) ? undefined : v)
        }}
        className="font-mono"
      />
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}
