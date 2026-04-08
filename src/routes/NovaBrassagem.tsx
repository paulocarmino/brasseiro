import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Beer, FlaskConical, Snowflake, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { HopAddition, EnvaseType, FermentationType } from "@/types/brew"

export function NovaBrassagem() {
  const navigate = useNavigate()
  const createSession = useBrewSessionStore((s) => s.createSession)

  const [name, setName] = useState("")
  const [mashTempC, setMashTempC] = useState(68)
  const [mashDurationMin, setMashDurationMin] = useState(60)
  const [boilDurationMin, setBoilDurationMin] = useState(60)
  const [envaseType, setEnvaseType] = useState<EnvaseType>("priming")
  const [fermentationType, setFermentationType] = useState<FermentationType>("cooler")
  const [hops, setHops] = useState<HopAddition[]>([{ name: "", grams: 0, minutesBeforeEnd: 60 }])

  function addHop() {
    setHops([...hops, { name: "", grams: 0, minutesBeforeEnd: 0 }])
  }

  function removeHop(index: number) {
    setHops(hops.filter((_, i) => i !== index))
  }

  function updateHop(index: number, field: keyof HopAddition, value: string) {
    setHops(
      hops.map((hop, i) =>
        i === index
          ? {
              ...hop,
              [field]: field === "name" ? value : Math.max(0, Number(value) || 0),
            }
          : hop
      )
    )
  }

  function handleStart() {
    const validHops = hops.filter((h) => h.name.trim() && h.grams > 0)
    const id = createSession({
      name: name.trim() || "Minha Brassagem",
      mashTempC,
      mashDurationMin,
      boilDurationMin,
      hops: validHops,
      envaseType,
      fermentationType,
    })
    navigate(`/brassagem/${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Nova Brassagem</h1>
        <p className="text-sm text-muted-foreground">Configure os parametros da sua receita</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da brassagem</Label>
          <Input
            id="name"
            placeholder="Ex: IPA do Paulo, Blonde Ale..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mashTemp">Temp. mostura (°C)</Label>
            <Input
              id="mashTemp"
              type="number"
              min={62}
              max={72}
              value={mashTempC}
              onChange={(e) => setMashTempC(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mashDuration">Tempo mostura (min)</Label>
            <Input
              id="mashDuration"
              type="number"
              min={30}
              max={90}
              step={15}
              value={mashDurationMin}
              onChange={(e) => setMashDurationMin(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="boilDuration">Tempo fervura (min)</Label>
          <Input
            id="boilDuration"
            type="number"
            min={15}
            max={90}
            step={15}
            value={boilDurationMin}
            onChange={(e) => setBoilDurationMin(Number(e.target.value))}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Lupulos</Label>
            <Button variant="ghost" size="sm" onClick={addHop} className="gap-1">
              <Plus className="h-3 w-3" />
              Adicionar
            </Button>
          </div>

          {hops.map((hop, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Nome</Label>
                <Input
                  placeholder="Ex: Cascade"
                  value={hop.name}
                  onChange={(e) => updateHop(i, "name", e.target.value)}
                />
              </div>
              <div className="w-20 space-y-1">
                <Label className="text-xs text-muted-foreground">Gramas</Label>
                <Input
                  type="number"
                  min={0}
                  value={hop.grams || ""}
                  onChange={(e) => updateHop(i, "grams", e.target.value)}
                />
              </div>
              <div className="w-20 space-y-1">
                <Label className="text-xs text-muted-foreground">Min.</Label>
                <Input
                  type="number"
                  min={0}
                  max={boilDurationMin}
                  value={hop.minutesBeforeEnd}
                  onChange={(e) => updateHop(i, "minutesBeforeEnd", e.target.value)}
                />
              </div>
              {hops.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-destructive"
                  onClick={() => removeHop(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Min. = minutos antes do fim da fervura (ex: 60 = inicio, 0 = fim)
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label>Tipo de envase</Label>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className={`cursor-pointer transition-colors ${envaseType === "priming" ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
              onClick={() => setEnvaseType("priming")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <FlaskConical
                  className={`h-8 w-8 ${envaseType === "priming" ? "text-primary" : "text-muted-foreground"}`}
                />
                <div>
                  <p className="font-medium">Priming</p>
                  <p className="text-xs text-muted-foreground">Garrafas PET</p>
                </div>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-colors ${envaseType === "co2" ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
              onClick={() => setEnvaseType("co2")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <Beer
                  className={`h-8 w-8 ${envaseType === "co2" ? "text-primary" : "text-muted-foreground"}`}
                />
                <div>
                  <p className="font-medium">CO2</p>
                  <p className="text-xs text-muted-foreground">Barril</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label>Controle de fermentacao</Label>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className={`cursor-pointer transition-colors ${fermentationType === "cooler" ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
              onClick={() => setFermentationType("cooler")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <Snowflake
                  className={`h-8 w-8 ${fermentationType === "cooler" ? "text-primary" : "text-muted-foreground"}`}
                />
                <div>
                  <p className="font-medium">Cooler + Gelo</p>
                  <p className="text-xs text-muted-foreground">Troca de gelo manual</p>
                </div>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-colors ${fermentationType === "frigobar" ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
              onClick={() => setFermentationType("frigobar")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <Thermometer
                  className={`h-8 w-8 ${fermentationType === "frigobar" ? "text-primary" : "text-muted-foreground"}`}
                />
                <div>
                  <p className="font-medium">Frigobar</p>
                  <p className="text-xs text-muted-foreground">Temperatura controlada</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Button onClick={handleStart} className="w-full h-14 text-lg gap-2">
        <Beer className="h-5 w-5" />
        Iniciar Brassagem
      </Button>
    </div>
  )
}
