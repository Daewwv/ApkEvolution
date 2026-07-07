
import { financeMissions } from "../content/financeMissions.js";

export function createTodayMissions(plan, diagnostic, existingMissions = []) {
  if (!diagnostic.available) return [];

  const persistent = existingMissions.filter(m => m.persistent && !m.done);
  const timeBudget = diagnostic.dailyTime || 30;
  let remaining = timeBudget - persistent.reduce((sum, m) => sum + m.minutes, 0);

  const primary = financeMissions.filter(m => m.competency === plan.focusCompetency);
  const support = financeMissions.filter(m => ["budget","discipline","saving"].includes(m.competency));
  const candidates = [...primary, ...support].filter((m,i,arr)=>arr.findIndex(x=>x.id===m.id)===i).filter(m => !existingMissions.some(old => old.id === m.id));

  const selected = [];
  for (const mission of candidates) {
    if (selected.length >= 3) break;
    if (mission.minutes <= remaining || selected.length === 0) {
      selected.push({ ...mission, done:false, userText:"", quizAnswers:{} });
      remaining -= mission.minutes;
    }
  }
  return [...persistent, ...selected];
}

export function toggleMission(missions, missionId) {
  return missions.map(m => m.id === missionId ? { ...m, done: !m.done } : m);
}

export function updateMissionText(missions, missionId, text) {
  return missions.map(m => m.id === missionId ? { ...m, userText: text } : m);
}

export function updateQuizAnswer(missions, missionId, index, answer) {
  return missions.map(m => {
    if (m.id !== missionId) return m;
    return { ...m, quizAnswers: { ...(m.quizAnswers || {}), [index]: Number(answer) } };
  });
}

export function missionReady(mission) {
  if (mission.requiresText && (!mission.userText || mission.userText.trim().length < 3)) return false;
  if (mission.quiz) {
    return mission.quiz.every((_,i)=> mission.quizAnswers && mission.quizAnswers[i] !== undefined);
  }
  return true;
}

export function allRequiredDone(missions) {
  return missions.filter(m => !m.optional).every(m => m.done);
}
