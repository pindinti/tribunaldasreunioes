import { clamp } from './utils.js';

function computeEmailPotential(input) {
  const { durationMinutes, decisionCount, participantCount, scheduleAnotherCount, takeOfflineCount } = input;
  const raw = durationMinutes * 2 - decisionCount * 15 - participantCount * 1.5 + scheduleAnotherCount * 10 + takeOfflineCount * 8;
  return clamp(Math.round(raw), 0, 100);
}

function computeCollectiveSufferingIndex(input) {
  const { durationMinutes, participantCount, circleBackCount, takeOfflineCount, decisionCount } = input;
  const raw = durationMinutes * 1.2 + participantCount * 2 + circleBackCount * 10 + takeOfflineCount * 5 - decisionCount * 8;
  return clamp(Math.round(raw), 0, 100);
}

function computeBuzzwordToxicity(input) {
  const { buzzwordCount, scheduleAnotherCount, circleBackCount, decisionCount } = input;
  const raw = buzzwordCount * 12 + scheduleAnotherCount * 2 + circleBackCount * 2 - decisionCount * 3;
  return clamp(Math.round(raw), 0, 100);
}

function computeObjectiveClarityScore(input) {
  const { decisionCount, optionalNotes, buzzwordCount, scheduleAnotherCount } = input;
  const notesBonus = optionalNotes.length >= 20 ? 10 : 0;
  const raw = decisionCount * 18 + notesBonus - buzzwordCount * 4 - scheduleAnotherCount * 5;
  return clamp(Math.round(raw), 0, 100);
}

function computeMeetingInflationRate(input) {
  const { durationMinutes, decisionCount, buzzwordCount, participantCount } = input;
  const raw = (durationMinutes - decisionCount * 10) * 1.3 + buzzwordCount * 3 + participantCount * 1;
  return clamp(Math.round(raw), 0, 100);
}

function computeInstagramProbability(metrics) {
  const { EmailPotential, BuzzwordToxicity, CollectiveSufferingIndex, MeetingInflationRate } = metrics;
  const raw = EmailPotential * 0.35 + BuzzwordToxicity * 0.25 + CollectiveSufferingIndex * 0.25 + MeetingInflationRate * 0.15;
  return clamp(Math.round(raw), 0, 100);
}

export default function computeMetrics(input) {
  const EmailPotential = computeEmailPotential(input);
  const CollectiveSufferingIndex = computeCollectiveSufferingIndex(input);
  const BuzzwordToxicity = computeBuzzwordToxicity(input);
  const ObjectiveClarityScore = computeObjectiveClarityScore(input);
  const MeetingInflationRate = computeMeetingInflationRate(input);
  const InstagramProbability = computeInstagramProbability({ EmailPotential, BuzzwordToxicity, CollectiveSufferingIndex, MeetingInflationRate });

  return {
    EmailPotential,
    CollectiveSufferingIndex,
    BuzzwordToxicity,
    ObjectiveClarityScore,
    MeetingInflationRate,
    InstagramProbability,
  };
}
