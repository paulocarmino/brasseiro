import { Snowflake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { FermentationDay, FermentationType } from "@/types/brew"

interface FermentationDayCardProps {
  dayNumber: number
  day: FermentationDay
  fermentationType: FermentationType
  onUpdate: (updates: Partial<FermentationDay>) => void
  isToday?: boolean
}

export function FermentationDayCard({
  dayNumber,
  day,
  fermentationType,
  onUpdate,
  isToday,
}: FermentationDayCardProps) {
  return (
    <Card className={isToday ? "border-primary/30 bg-primary/5" : undefined}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold">
            Dia {dayNumber}
            {isToday && <span className="ml-2 text-xs font-normal text-primary">Hoje</span>}
          </h4>
          <span className="text-xs text-muted-foreground">
            {new Date(day.date).toLocaleDateString("pt-BR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {fermentationType === "cooler" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Temp. manha (°C)</Label>
                <Input
                  type="number"
                  step={0.5}
                  placeholder="--"
                  value={day.morningTempC ?? ""}
                  onChange={(e) =>
                    onUpdate({
                      morningTempC: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Temp. noite (°C)</Label>
                <Input
                  type="number"
                  step={0.5}
                  placeholder="--"
                  value={day.eveningTempC ?? ""}
                  onChange={(e) =>
                    onUpdate({
                      eveningTempC: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-blue-500" />
                <Label htmlFor={`ice-am-${day.date}`} className="text-xs">
                  Gelo manha
                </Label>
                <Switch
                  id={`ice-am-${day.date}`}
                  checked={day.iceSwappedMorning ?? false}
                  onCheckedChange={(checked) => onUpdate({ iceSwappedMorning: checked })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-blue-500" />
                <Label htmlFor={`ice-pm-${day.date}`} className="text-xs">
                  Gelo noite
                </Label>
                <Switch
                  id={`ice-pm-${day.date}`}
                  checked={day.iceSwappedEvening ?? false}
                  onCheckedChange={(checked) => onUpdate({ iceSwappedEvening: checked })}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <Label className="text-xs">Temp. frigobar (°C)</Label>
            <Input
              type="number"
              step={0.5}
              placeholder="--"
              value={day.morningTempC ?? ""}
              onChange={(e) =>
                onUpdate({
                  morningTempC: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="h-9"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs">Densidade (opcional)</Label>
          <Input
            type="number"
            step={0.001}
            placeholder="1.010"
            value={day.densityReading ?? ""}
            onChange={(e) =>
              onUpdate({
                densityReading: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-9 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Notas</Label>
          <Input
            placeholder="Observacoes do dia..."
            value={day.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            className="h-9"
          />
        </div>
      </CardContent>
    </Card>
  )
}
