import type { BrewSession, PhaseDefinition, TimerAlert } from "@/types/brew"

function generateStirAlerts(durationMin: number): Omit<TimerAlert, "fired">[] {
  const alerts: Omit<TimerAlert, "fired">[] = []
  const intervalMin = 15
  for (let min = intervalMin; min < durationMin; min += intervalMin) {
    alerts.push({
      id: `stir-${min}`,
      label: `Hora de mexer! (${min}min)`,
      atMs: min * 60 * 1000,
      type: "stir",
    })
  }
  alerts.push({
    id: "mostura-complete",
    label: "Mostura finalizada!",
    atMs: durationMin * 60 * 1000,
    type: "complete",
  })
  return alerts
}

function generateHopAlerts(session: BrewSession): Omit<TimerAlert, "fired">[] {
  const boilMs = session.boilDurationMin * 60 * 1000
  const alerts: Omit<TimerAlert, "fired">[] = []

  const sorted = [...session.hops].sort((a, b) => b.minutesBeforeEnd - a.minutesBeforeEnd)

  for (const hop of sorted) {
    const atMs = boilMs - hop.minutesBeforeEnd * 60 * 1000
    alerts.push({
      id: `hop-${hop.name}-${hop.minutesBeforeEnd}`,
      label: `Adicionar ${hop.name} (${hop.grams}g)`,
      atMs: Math.max(0, atMs),
      type: "hop",
    })
  }

  alerts.push({
    id: "fervura-complete",
    label: "Fervura finalizada! Desligar fogo.",
    atMs: boilMs,
    type: "complete",
  })

  return alerts
}

