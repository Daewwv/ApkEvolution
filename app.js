const DB_KEY = "progresslife_v02";
const initial = {
  user: { name: "Marlon", objective: "Liberdade financeira", target: "Guardar R$ 2.000 em 12 meses" },
  xp: 245,
  level: 3,
  route: "home",
  phase: { name: "Controle Financeiro", progress: 12, reviewIn: 5 },
  evidence: { saved: 40, studyMinutes: 55, completed: 7, streak: 3 },
  missions: [
    { id: 1, type: "principal", icon: "💰", title: "Separar R$10 hoje", time: "5 min", xp: 50, done: false, why: "Porque criar o hábito de guardar dinheiro é o primeiro tijolo do seu fundo de emergência." },
    { id: 2, type: "aprendizado", icon: "📚", title: "Aprender sobre orçamento pessoal", time: "15 min", xp: 35, done: false, why: "Porque você não controla o que não mede. Orçamento é a base da liberdade financeira." },
    { id: 3, type: "execução", icon: "🧾", title: "Registrar seus gastos de hoje", time: "10 min", xp: 30, done: false, why: "Porque seus vazamentos financeiros aparecem quando você registra tudo sem mentir para si mesmo." },
    { id: 4, type: "impacto", icon: "⚡", title: "Ganhar R$10 extra", time: "Opcional", xp: 80, done: false, impact: true, why: "Porque aumentar renda acelera o plano. Pode ser vendendo algo, fazendo uma entrega ou oferecendo um serviço simples." }
  ]
};
let state = JSON.parse(localStorage.getItem(DB_KEY) || "null") || initial;
let timer = { seconds: 25 * 60, id: null, running: false };

function save(){ localStorage.setItem(DB_KEY, JSON.stringify(state)); }
function $(s){ return document.querySelector(s); }
function nav(route){ state.route = route; save(); render(); window.scrollTo(0,0); }
function doneCount(){ return state.missions.filter(m=>m.done).length; }
function formatMoney(n){ return `R$ ${n}`; }

function complete(id){
  const m = state.missions.find(x=>x.id===id);
  if(!m) return;
  m.done = !m.done;
  state.xp += m.done ? m.xp : -m.xp;
  if(m.done && m.id === 1) state.evidence.saved += 10;
  if(!m.done && m.id === 1) state.evidence.saved = Math.max(0, state.evidence.saved - 10);
  state.evidence.completed = state.missions.filter(x=>x.done).length + 7;
  if(state.xp >= state.level * 150) state.level += 1;
  save(); render();
}

function mission(m){
  return `<article class="mission ${m.done?'done':''} ${m.impact?'impact':''}" onclick="complete(${m.id})">
    <div class="mission-head">
      <div class="icon">${m.icon}</div>
      <div>
        <h4>${m.title}</h4>
        <p>${m.type.toUpperCase()} · ${m.time} · +${m.xp} XP</p>
      </div>
    </div>
    <p class="why"><b>Por quê?</b> ${m.why}</p>
    <div class="mission-foot">
      <span class="pill">${m.done ? "Concluída" : "Toque para concluir"}</span>
      <button class="check">${m.done ? "✓" : ""}</button>
    </div>
  </article>`;
}

function layout(content){
  return `<main class="app">${content}</main>${bottomNav()}`;
}

function bottomNav(){
  const b=(r,t,l)=>`<button class="${state.route===r?'active':''}" onclick="nav('${r}')">${t}<br>${l}</button>`;
  return `<nav class="nav">${b('home','◉','Hoje')}${b('plan','◇','Plano')}${b('evidence','▦','Evidência')}${b('mentor','☻','Mentor')}</nav>`;
}

function home(){
  const p = Math.min(100, Math.round((doneCount()/state.missions.length)*100));
  return layout(`
    <section class="screen active">
      <header class="top">
        <div class="hello"><small>Hoje · Plano de 15 dias</small><h1>Boa noite,<br>${state.user.name}</h1></div>
        <div class="avatar">PL</div>
      </header>

      <section class="hero-card">
        <div class="row"><span class="level">Nível ${state.level}</span><span class="muted">${state.xp} XP</span></div>
        <h2>${state.user.objective}</h2>
        <p class="muted">${state.user.target}</p>
        <div class="progress-wrap">
          <div class="progress-meta"><span>Fase: ${state.phase.name}</span><b>${state.phase.progress}%</b></div>
          <div class="bar"><span style="width:${state.phase.progress}%"></span></div>
        </div>
        <div class="mentor"><strong>Mentor IA</strong><span class="muted">Revisarei seu plano em ${state.phase.reviewIn} dias. Até lá, execute. Sem conversa vazia.</span></div>
      </section>

      <div class="section-title"><h3>Missões de hoje</h3><span>${doneCount()}/${state.missions.length} concluídas</span></div>
      ${state.missions.map(mission).join("")}

      <button class="primary" onclick="nav('timer')">Iniciar sessão de foco</button>
      <button class="secondary" onclick="nav('review')">Fechamento do dia</button>
    </section>
  `);
}

