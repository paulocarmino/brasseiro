export interface GlossaryEntry {
  term: string
  definition: string
  aliases: string[]
}

export const glossary: GlossaryEntry[] = [
  {
    term: "ABV",
    definition:
      "Alcohol By Volume. Percentual de alcool na cerveja. Calculado pela formula: (OG - FG) × 131.25.",
    aliases: ["teor alcoolico"],
  },
  {
    term: "Airlock",
    definition:
      "Valvula que permite a saida do CO2 produzido durante a fermentacao sem deixar ar externo entrar no fermentador. Pode ser preenchido com agua ou solucao sanitizante (iodo).",
    aliases: ["valvula airlock", "batoque"],
  },
  {
    term: "Alpha-acido",
    definition:
      "Composto presente no lupulo responsavel pelo amargor da cerveja. E isomerizado durante a fervura — quanto mais tempo ferve, mais amarga fica.",
    aliases: ["alfa-acido", "AA"],
  },
  {
    term: "Atenuacao",
    definition:
      "Percentual de acucares que a levedura conseguiu consumir. Calculado como (OG - FG) / (OG - 1) × 100. Atenuacao alta = cerveja mais seca.",
    aliases: [],
  },
  {
    term: "BIAB",
    definition:
      "Brew In A Bag. Metodo de brassagem onde os graos sao colocados dentro de um saco (bag) de voal e imersos na agua quente. Simplifica o processo eliminando a necessidade de equipamentos de filtragem separados.",
    aliases: ["brew in a bag"],
  },
  {
    term: "Boil-over",
    definition:
      "Quando o mosto transborda da panela durante a fervura. Acontece especialmente no inicio da fervura e ao adicionar lupulo. Abaixe o fogo imediatamente se comecar a subir!",
    aliases: [],
  },
  {
    term: "Brassagem",
    definition:
      "O processo completo de fabricacao de cerveja, do cozimento dos graos ate a fermentacao. Tambem chamado de 'brew day'.",
    aliases: ["brew day", "dia de brassagem"],
  },
  {
    term: "Carbonatacao",
    definition:
      "Processo de adicionar gas carbonico (CO2) a cerveja. Pode ser natural (priming com acucar) ou forcada (injecao de CO2 no barril).",
    aliases: ["carbonatar"],
  },
  {
    term: "Cold crash",
    definition:
      "Resfriamento drastico da cerveja (proximo a 0°C) apos a fermentacao para clarificar. A levedura e proteinas decantam no fundo. Minimo 4-5 dias na geladeira.",
    aliases: ["clarificacao a frio", "maturacao a frio"],
  },
  {
    term: "DMS",
    definition:
      "Dimetil Sulfeto. Off-flavor com gosto de milho cozido. Produzido durante a mostura e eliminado durante uma fervura vigorosa com panela destampada. Por isso a fervura precisa ser forte!",
    aliases: ["dimetil sulfeto"],
  },
  {
    term: "Dry hopping",
    definition:
      "Adicao de lupulo apos a fervura (geralmente durante a fermentacao) para adicionar aroma sem amargor. Comum em IPAs.",
    aliases: ["lupulagem a frio"],
  },
  {
    term: "FG",
    definition:
      "Final Gravity (Densidade Final). Medida da densidade do mosto apos a fermentacao. Valores tipicos: 1.008-1.015. Quando a FG para de baixar por 2-3 dias, a fermentacao terminou.",
    aliases: ["densidade final", "final gravity"],
  },
  {
    term: "Fermentacao",
    definition:
      "Processo onde a levedura consome os acucares do mosto e produz alcool e CO2. Temperatura ideal depende da cepa, mas geralmente abaixo de 20°C para ales. Dura cerca de 6-7 dias.",
    aliases: ["fermentar"],
  },
  {
    term: "Hidratacao de levedura",
    definition:
      "Processo de reidratar a levedura seca em agua morna esterilizada (~30°C) antes de adicionar ao mosto. Melhora significativamente a saude e velocidade da fermentacao.",
    aliases: ["hidratar levedura", "reidratacao"],
  },
  {
    term: "IBU",
    definition:
      "International Bitterness Units. Escala que mede o amargor da cerveja. Uma lager leve tem ~10 IBU, uma IPA pode ter 40-70 IBU. Determinado pelo tempo de fervura e quantidade de lupulo.",
    aliases: ["unidade de amargor"],
  },
  {
    term: "Inoculacao",
    definition:
      "Ato de adicionar a levedura ao mosto resfriado (tambem chamado de 'pitch'). O mosto deve estar abaixo de 25°C para nao matar a levedura.",
    aliases: ["pitch", "pitching"],
  },
  {
    term: "Kraeusen",
    definition:
      "Espuma densa e ativa que se forma no topo do mosto durante a fermentacao mais vigorosa. Sinal de fermentacao saudavel! Aparece nas primeiras 24-48h.",
    aliases: [],
  },
  {
    term: "Levedura",
    definition:
      "Fungo unicelular responsavel pela fermentacao. Consome acucares e produz alcool, CO2 e aromas. Cada cepa produz sabores diferentes — frutal, neutro, picante, etc.",
    aliases: ["fermento", "yeast"],
  },
  {
    term: "Lupulo",
    definition:
      "Flor usada na cerveja para dar amargor (quando fervida) e aroma (quando adicionada no final). Diferentes variedades dao perfis diferentes: citrico, floral, herbal, etc.",
    aliases: ["hops", "lupulos"],
  },
  {
    term: "Malte",
    definition:
      "Cereal (geralmente cevada) que foi germinado e seco. Fornece os acucares que a levedura vai fermentar. Diferentes maltes dao cores e sabores diferentes a cerveja.",
    aliases: ["grao", "malte base"],
  },
  {
    term: "Mostura",
    definition:
      "Etapa onde os graos moidos sao misturados com agua quente (62-72°C) para converter amido em acucares fermentaveis. As enzimas alfa e beta amilase fazem essa conversao. Dura 30-60 minutos.",
    aliases: ["mash", "cozimento"],
  },
  {
    term: "OG",
    definition:
      "Original Gravity (Densidade Original). Medida da densidade do mosto antes da fermentacao. Indica a quantidade de acucares disponiveis. Valores tipicos: 1.035-1.080.",
    aliases: ["densidade original", "original gravity"],
  },
  {
    term: "Off-flavor",
    definition:
      "Sabor indesejado na cerveja. Pode ser causado por contaminacao, temperaturas erradas, ou problemas no processo. Exemplos: DMS (milho), diacetil (manteiga), fenol (band-aid).",
    aliases: ["defeito", "sabor indesejado"],
  },
  {
    term: "Priming",
    definition:
      "Metodo de carbonatacao natural onde se adiciona acucar na cerveja antes de engarrafar. A levedura residual fermenta o acucar na garrafa, produzindo CO2. Dose tipica: ~6-8g por litro.",
    aliases: ["refermentacao na garrafa"],
  },
  {
    term: "Sanitizacao",
    definition:
      "Processo de eliminar microrganismos de equipamentos que terao contato com o mosto frio. Essencial para evitar contaminacao. Iodo (sem enxague) ou acido peracetico sao os mais comuns.",
    aliases: ["sanitizar", "esterilizar"],
  },
  {
    term: "Sparge",
    definition:
      "Lavagem dos graos com agua quente (~70°C) apos a mostura para extrair o maximo de acucares. No BIAB, geralmente se faz com 2L de agua quente despejados sobre o bag.",
    aliases: ["lavagem dos graos", "sparging"],
  },
  {
    term: "SRM",
    definition:
      "Standard Reference Method. Escala que mede a cor da cerveja. 2-3 SRM = palha (pilsner), 10-15 = ambar, 25+ = marrom escuro, 40+ = preto (stout).",
    aliases: ["cor da cerveja"],
  },
  {
    term: "Strike temperature",
    definition:
      "Temperatura da agua antes de adicionar os graos. Precisa ser um pouco mais alta que a temperatura desejada de mostura, porque os graos frios vao baixar a temperatura ao entrar.",
    aliases: ["temperatura de strike", "temp de infusao"],
  },
  {
    term: "Trub",
    definition:
      "Sedimento formado por proteinas coaguladas, lupulo usado e levedura morta. Fica no fundo da panela apos a fervura e no fundo do fermentador apos a fermentacao. Nao envase o trub!",
    aliases: ["sedimento", "borra"],
  },
  {
    term: "Whirlpool",
    definition:
      "Tecnica de criar um redemoinho no mosto apos a fervura para concentrar o trub no centro da panela, facilitando a transferencia do mosto limpo. Tambem usado para adicao de lupulo aromatico.",
    aliases: ["redemoinho"],
  },
]
