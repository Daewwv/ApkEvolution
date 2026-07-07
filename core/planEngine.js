
export function createPlan(diagnostic) {
  if (!diagnostic.available) {
    return {
      id:"coming_soon",
      title:"Caminho em preparação",
      chapter:"Ainda não construído neste MVP",
      durationDays:0,
      focusCompetency:"none",
      target:"Este caminho existe na visão da ProgressLife, mas ainda não está pronto para teste.",
      nextChapters:[]
    };
  }

  const chapterByFocus = {
    budget:"Controle financeiro",
    saving:"Reserva inicial",
    offer_discovery:"Descobrir oportunidades de renda",
    sales:"Vendas e renda extra",
    investing:"Educação sobre investimentos",
    discipline:"Constância financeira"
  };

  const targetByFocus = {
    budget:"Entender para onde o dinheiro está indo e corrigir vazamentos.",
    saving:"Criar o hábito de separar dinheiro antes de gastar.",
    offer_discovery:"Descobrir o que você poderia oferecer antes de tentar vender.",
    sales:"Praticar ofertas simples e melhorar comunicação de valor.",
    investing:"Aprender liquidez, risco e quando não investir.",
    discipline:"Construir um ritmo sustentável de execução."
  };

  return {
    id:"finance_15d_"+diagnostic.bottleneck,
    title:"Plano de 15 dias",
    chapter:chapterByFocus[diagnostic.bottleneck] || "Controle financeiro",
    durationDays:15,
    focusCompetency:diagnostic.bottleneck,
    target:targetByFocus[diagnostic.bottleneck],
    reviewInDays:15,
    nextChapters:[
      "Controle financeiro",
      "Reserva mínima",
      "Fundo de emergência",
      "Aumentar renda",
      "Educação sobre investimentos",
      "Investir apenas capital que não seja emergência"
    ],
    createdAt:new Date().toISOString()
  };
}
