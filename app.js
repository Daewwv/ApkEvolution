
const BUILD="v0.5.1 Review";
const KEY="progresslife_v051_review";
let state=load();

function initial(){return{route:"welcome",user:null,step:0,answers:{},xp:0,plan:null,missions:[],evidence:[],extraAdded:false,daysActive:1,mentorConfidence:18}}
function load(){try{return{...initial(),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return initial()}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function go(r){state.route=r;save();render()}

const questions=[
{id:"why",title:"Por que a liberdade financeira é importante para você?",type:"choice",options:[["house","Comprar uma casa"],["family","Ajudar minha família"],["peace","Ter tranquilidade"],["job","Sair de um trabalho ruim"],["future","Construir futuro"]]},
{id:"time",title:"Quanto tempo real você consegue manter por dia?",type:"choice",options:[[15,"15 minutos"],[30,"30 minutos"],[60,"60 minutos"],[90,"90 minutos ou mais"]]},
{id:"stage",title:"Como está sua vida financeira hoje?",type:"choice",options:[["surviving","Vivo no limite"],["sometimes","Às vezes sobra"],["saving","Guardo quase todo mês"],["investing","Já invisto"]]},
{id:"income",title:"Qual é sua renda mensal aproximada?",type:"number",placeholder:"Ex: 2500"},
{id:"savings",title:"Quanto você tem guardado hoje?",type:"number",placeholder:"Ex: 200"},
{id:"blocker",title:"O que mais trava seu avanço?",type:"choice",options:[["spending","Gasto sem controlar"],["income","Ganho pouco"],["discipline","Falta constância"],["knowledge","Não sei o caminho"],["offer","Não sei o que posso oferecer para ganhar mais"]]}
];

const chaptersByFocus={
 budget:["Controle financeiro","Reserva inicial","Aumentar renda","Proteção financeira","Educação sobre investimentos","Patrimônio"],
 offer:["Descobrir renda","Primeira oferta","Primeiro dinheiro extra","Controle financeiro","Reserva inicial","Educação sobre investimentos","Patrimônio"],
 saving:["Reserva inicial","Controle financeiro avançado","Proteção financeira","Educação sobre investimentos","Patrimônio"]
};

const missionLibrary={
budget:[
{id:"FIN_CH01_M001",type:"Aplicação",title:"Analisar seus últimos gastos",minutes:15,stars:2,why:"Você precisa descobrir para onde o dinheiro está indo antes de tentar guardar mais.",help:"Escreva 1 gasto evitável, 1 padrão que percebeu e 1 ajuste que fará amanhã.",requiresText:true,evidence:"Analisou gastos e identificou melhoria."},
{id:"FIN_CH01_M002",type:"Aprendizagem",title:"Entender orçamento pessoal",minutes:15,stars:1,why:"Orçamento não é restrição. É direção.",quiz:[["Qual é o objetivo de um orçamento?",["Controlar e decidir melhor","Gastar menos sempre","Investir antes de guardar"],0],["O que deve ser identificado primeiro?",["Vazamentos de dinheiro","Ações na bolsa","Cartão novo"],0]],evidence:"Concluiu quiz sobre orçamento."},
{id:"FIN_CH01_M003",type:"Reflexão",title:"Responder: o que mais dificultou hoje?",minutes:3,stars:1,why:"O mentor precisa entender seus obstáculos reais.",help:"Escreva o obstáculo real: tempo, energia, dinheiro, confusão, vergonha ou outro.",requiresText:true,evidence:"Registrou dificuldade do dia."}
],
offer:[
{id:"FIN_CH03_M001",type:"Descoberta",title:"Listar 5 coisas que você sabe fazer",minutes:15,stars:2,why:"Antes de vender, você precisa descobrir o que poderia oferecer.",help:"Exemplo: ensinar espanhol, ajudar com computador, traduzir, organizar documentos, fazer entregas, limpar, cozinhar.",requiresText:true,evidence:"Listou habilidades possíveis."},
{id:"FIN_CH03_M002",type:"Descoberta",title:"Transformar uma habilidade em oferta simples",minutes:20,stars:3,why:"Dinheiro aparece quando uma habilidade resolve um problema específico.",help:"Escolha 1 habilidade e escreva: Eu ajudo [tipo de pessoa] a resolver [problema] por R$__.",requiresText:true,evidence:"Criou primeira oferta simples."},
{id:"FIN_CH03_M003",type:"Reflexão",title:"Qual bloqueio você sente ao pensar em vender?",minutes:5,stars:1,why:"Vender também envolve vergonha, medo e clareza. O mentor precisa saber onde você trava.",help:"Escreva se o problema é não saber o que vender, medo de oferecer, vergonha, falta de pessoas ou outro.",requiresText:true,evidence:"Registrou bloqueio sobre renda extra."}
],
saving:[
{id:"FIN_CH02_M001",type:"Ação",title:"Separar R$10 para sua reserva",minutes:5,stars:1,why:"O hábito vem antes do valor alto.",money:10,evidence:"Guardou R$10."},
{id:"FIN_CH02_M002",type:"Reflexão",title:"Definir onde guardar sua reserva",minutes:10,stars:1,why:"Reserva não é dinheiro para arriscar. É dinheiro para proteger sua vida.",help:"Escreva onde pretende deixar a reserva e por quê.",requiresText:true,evidence:"Definiu local inicial da reserva."},
{id:"FIN_CH02_M003",type:"Aprendizagem",title:"Entender reserva de emergência",minutes:15,stars:1,why:"Antes de investir, você precisa proteger sua vida financeira.",quiz:[["Reserva deve ter prioridade sobre investimento arriscado?",["Sim","Não"],0],["Reserva precisa ter:",["Liquidez e baixo risco","Alto risco e promessa alta"],0]],evidence:"Concluiu quiz sobre reserva."}
],
extra:[
{id:"FIN_EXTRA_001",type:"Avanço",title:"Ação extra: recuperar ou economizar R$10",minutes:15,stars:3,why:"Acelera o caminho sem depender de motivação vazia.",help:"Escreva como tentou economizar ou conseguir R$10 hoje.",requiresText:true,evidence:"Tentou gerar ou economizar R$10 extras."},
{id:"FIN_EXTRA_002",type:"Avanço",title:"Revisar uma decisão financeira de hoje",minutes:8,stars:2,why:"Pequenas decisões repetidas constroem ou destroem patrimônio.",help:"Escreva uma decisão financeira que tomou hoje e se ela ajudou ou atrapalhou.",requiresText:true,evidence:"Revisou uma decisão financeira."}
]
};

function chooseFocus(){let a=state.answers;if(a.blocker==="offer"||a.blocker==="income")return"offer";if(a.stage==="saving"||a.stage==="investing")return"saving";return"budget"}
function createPlan(){let focus=chooseFocus();let target={budget:"Entender seu dinheiro e corrigir vazamentos.",offer:"Descobrir oportunidades reais de renda antes de tentar vender.",saving:"Criar o hábito de separar dinheiro com segurança."}[focus];return{focus,title:"Plano inicial de 15 dias",chapter:chaptersByFocus[focus][0],target,chapters:chaptersByFocus[focus]}}
function createMissions(){let focus=state.plan.focus;return [...missionLibrary[focus]].slice(0,3).map(m=>({...m,done:false,text:"",quizAnswers:{},saved:false}))}

function nav(){return`<nav class="nav">${navBtn("home","Hoje")}${navBtn("plan","Plano")}${navBtn("evidence","Evidência")}${navBtn("profile","Perfil")}</nav>`}
function navBtn(r,l){return`<button class="${state.route===r?'active':''}" onclick="go('${r}')">${l}</button>`}
function shell(c,n=true){return`<main class="app">${c}${n?nav():""}</main>`}

function welcome(){return`<section class="center"><div style="width:min(420px,100%)"><div class="logo">PL</div><h1>ProgressLife</h1><p class="muted" style="text-align:center">Seu guia para construir liberdade financeira com clareza, passos e evidências.</p><div class="card stack"><label>Nome</label><input id="name" value="Marlon"><button class="primary" onclick="start()">Começar meu caminho</button><span class="build">${BUILD}</span></div></div></section>`}
window.start=()=>{state.user={name:document.getElementById("name").value||"Usuário"};state.route="diagnosis";save();render()}

function diagnosis(){let q=questions[state.step];if(!q)return buildPlanScreen();let input="";if(q.type==="choice")input=`<div class="stack">${q.options.map(o=>`<button class="option ${state.answers[q.id]==o[0]?'active':''}" onclick="answer('${q.id}','${o[0]}')">${o[1]}</button>`).join("")}</div>`;if(q.type==="number")input=`<input id="num" type="number" placeholder="${q.placeholder||''}" value="${state.answers[q.id]||''}"><button class="primary" onclick="answerNum('${q.id}')">Continuar</button>`;return shell(`<button class="small" onclick="backDiagnosis()">← Voltar</button><div class="top" style="margin-top:14px"><div><p class="muted">Diagnóstico ${state.step+1}/${questions.length}</p><h2>${q.title}</h2></div><span class="build">${BUILD}</span></div><section class="card stack">${input}</section>`,false)}
window.answer=(id,v)=>{state.answers[id]=v;state.step++;save();render()}
window.answerNum=(id)=>{let v=document.getElementById("num").value.trim();if(!v)return toast("Preencha para continuar.");state.answers[id]=v;state.step++;save();render()}
window.backDiagnosis=()=>{if(state.step>0)state.step--;else state.route="welcome";save();render()}

function buildPlanScreen(){state.plan=createPlan();state.missions=createMissions();state.route="planIntro";save();return planIntro()}
function planIntro(){return shell(`<div class="top"><div><p class="muted">Bem-vindo ao seu caminho</p><h2>Seu plano foi criado</h2></div><span class="build">${BUILD}</span></div><section class="card hero stack"><p class="tag">Primeiro foco</p><h2>${state.plan.chapter}</h2><p class="muted">${state.plan.target}</p><div class="grid2"><div class="stat"><strong>${state.answers.time} min</strong><span>por dia</span></div><div class="stat"><strong>15 dias</strong><span>primeiro ciclo</span></div></div></section><section class="card stack" style="margin-top:14px"><h3>O que vai acontecer</h3><p class="muted">Você receberá passos diários. Cada passo precisa gerar evidência. O plano só avança quando você demonstra progresso real.</p></section><button class="primary" style="margin-top:14px" onclick="go('home')">Começar hoje</button>`,false)}

function home(){let saved=calcSaved(),pct=Math.min(100,Math.round(saved/2000*100)),done=completedCount(),total=state.missions.length;return shell(`<div class="top"><div><p class="muted">Hoje</p><h2>Olá, ${state.user?.name||"Usuário"}</h2></div><div><span class="pill">${state.xp} XP</span><div class="build">${BUILD}</div></div></div>
<section class="card hero stack"><p class="tag">Próximo passo</p><h2>${nextStepTitle()}</h2><p class="muted">${state.plan?.target||""}</p><div class="grid2"><div class="stat"><strong>${done}/${total}</strong><span>passos feitos</span></div><div class="stat"><strong>${state.mentorConfidence}%</strong><span>confiança mentor</span></div></div></section>
<section class="card stack" style="margin-top:14px"><p class="tag">Reserva inicial</p><div class="progressbar"><span style="width:${pct}%"></span></div><div class="grid2"><div class="stat"><strong>R$${saved}</strong><span>guardados</span></div><div class="stat"><strong>${pct}%</strong><span>da meta R$2.000</span></div></div></section>
<h3 style="margin:20px 0 10px">Seus passos</h3><div class="stack">${state.missions.map(renderMission).join("")}</div>${done===total?advanceBox():""}`)}
function nextStepTitle(){let m=state.missions.find(x=>!x.done);return m?m.title:"Essencial concluído"}
function completedCount(){return state.missions.filter(m=>m.done).length}
function advanceBox(){return `<section class="card stack" style="margin-top:14px;border-color:rgba(34,197,94,.35)"><p class="tag">Modo Avanço</p><h3>Você concluiu o essencial.</h3><p class="muted">Pode avançar mais ou encerrar o dia com constância.</p><button class="primary" onclick="addExtra()">Adicionar missão extra</button></section>`}
window.addExtra=()=>{let extras=missionLibrary.extra.filter(e=>!state.missions.some(m=>m.id===e.id));if(!extras.length)return toast("Sem missões extras disponíveis agora.");state.missions.push({...extras[0],done:false,text:"",quizAnswers:{},saved:false,optional:true});state.extraAdded=true;save();render()}

function renderMission(m){return`<article class="card stack"><div class="mission-head"><div><p class="tag">${m.type} · ${m.minutes} min · ${"★".repeat(m.stars)} ${m.optional?"· Extra":""}</p><h3>${m.title}</h3><div class="reason">Por quê: ${m.why}</div></div><button class="check ${m.done?'done':''}" onclick="toggleMission('${m.id}')">${m.done?'Desmarcar':'Marcar'}</button></div>${m.help?`<div class="reason"><strong>O que escrever:</strong><br>${m.help}</div><textarea id="text-${m.id}" placeholder="Escreva aqui...">${m.text||""}</textarea><button class="secondary" onclick="saveText('${m.id}')">Guardar resposta</button>${m.saved?`<span class="saved">✅ Resposta guardada</span>`:""}`:""}${m.quiz?renderQuiz(m):""}</article>`}
function renderQuiz(m){return`<div class="stack">${m.quiz.map((q,i)=>`<div><label>${q[0]}</label>${q[1].map((op,j)=>`<button class="option ${m.quizAnswers[i]===j?'active':''}" onclick="quiz('${m.id}',${i},${j})">${op}</button>`).join("")}</div>`).join("")}</div>`}
window.saveText=(id)=>{let m=state.missions.find(x=>x.id===id);let el=document.getElementById("text-"+id);m.text=el.value.trim();if(!m.text)return toast("Escreva algo antes de guardar.");m.saved=true;save();render()}
window.quiz=(id,i,j)=>{let m=state.missions.find(x=>x.id===id);m.quizAnswers[i]=j;save();render()}
function missionReady(m){if(m.help&&!m.saved)return false;if(m.quiz&&m.quiz.some((_,i)=>m.quizAnswers[i]===undefined))return false;return true}
window.toggleMission=(id)=>{let m=state.missions.find(x=>x.id===id);if(!m)return;if(!m.done&&!missionReady(m))return toast("Complete e guarde a evidência antes de marcar.");m.done=!m.done;if(m.done){state.xp+=25;state.mentorConfidence=Math.min(95,state.mentorConfidence+4);state.evidence.unshift({text:m.evidence,userText:m.text||"",money:m.money||0,date:new Date().toISOString(),mission:m.title})}else{state.xp=Math.max(0,state.xp-25);state.mentorConfidence=Math.max(10,state.mentorConfidence-3)}save();render()}

function plan(){let current=state.plan?.chapter;return shell(`<button class="small" onclick="go('home')">← Voltar</button><div class="top" style="margin-top:14px"><div><p class="muted">Plano</p><h2>${state.plan?.title}</h2></div></div><section class="card stack"><p class="tag">Etapa atual</p><h2>${current}</h2><p class="muted">${state.plan?.target}</p></section><section class="card stack" style="margin-top:14px"><h3>Caminho completo</h3>${state.plan?.chapters.map((c,i)=>`<div class="step ${i===0?'active':''}"><div class="dot"></div><div><strong>${c}</strong><p class="muted">${i===0?'Agora':'Depois'}</p></div></div>`).join("")}</section><section class="card stack" style="margin-top:14px"><h3>Preparado para avançar</h3><p class="muted">${completedCount()>=state.missions.length?"Sim. Você concluiu os passos essenciais.":"Ainda não. Complete os passos e gere evidências."}</p></section>`)}
function evidence(){return shell(`<button class="small" onclick="go('home')">← Voltar</button><div class="top" style="margin-top:14px"><div><p class="muted">Evidência</p><h2>Seu progresso real</h2></div></div><section class="card stack">${state.evidence.length?state.evidence.map(e=>`<p class="muted">✔ ${e.text}${e.userText?`<br><small>${e.userText}</small>`:""}</p>`).join(""):"<p class='muted'>Ainda não há evidências.</p>"}</section>`)}
function profile(){let saved=calcSaved();return shell(`<button class="small" onclick="go('home')">← Voltar</button><div class="top" style="margin-top:14px"><div><p class="muted">Perfil Evolutivo</p><h2>${state.user?.name}</h2></div></div>
<section class="card stack"><p class="tag">Resumo</p><div class="grid2"><div class="stat"><strong>${state.xp}</strong><span>XP</span></div><div class="stat"><strong>${state.mentorConfidence}%</strong><span>confiança mentor</span></div><div class="stat"><strong>R$${saved}</strong><span>guardados</span></div><div class="stat"><strong>${completedCount()}</strong><span>passos concluídos</span></div></div></section>
<section class="card stack" style="margin-top:14px"><p class="tag">Por que você começou</p><p class="muted">${whyText()}</p><p class="tag">Etapa atual</p><p class="muted">${state.plan?.chapter||"Não definido"}</p><p class="tag">Ritmo</p><p class="muted">${state.answers.time||0} minutos por dia.</p></section>
<section class="card stack" style="margin-top:14px"><p class="tag">Timeline</p>${timeline()}</section>
<button class="danger" style="margin-top:14px" onclick="reset()">Reiniciar protótipo</button>`)}
function timeline(){let items=[`Começou o caminho: ${whyText()}`,`Plano criado: ${state.plan?.chapter||""}`,...state.evidence.slice(0,4).map(e=>e.text)];return items.map((x,i)=>`<div class="step ${i===0?'done':'active'}"><div class="dot"></div><div><strong>${x}</strong><p class="muted">${i===0?'Início':'Progresso'}</p></div></div>`).join("")}
function whyText(){return{house:"Comprar uma casa",family:"Ajudar minha família",peace:"Ter tranquilidade",job:"Sair de um trabalho ruim",future:"Construir futuro"}[state.answers.why]||"Não definido"}
function calcSaved(){return Number(state.answers.savings||0)+state.evidence.reduce((s,e)=>s+Number(e.money||0),0)}
window.reset=()=>{localStorage.removeItem(KEY);state=load();render()}
function toast(msg){let old=document.querySelector(".toast");if(old)old.remove();let t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.classList.add("show"),20);setTimeout(()=>{t.classList.remove("show");setTimeout(()=>t.remove(),250)},2600)}
function render(){document.getElementById("app").innerHTML=({welcome,diagnosis,planIntro,home,plan,evidence,profile}[state.route]||welcome)()}
window.go=go;render();
