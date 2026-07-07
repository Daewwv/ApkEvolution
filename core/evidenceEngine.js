
export function createEvidenceFromMission(mission) {
  const base = {
    id:"ev_"+Date.now(),
    missionId:mission.id,
    createdAt:new Date().toISOString(),
    type:mission.evidenceType || "completion",
    text:mission.evidenceText || `Concluiu: ${mission.title}`,
    userText:mission.userText || "",
    competency:mission.competency
  };
  if (mission.moneyAmount) base.moneyAmount = mission.moneyAmount;
  if (mission.quiz) {
    base.quizScore = mission.quiz.reduce((s,q,i)=>s + (Number(mission.quizAnswers?.[i]) === q.correct ? 1 : 0), 0);
    base.quizTotal = mission.quiz.length;
  }
  return base;
}

export function calculateIndicators(evidence, diagnostic) {
  const saved = evidence.reduce((sum, ev) => sum + Number(ev.moneyAmount || 0), Number(diagnostic?.savings || 0));
  const explanations = evidence.filter(ev => ev.userText && ev.userText.length > 0).length;
  return {saved, explanations, targetSavings:2000, savingsProgress:Math.min(100, Math.round((saved/2000)*100))};
}
