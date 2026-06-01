import { clamp, containsKeyword } from './utils.js';

const CRIMES = [
  {
    name: 'Assassinato por PowerPoint',
    severity: 3,
    trigger: (input, metrics) => input.durationMinutes >= 45 && input.decisionCount <= 1 && input.buzzwordCount >= 2,
    confidence: (input, metrics) => {
      const durationFactor = clamp((input.durationMinutes - 44) * 1.5, 0, 50);
      const decisionFactor = input.decisionCount <= 1 ? 30 : 0;
      const buzzwordFactor = input.buzzwordCount * 10;
      return clamp(Math.round((durationFactor + decisionFactor + buzzwordFactor) / 2), 0, 100);
    },
    example: 'Long meeting with slides and almost no action.',
  },
  {
    name: 'Abuso de Buzzwords',
    severity: 3,
    trigger: (input, metrics) => input.buzzwordCount >= 4 && metrics.BuzzwordToxicity >= 55,
    confidence: (input, metrics) => {
      const buzzwordFactor = clamp(input.buzzwordCount * 15, 0, 70);
      return clamp(Math.round((buzzwordFactor + metrics.BuzzwordToxicity) / 2), 0, 100);
    },
    example: 'Jargon-heavy meeting with toxic buzzword overload.',
  },
  {
    name: 'Convocação Executiva',
    severity: 3,
    trigger: (input, metrics) => containsKeyword(input.optionalNotes, 'escalate') || containsKeyword(input.optionalNotes, 'executive') || containsKeyword(input.optionalNotes, 'leadership') || containsKeyword(input.optionalNotes, 'boss'),
    confidence: (input) => {
      const keywordCount = ['escalate', 'executive', 'leadership', 'boss'].reduce((count, word) => count + (containsKeyword(input.optionalNotes, word) ? 1 : 0), 0);
      return clamp(50 + keywordCount * 15, 0, 100);
    },
    example: 'Notes mention escalating the issue to leadership.',
  },
  {
    name: 'Planejamento Excessivo de Primeiro Grau',
    severity: 3,
    trigger: (input) => input.durationMinutes >= 50 && input.decisionCount <= 2 && input.scheduleAnotherCount >= 1,
    confidence: (input) => {
      const durationFactor = clamp((input.durationMinutes - 49) * 1.2, 0, 40);
      const decisionFactor = (2 - input.decisionCount) * 15;
      const followUpFactor = input.scheduleAnotherCount * 15;
      return clamp(durationFactor + decisionFactor + followUpFactor, 0, 100);
    },
    example: 'Long meeting that plans more meetings instead of decisions.',
  },
  {
    name: 'Negligência de Objetivo',
    severity: 3,
    trigger: (input) => input.decisionCount === 0 && input.optionalNotes.length < 20,
    confidence: (input) => {
      const clarityPenalty = input.optionalNotes.length < 30 ? 30 - input.optionalNotes.length : 0;
      return clamp(60 + clarityPenalty, 0, 100);
    },
    example: 'Discussion with no decisions and almost no notes.',
  },
  {
    name: 'Evasão de Decisão',
    severity: 3,
    trigger: (input) => input.decisionCount <= 1 && input.circleBackCount >= 1,
    confidence: (input) => {
      return clamp(40 + input.circleBackCount * 20 - input.decisionCount * 10, 0, 100);
    },
    example: 'Few decisions and at least one circle-back phrase.',
  },
  {
    name: 'Reunião que Deveria Ser um Email',
    severity: 2,
    trigger: (input, metrics) => input.durationMinutes >= 40 && input.decisionCount <= 2 && metrics.EmailPotential >= 55,
    confidence: (input, metrics) => {
      const durationFactor = clamp((input.durationMinutes - 40) * 2.5, 0, 50);
      const decisionFactor = (2 - input.decisionCount) * 20;
      return clamp(Math.round((durationFactor + decisionFactor + metrics.EmailPotential) / 2), 0, 100);
    },
    example: 'A meeting that should have been handled by email instead.',
  },
  {
    name: 'Agendamento Serial de Follow-ups',
    severity: 2,
    trigger: (input) => input.takeOfflineCount + input.scheduleAnotherCount >= 2,
    confidence: (input) => clamp((input.takeOfflineCount + input.scheduleAnotherCount) * 25 + input.circleBackCount * 5, 0, 100),
    example: 'Multiple deflection phrases and follow-up meetings queued up.',
  },
  {
    name: 'Inflação de Reuniões',
    severity: 2,
    trigger: (input, metrics) => metrics.MeetingInflationRate >= 60 && input.durationMinutes >= 30,
    confidence: (_, metrics) => metrics.MeetingInflationRate,
    example: 'Long meeting that expanded without clear purpose.',
  },
  {
    name: 'Uso Imprudente de Sinergia',
    severity: 2,
    trigger: (input) => input.buzzwordCount >= 3 && containsKeyword(input.optionalNotes, 'synergy'),
    confidence: (input) => {
      const buzzwordFactor = clamp(input.buzzwordCount * 12, 0, 70);
      const keywordFactor = containsKeyword(input.optionalNotes, 'synergy') ? 30 : 0;
      return clamp(buzzwordFactor + keywordFactor, 0, 100);
    },
    example: 'Jargon-heavy meeting with explicit synergy language.',
  },
];

export function evaluateCrimes(input, metrics) {
  return CRIMES.map((crime) => {
    const triggered = crime.trigger(input, metrics);
    const confidence = triggered ? crime.confidence(input, metrics) : 0;
    return {
      ...crime,
      triggered,
      confidence,
    };
  });
}