function plan(){
  return layout(`
    <section class="screen active">
      <p class="eyebrow">Plano mestre</p>
      <h1>Seu caminho atual</h1>
      <p class="muted">A IA desenha o caminho. A app acompanha sua execução diária.</p>
      ${[
        ["1","Controle Financeiro","Registrar gastos, criar orçamento e separar pequenas quantias."],
        ["2","Fundo de Emergência","Transformar economia diária em reserva real."],
        ["3","Aumento de Renda","Testar ações simples para gerar dinheiro extra."],
        ["4","Primeiros Investimentos","Aprender e aplicar com segurança."]
      ].map((x,i)=>`<article class="mission ${i===0?'done':''}"><div class="mission-head"><div class="icon">${x[0]}</div><div><h4>${x[1]}</h4><p>${x[2]}</p></div></div></article>`).join("")}
    </section>
  `);
}

function evidence(){
  return layout(`
    <section class="screen active">
      <p class="eyebrow">Regra da Verdade</p>
      <h1>Evidência, não motivação vazia</h1>
      <div class="grid">
        <div class="stat"><strong>${formatMoney(state.evidence.saved)}</strong><span class="muted">guardados</span></div>
        <div class="stat"><strong>${state.evidence.studyMinutes}m</strong><span class="muted">estudados</span></div>
        <div class="stat"><strong>${state.evidence.completed}</strong><span class="muted">missões</span></div>
        <div class="stat"><strong>${state.evidence.streak}</strong><span class="muted">dias ativos</span></div>
      </div>
      <article class="mission impact"><div class="mission-head"><div class="icon">⚠️</div><div><h4>Diagnóstico honesto</h4><p>Se você executar menos de 60% do plano, não está no ritmo necessário para alcançar o objetivo. A app vai reduzir dificuldade ou exigir mais responsabilidade.</p></div></div></article>
    </section>
  `);
}

function mentor(){
  return layout(`
    <section class="screen active">
      <p class="eyebrow">Mentor</p>
      <h1>IA econômica e estratégica</h1>
      <article class="hero-card"><h2>Próxima revisão</h2><p class="muted">Em ${state.phase.reviewIn} dias a IA analisará seus dados e ajustará o plano. Fora disso, ProgressLife funciona sem gastar IA.</p></article>
      <article class="mission"><div class="mission-head"><div class="icon">🧠</div><div><h4>Como o mentor pensa</h4><p>Ele olha para execução, economia, estudo, constância e bloqueios. Depois decide se mantém, reduz ou aumenta o plano.</p></div></div></article>
      <button class="danger" onclick="resetApp()">Reiniciar protótipo</button>
    </section>
  `);
}

function timerScreen(){
  return layout(`
    <section class="screen active">
      <p class="eyebrow">Sessão de foco</p>
      <h1>Faça uma coisa agora</h1>
      <article class="hero-card">
        <h2>Registrar gastos</h2>
        <p class="muted">25 minutos sem distração.</p>
        <div class="timer" id="timer">${fmt(timer.seconds)}</div>
        <button class="primary" onclick="startTimer()">Iniciar</button>
        <button class="secondary" onclick="pauseTimer()">Pausar</button>
        <button class="secondary" onclick="finishFocus()">Finalizar e ganhar XP</button>
      </article>
    </section>
  `);
}

function review(){
  return layout(`
    <section class="screen active">
      <p class="eyebrow">Fechamento</p>
      <h1>Como foi o dia?</h1>
      <article class="mission"><div class="mission-head"><div class="icon">✓</div><div><h4>${doneCount()} de ${state.missions.length} missões</h4><p>${doneCount()<2?'Hoje você executou pouco. Sem drama, mas também sem autoengano. Amanhã precisa corrigir.':'Bom avanço. Continue acumulando evidência.'}</p></div></div></article>
      <textarea placeholder="Qual foi o principal obstáculo de hoje?"></textarea>
      <button class="primary" onclick="nav('evidence')">Salvar fechamento</button>
    </section>
  `);
}

function fmt(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function startTimer(){ if(timer.running)return; timer.running=true; timer.id=setInterval(()=>{timer.seconds--; const e=$('#timer'); if(e)e.textContent=fmt(timer.seconds); if(timer.seconds<=0)pauseTimer();},1000);}
function pauseTimer(){timer.running=false; clearInterval(timer.id);}
function finishFocus(){pauseTimer(); timer.seconds=25*60; state.xp+=25; save(); nav('home');}
function resetApp(){localStorage.removeItem(DB_KEY); state=initial; nav('home');}

function render(){
  const routes = {home, plan, evidence, mentor, timer:timerScreen, review};
  document.getElementById("app").innerHTML = (routes[state.route] || home)();
}
render();

if("serviceWorker" in navigator){ navigator.serviceWorker.register("./service-worker.js").catch(()=>{}); }
