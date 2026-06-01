import { randomChoice } from './utils.js';
import {
  accusationTemplates,
  evidenceTemplates,
  verdictTemplates,
  sentenceTemplates,
  punchlineTemplates,
} from './templates.js';

function fillTemplate(template, data) {
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    return String(data[key] ?? '');
  });
}

export default function buildNarrative(primaryCrime, verdict, sentence, badge, metrics, input) {
  const data = {
    crime: primaryCrime?.name || 'No Crime Detected',
    duration: input.durationMinutes,
    participants: input.participantCount,
    decisions: input.decisionCount,
    buzzwordCount: input.buzzwordCount,
    takeOfflineCount: input.takeOfflineCount,
    scheduleAnotherCount: input.scheduleAnotherCount,
    circleBackCount: input.circleBackCount,
    EmailPotential: metrics.EmailPotential,
    BuzzwordToxicity: metrics.BuzzwordToxicity,
    CollectiveSufferingIndex: metrics.CollectiveSufferingIndex,
    ObjectiveClarityScore: metrics.ObjectiveClarityScore,
    MeetingInflationRate: metrics.MeetingInflationRate,
    InstagramProbability: metrics.InstagramProbability,
    verdict,
    sentence,
    badge,
  };

  return {
    accusation: fillTemplate(randomChoice(accusationTemplates), data),
    evidence: fillTemplate(randomChoice(evidenceTemplates), data),
    verdictLine: fillTemplate(randomChoice(verdictTemplates), data),
    sentenceLine: fillTemplate(randomChoice(sentenceTemplates), data),
    punchline: randomChoice(punchlineTemplates),
  };
}
