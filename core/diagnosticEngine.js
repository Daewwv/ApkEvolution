
export const availableGoal = "financial_freedom";

export const diagnosticQuestions = [
  {id:"main_goal",title:"Qual caminho você quer começar agora?",type:"choice",options:[
    {value:"financial_freedom",label:"Liberdade financeira"},
    {value:"health",label:"Melhorar saúde"},
    {value:"career",label:"Crescer na carreira"},
    {value:"learn_skill",label:"Aprender uma habilidade"}
  ]},
  {id:"daily_time",title:"Quanto tempo você consegue manter por dia?",type:"choice",options:[
    {value:15,label:"15 minutos"},{value:30,label:"30 minutos"},{value:60,label:"60 minutos"},{value:90,label:"90 minutos ou mais"}
  ]},
  {id:"financial_stage",title:"Qual frase descreve melhor sua vida financeira?",type:"choice",showIf:{main_goal:"financial_freedom"},options:[
    {value:"surviving",label:"Vivo no limite e quase nunca sobra dinheiro"},
    {value:"sometimes_save",label:"Às vezes consigo guardar, mas não mantenho"},
    {value:"monthly_save",label:"Já guardo dinheiro quase todo mês"},
    {value:"investing",label:"Já invisto e quero evoluir"}
  ]},
  {id:"income",title:"Qual é sua renda mensal aproximada?",type:"number",showIf:{main_goal:"financial_freedom"},placeholder:"Ex: 2500"},
  {id:"current_savings",title:"Quanto você tem guardado hoje?",type:"number",showIf:{main_goal:"financial_freedom"},placeholder:"Ex: 200"},
  {id:"has_offer",title:"Você tem algo claro para oferecer ou vender hoje?",type:"choice",showIf:{main_goal:"financial_freedom"},options:[
    {value:"yes",label:"Sim, já sei o que posso oferecer"},
    {value:"maybe",label:"Talvez, tenho habilidades mas não sei vender"},
    {value:"no",label:"Não tenho produto nem serviço definido"}
  ]},
  {id:"main_blocker",title:"O que mais trava seu avanço hoje?",type:"choice",showIf:{main_goal:"financial_freedom"},options:[
    {value:"low_income",label:"Ganho pouco"},
    {value:"spending",label:"Gasto sem controlar"},
    {value:"discipline",label:"Falta constância"},
    {value:"knowledge",label:"Não sei o caminho"},
    {value:"sales",label:"Não sei vender ou gerar renda extra"}
  ]}
];

export function getVisibleQuestions(answers){
  return diagnosticQuestions.filter(q=>{
    if(!q.showIf) return true;
    return Object.entries(q.showIf).every(([k,v])=>answers[k]===v);
  });
}

export function createDiagnostic(answers) {
  const time = Number(answers.daily_time || 30);
  let rhythm = "constancia";
  if (time >= 60) rhythm = "equilibrio";
  if (time >= 90) rhythm = "intensivo";

  if (answers.main_goal !== "financial_freedom") {
    return {
      goal: answers.main_goal,
      available: false,
      dailyTime: time,
      rhythm,
      createdAt: new Date().toISOString()
    };
  }

  const income = Number(answers.income || 0);
  const savings = Number(answers.current_savings || 0);
  const competencies = {budget:20,saving:20,offer_discovery:10,sales:5,investing:10,discipline:35};

  if (answers.financial_stage === "sometimes_save") {competencies.budget=35;competencies.saving=35;}
  if (answers.financial_stage === "monthly_save") {competencies.budget=60;competencies.saving=65;competencies.discipline=55;}
  if (answers.financial_stage === "investing") {competencies.budget=75;competencies.saving=75;competencies.investing=55;competencies.discipline=65;}

  let bottleneck = "budget";
  if (answers.main_blocker === "sales" || answers.main_blocker === "low_income") {
    bottleneck = answers.has_offer === "yes" ? "sales" : "offer_discovery";
  }
  if (answers.main_blocker === "spending") bottleneck = "budget";
  if (answers.main_blocker === "discipline") bottleneck = "discipline";
  if (answers.main_blocker === "knowledge") bottleneck = "budget";

  return {
    goal:"financial_freedom",
    available:true,
    dailyTime:time,
    rhythm,
    income,
    savings,
    hasOffer:answers.has_offer,
    blocker:answers.main_blocker,
    competencies,
    bottleneck,
    createdAt:new Date().toISOString()
  };
}