export function buildPhaseSteps(session: BrewSession): PhaseDefinition[] {
  return [
    // ===== FASE 1: PREPARACAO =====
    {
      id: "preparacao",
      title: "Preparacao",
      icon: "ClipboardCheck",
      description: "Separe tudo antes de comecar. Organizacao e metade do sucesso!",
      steps: [
        {
          index: 0,
          type: "checklist",
          title: "Checklist de preparacao",
          description:
            "Confira se tudo esta pronto antes de ligar o fogo. Uma vez que comeca, nao da pra pausar!",
          checklistItems: [
            "Panela limpa (se nova: ferver agua pra criar camada de oxidacao)",
            "Fermentador lavado",
            "Bag (saco de voal) pronto com cordao",
            "Termometro disponivel",
            "Densimetro + proveta prontos",
            "Sanitizante separado (iodo/biofor)",
            "Ingredientes conferidos: malte moido, lupulo, levedura",
            `Agua mineral/filtrada: ~${Math.ceil(session.mashDurationMin === 30 ? 6 : 7)}L + 2L para lavagem`,
            "Receita impressa ou no celular",
          ],
          scienceNote:
            "Se sua panela de aluminio e nova, ferva agua nela primeiro por uns 10 minutos. Isso cria uma camada de oxidacao que protege o aluminio — como se fosse um escudo invisivel. Faz uma vez so e pronto, nao precisa repetir.",
          glossaryTerms: ["BIAB", "sanitizacao"],
        },
      ],
    },

    // ===== FASE 2: MOSTURA =====
    {
      id: "mostura",
      title: "Mostura",
      icon: "Thermometer",
      description: "Hora de cozinhar os graos e extrair os acucares!",
      steps: [
        {
          index: 0,
          type: "action",
          title: "Aquecer a agua",
          description: `Coloque a agua na panela e aqueca ate **${session.mashTempC}°C**. Fique de olho no termometro — quando chegar na temperatura, passe pro proximo passo imediatamente.`,
          glossaryTerms: ["strike temperature"],
        },
        {
          index: 1,
          type: "warning",
          title: "DESLIGAR O FOGO!",
          description:
            "Antes de colocar o bag com malte, **DESLIGUE O FOGO**. O fogo vai ficar desligado durante toda a mostura. Se deixar ligado, o bag pode derreter ou queimar no fundo da panela.",
          warning:
            "DESLIGUE O FOGO antes de colocar o bag! O bag pode derreter com contato direto no fundo quente.",
        },
        {
          index: 2,
          type: "action",
          title: "Adicionar bag + malte",
          description:
            "Coloque o bag de voal na panela, amarrando o cordao na alca. Despeje o malte moido dentro do bag. Mexa bem pra nao ter grumos — todos os graos precisam estar molhados.",
          scienceNote:
            "Nessa temperatura, as enzimas alfa e beta amilase estao trabalhando pesado, quebrando o amido dos graos em acucares fermentaveis. Temperatura mais alta (~68-72°C) = mais dextrinas = cerveja mais encorpada. Temperatura mais baixa (~62-65°C) = mais acucares simples = cerveja mais seca e alcoolica.",
          glossaryTerms: ["mostura", "malte"],
        },
        {
          index: 3,
          type: "timer",
          title: `Timer da mostura (${session.mashDurationMin} min)`,
          description: `Agora e so esperar ${session.mashDurationMin} minutos. Feche a panela pra manter a temperatura. A cada 15 minutos, de uma mexida suave no bag — isso ajuda a extrair mais acucares.`,
          timerConfig: {
            durationMin: session.mashDurationMin,
            alerts: generateStirAlerts(session.mashDurationMin),
          },
          glossaryTerms: ["mostura"],
        },
        {
          index: 4,
          type: "parallel",
          title: "Enquanto isso: agua de lavagem",
          description:
            "Enquanto a mostura rola, aqueça ~2 litros de agua separadamente ate 70°C. Essa agua vai ser usada pra lavar os graos depois e extrair mais acucares.",
          parallelTasks: [
            {
              index: 0,
              type: "action",
              title: "Aquecer agua de lavagem",
              description:
                "Em outra panela (pode ser uma panelinha de casa), aqueca 2L de agua mineral ate 70°C.",
            },
          ],
          glossaryTerms: ["sparge"],
        },
        {
          index: 5,
          type: "action",
          title: "Retirar bag e lavar graos",
          description:
            "Levante o bag devagar e deixe escorrer. Use um escorredor de macarrao pra apoiar. Despeje a agua de lavagem quente (70°C) sobre o bag pra extrair os acucares restantes. Pode espremer o bag sim — diferente do que muitos dizem, apertar nao extrai taninos em excesso.",
          scienceNote:
            "A lavagem dos graos (sparge) aumenta sua eficiencia de brassagem. Sem ela, voce perde uns 10-15% dos acucares que ficam presos nos graos. Dica da comunidade: pode espremer o bag sim! Aquele mito de 'nao apertar' foi desmentido — na pratica, a diferenca de taninos e minima.",
          glossaryTerms: ["sparge"],
        },
        {
          index: 6,
          type: "action",
          title: "Acertar o volume",
          description:
            "Confira o volume na panela. Precisa ficar um pouco acima do volume final desejado (vai perder ~1L na fervura por evaporacao). Se precisar, complete com agua fria.",
        },
      ],
    },

    // ===== FASE 3: FERVURA =====
    {
      id: "fervura",
      title: "Fervura",
      icon: "Flame",
      description: "Lupulo, aromas e a magia do amargor!",
      steps: [
        {
          index: 0,
          type: "warning",
          title: "Cuidado com o boil-over!",
          description:
            "Ligue o fogo e leve a fervura. **FIQUE DE OLHO** nos primeiros minutos — quando comecar a ferver forte, o mosto pode subir rapido e transbordar. Se comecar a subir, **abaixe o fogo imediatamente** ou sopre a espuma. Depois que estabilizar, pode deixar uma fervura constante.",
          warning:
            "BOIL-OVER: O mosto pode transbordar nos primeiros minutos de fervura! Fique perto e abaixe o fogo se comecar a subir.",
        },
        {
          index: 1,
          type: "timer",
          title: `Fervura (${session.boilDurationMin} min)`,
          description: `Timer de ${session.boilDurationMin} minutos em contagem regressiva. Os alertas de lupulo vao aparecer nos tempos certos conforme sua receita. Fique atento!`,
          timerConfig: {
            durationMin: session.boilDurationMin,
            alerts: generateHopAlerts(session),
          },
          scienceNote:
            "Na fervura acontecem varias coisas: os alfa-acidos do lupulo sao isomerizados (isso da o amargor), proteinas coagulam (clarifica a cerveja), DMS e evaporado (aquele gosto de milho), e o mosto e esterilizado. Por isso nao tampa a panela — o DMS precisa sair!",
          glossaryTerms: ["lupulo", "alpha-acido", "DMS", "boil-over"],
        },
        {
          index: 2,
          type: "parallel",
          title: "Tarefas paralelas durante a fervura",
          description: "Aproveite o tempo da fervura pra adiantar essas tarefas essenciais:",
          parallelTasks: [
            {
              index: 0,
              type: "checklist",
              title: "Sanitizar fermentador",
              description:
                "Prepare uma solucao de iodo (1ml por litro de agua, mais ou menos 20 gotas por litro). Encha o fermentador, tampe e deixe. Nao precisa enxaguar — o iodo evapora em 24h sem deixar gosto.",
              checklistItems: [
                "Preparar solucao de iodo (~1ml/litro)",
                "Encher fermentador com solucao",
                "Sanitizar tampa e airlock tambem",
                "Separar um pouco de solucao pro airlock",
              ],
            },
            {
              index: 1,
              type: "action",
              title: "Hidratar levedura",
              description:
                "Coloque ~200ml de agua filtrada num copo, aqueca no micro-ondas por 2 minutos (so pra esterilizar), depois deixe esfriar ate temperatura ambiente (~25-30°C). Quando esfriar, abra o sachet de levedura e despeje na agua. Nao mexa — deixe ela hidratar por pelo menos 15 minutos.",
            },
          ],
          glossaryTerms: ["sanitizacao", "hidratacao de levedura"],
        },
      ],
    },

    // ===== FASE 4: RESFRIAMENTO + FERMENTACAO =====
    {
      id: "resfriamento",
      title: "Resfriamento & Fermentacao",
      icon: "Snowflake",
      description: "Resfriar, inocular e acompanhar a magia da fermentacao!",
      steps: [
        {
          index: 0,
          type: "action",
          title: "Banho de gelo",
          description:
            "Coloque a panela na pia com bastante gelo e agua fria ao redor. O objetivo e baixar a temperatura o mais rapido possivel. Com banho de gelo domestico, e dificil baixar de 30°C, entao pode transferir pro fermentador e colocar na geladeira pra terminar de resfriar.",
          scienceNote:
            "Resfriar rapido e importante por dois motivos: 1) Reduz o risco de contaminacao (bacterias adoram mosto quente), e 2) Precipita proteinas que deixam a cerveja turva. Quanto mais rapido resfriar, mais limpa a cerveja fica.",
        },
        {
          index: 1,
          type: "action",
          title: "Transferir pro fermentador",
          description:
            "Descarte a solucao sanitizante do fermentador. Transfira o mosto resfriado pra dentro. Tente nao pegar o sedimento (trub) do fundo da panela.",
          glossaryTerms: ["trub"],
        },
        {
          index: 2,
          type: "input",
          title: "Medir densidade original (OG)",
          description:
            "Com o densimetro e a proveta, meca a densidade do mosto. Anote o valor — ele vai ser comparado com a densidade final pra calcular o teor alcoolico. Pode provar o mosto tambem!",
          glossaryTerms: ["OG", "ABV"],
        },
        {
          index: 3,
          type: "action",
          title: "Adicionar levedura",
          description:
            "A levedura ja deve estar hidratada e na temperatura ambiente. Despeje ela no mosto. Nao precisa mexer — feche o fermentador.",
          glossaryTerms: ["inoculacao", "levedura"],
        },
        {
          index: 4,
          type: "action",
          title: "Selar com airlock",
          description:
            "Coloque o airlock na tampa do fermentador. Encha o airlock com a solucao de iodo que voce separou. O CO2 da fermentacao vai borbulhar nessa solucao e nada vai entrar pra contaminar.",
          glossaryTerms: ["airlock"],
        },
        {
          index: 5,
          type: "info",
          title: "Controle de temperatura",
          description:
            "Coloque o fermentador dentro de um cooler ou caixa com garrafas PET congeladas ou bolsas de gelo. O objetivo e manter **abaixo de 20°C** durante toda a fermentacao. Troque o gelo de **manha e a noite**. Dica: coloque um copo com agua e o termometro dentro do cooler pra monitorar a temperatura.",
          scienceNote:
            "Temperatura e o fator #1 na qualidade da fermentacao. Acima de 20°C, a levedura produz mais esteres e fenois (off-flavors). Quanto mais estavel a temperatura, mais limpa e suave a cerveja fica. E melhor manter constante em 19°C do que ficar variando entre 15°C e 22°C.",
          glossaryTerms: ["fermentacao", "off-flavor"],
        },
        {
          index: 6,
          type: "info",
          title: "Acompanhamento da fermentacao",
          description:
            "Agora comeca a fase multi-dia! A fermentacao dura em media **6-7 dias**. Nao abra o fermentador pra espiar! Acompanhe pelas bolhas no airlock. Depois de 6 dias, meca a densidade — se estiver estavel por 2-3 dias, a fermentacao terminou. Valor tipico de FG: 1.006-1.015.",
          glossaryTerms: ["FG", "kraeusen", "atenuacao"],
        },
        {
          index: 7,
          type: "info",
          title: "Cold crash (maturacao a frio)",
          description:
            "Quando a fermentacao terminar (densidade estavel), coloque o fermentador **na geladeira por no minimo 5 dias**. Isso clarifica a cerveja — a levedura e proteinas decantam no fundo. Quanto mais tempo, mais clarinha e arredondada fica.",
          glossaryTerms: ["cold crash"],
        },
      ],
    },

    // ===== FASE 5: ENVASE =====
    {
      id: "envase",
      title: "Envase",
      icon: "Wine",
      description:
        session.envaseType === "priming"
          ? "Hora de engarrafar e carbonatar!"
          : "Hora de embarrilar!",
      steps:
        session.envaseType === "priming"
          ? [
              {
                index: 0,
                type: "checklist",
                title: "Sanitizar garrafas PET",
                description:
                  "Lave bem as garrafas por dentro e por fora. Se precisar, use um pouquinho de detergente neutro e enxague muito bem. Depois sanitize com solucao de iodo por dentro e por fora.",
                checklistItems: [
                  "Garrafas PET lavadas por dentro e por fora",
                  "Sanitizadas com solucao de iodo",
                  "Tampas sanitizadas tambem",
                ],
              },
              {
                index: 1,
                type: "action",
                title: "Preparar acucar de priming",
                description:
                  "Adicione o acucar diretamente em cada garrafa antes de encher. Use cerca de **6-8 gramas por litro**. Para uma garrafa de 500ml, sao ~3-4g (um sachet). Pra long neck, um sachet basta.",
                scienceNote:
                  "O acucar de priming serve como alimento pra levedura residual que ainda esta na cerveja. Ela vai fermentar esse acucar dentro da garrafa fechada, produzindo CO2 que nao tem pra onde ir — fica dissolvido na cerveja. E assim que sua cerveja fica com gas naturalmente!",
                glossaryTerms: ["priming", "carbonatacao"],
              },
              {
                index: 2,
                type: "action",
                title: "Envasar",
                description:
                  "Tire o fermentador da geladeira com cuidado, **sem balancear**. O sedimento que decantou precisa ficar no fundo. Encha as garrafas pela torneira do fermentador, devagar. Deixe uns 2-3cm de espaco no topo. **Nao envase o fundo** — aquele sedimento e levedura morta e trub.",
                glossaryTerms: ["trub"],
              },
              {
                index: 3,
                type: "action",
                title: "Fechar e armazenar",
                description:
                  "Feche as garrafas **bem apertado**. Coloque numa caixa de papelao em um cantinho fresco da casa (20-25°C). **Minimo 7 dias, ideal 10 dias.** Dica: aperte a garrafa PET pra sentir se ta dura — se tiver bem dura, a carbonatacao ta boa!",
                scienceNote:
                  "A garrafa PET e sua melhor amiga no priming! Diferente do vidro, voce pode apertar pra sentir a pressao interna. Quando a garrafa tiver bem dura (tipo uma PET de refri lacrada), a carbonatacao ta pronta. Ai e so colocar na geladeira e tomar!",
              },
              {
                index: 4,
                type: "action",
                title: "Servir!",
                description:
                  "Depois de 7-10 dias, coloque na geladeira por pelo menos 24h (quanto mais, melhor — ajuda a decantar o sedimento). Sirva com cuidado, sem agitar a garrafa. O ultimo gole fica com um pouco de sedimento — e normal, e levedura. Pode tomar, nao faz mal!",
              },
            ]
          : [
              {
                index: 0,
                type: "checklist",
                title: "Sanitizar barril",
                description: "Sanitize o barril, a tampa e todas as conexoes com solucao de iodo.",
                checklistItems: [
                  "Barril lavado e sanitizado",
                  "Tampa e conexoes sanitizadas",
                  "Mangueiras sanitizadas",
                ],
              },
              {
                index: 1,
                type: "action",
                title: "Transferir para o barril",
                description:
                  "Transfira a cerveja do fermentador para o barril com cuidado, evitando pegar o sedimento do fundo. Use a torneira do fermentador se tiver.",
              },
              {
                index: 2,
                type: "action",
                title: "Carbonatar com CO2",
                description:
                  "Conecte o CO2 no barril. Para carbonatacao forcada rapida: coloque em ~30 PSI, agite por 2-3 minutos, depois baixe pra ~12 PSI pra servir. Para carbonatacao lenta (melhor resultado): deixe em ~12 PSI por 5-7 dias na geladeira.",
                glossaryTerms: ["carbonatacao"],
              },
              {
                index: 3,
                type: "action",
                title: "Servir!",
                description:
                  "Depois de carbonatada, sua cerveja ta pronta! Sirva na pressao de servico (~10-12 PSI). O barril mantem a cerveja fresca e carbonatada por semanas.",
              },
            ],
    },
  ]
}
