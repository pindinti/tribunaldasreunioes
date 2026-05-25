import { clamp, normalizeText } from './utils.js';

const MEETING_TYPE_PARTICIPANTS = {
  'Update': 8,
  'Decisão': 4,
  'Brainstorm': 6,
  'Apresentação': 10,
  'Alinhamento': 5,
};

const DEFAULTS = {
  meetingTitle: '',
  durationMinutes: 30,
  participantCount: 5,
  decisionCount: 0,
  buzzwordCount: 0,
  takeOfflineCount: 0,
  scheduleAnotherCount: 0,
  circleBackCount: 0,
  optionalNotes: '',
};

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function deriveValuesFromTraits(traits) {
  const values = {
    decisionCount: 1, // Default: 1 decision
    buzzwordCount: 0,
    takeOfflineCount: 0,
    scheduleAnotherCount: 0,
    circleBackCount: 0,
    optionalNotes: '',
  };

  const traitList = traits.split(',').filter(t => t.trim());

  if (traitList.includes('buzzwords')) {
    values.buzzwordCount += 5;
  }

  if (traitList.includes('followups')) {
    values.scheduleAnotherCount = 2;
    values.takeOfflineCount = 1;
  }

  if (traitList.includes('email')) {
    values.decisionCount = 0;
  }

  if (traitList.includes('circleback')) {
    values.circleBackCount = 2;
  }

  if (traitList.includes('slides')) {
    values.buzzwordCount += 2;
  }

  if (traitList.includes('boss')) {
    values.optionalNotes = 'escalate leadership executive';
  }

  return values;
}

function readInputs(form) {
  const data = new FormData(form);

  const meetingTitle = normalizeText(data.get('meetingTitle') || DEFAULTS.meetingTitle).slice(0, 120);
  const durationMinutes = clamp(parseInteger(data.get('durationMinutes'), DEFAULTS.durationMinutes), 0, 480);
  const meetingType = data.get('meetingType') || 'Update';
  const participantCount = MEETING_TYPE_PARTICIPANTS[meetingType] || DEFAULTS.participantCount;
  const traits = data.get('traits') || '';

  const derived = deriveValuesFromTraits(traits);

  const input = {
    meetingTitle,
    durationMinutes,
    participantCount,
    decisionCount: derived.decisionCount,
    buzzwordCount: derived.buzzwordCount,
    takeOfflineCount: derived.takeOfflineCount,
    scheduleAnotherCount: derived.scheduleAnotherCount,
    circleBackCount: derived.circleBackCount,
    optionalNotes: derived.optionalNotes,
  };

  return input;
}

export default readInputs;
