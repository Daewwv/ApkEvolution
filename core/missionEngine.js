
import {financeMissions,skillMissions} from '../content/financeMissions.js';
export function createTodayMissions(plan,d,existing=[]){const persistent=existing.filter(m=>m.persistent&&!m.done);const lib=d.goal==='learn_skill'?skillMissions:financeMissions;const time=d.dailyTime||30;let remaining=time-persistent.reduce((s,m)=>s+m.minutes,0);const candidates=lib.filter(m=>m.competency===plan.focusCompetency||m.competency==='discipline'||d.goal==='learn_skill').filter(m=>!existing.some(o=>o.id===m.id));const selected=[];for(const m of candidates){if(selected.length>=3)break;if(m.minutes<=remaining||selected.length===0){selected.push({...m,done:false,userText:''});remaining-=m.minutes;}}return[...persistent,...selected];}
export function toggleMission(missions,id){return missions.map(m=>m.id===id?{...m,done:!m.done}:m)}
export function updateMissionText(missions,id,text){return missions.map(m=>m.id===id?{...m,userText:text}:m)}
export function allRequiredDone(missions){return missions.filter(m=>!m.optional).every(m=>m.done)}
