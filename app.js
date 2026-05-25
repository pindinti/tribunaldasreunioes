import readInputs from './modules/inputs.js';
import computeMetrics from './modules/metrics.js';
import { evaluateCrimes } from './modules/crimes.js';
import selectPrimaryCrime from './modules/crimeEngine.js';
import determineVerdict from './modules/verdictEngine.js';
import selectBadge from './modules/badgeEngine.js';
import determineSentence from './modules/sentenceEngine.js';
import buildNarrative from './modules/narrativeEngine.js';
import renderResult from './modules/renderer.js';

const form = document.getElementById('meeting-form');
const resultCard = document.getElementById('result-card');
const durationBtns = document.querySelectorAll('.duration-btn');
const meetingTypeBtns = document.querySelectorAll('.meeting-type-btn');
const chipBtns = document.querySelectorAll('.chip');
const copyButton = document.getElementById('copy-button');
const resetButton = document.getElementById('reset-button');
let caseIndex = 1;

// Duration button handler
durationBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    durationBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('duration-value').value = btn.dataset.value;
  });
});

// Set default active state for duration
durationBtns[1].classList.add('active'); // 30 min default

// Meeting type button handler
meetingTypeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    meetingTypeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('meeting-type-value').value = btn.dataset.type;
  });
});

// Set default active state for meeting type
meetingTypeBtns[0].classList.add('active'); // Update default

// Chip button handler (multi-select)
chipBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.classList.toggle('active');
    updateTraitsValue();
  });
});

function updateTraitsValue() {
  const selectedTraits = Array.from(chipBtns)
    .filter(btn => btn.classList.contains('active'))
    .map(btn => btn.dataset.trait)
    .join(',');
  document.getElementById('traits-value').value = selectedTraits;
}

// Form submission handler
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const rawInput = readInputs(form);
  const metrics = computeMetrics(rawInput);
  const crimes = evaluateCrimes(rawInput, metrics);
  const primaryCrime = selectPrimaryCrime(crimes);
  const verdict = determineVerdict(primaryCrime, rawInput, metrics);
  const sentence = determineSentence(primaryCrime, verdict);
  const badge = selectBadge(primaryCrime, metrics, rawInput);
  const narrative = buildNarrative(primaryCrime, verdict, sentence, badge, metrics, rawInput);

  const payload = {
    caseNumber: `${caseIndex.toString().padStart(3, '0')}`,
    crime: primaryCrime?.name || 'Nenhum Crime Detectado',
    verdict,
    sentence,
    badge,
    metrics,
    narrative,
  };

  renderResult(payload);
  resultCard.classList.remove('hidden');
  caseIndex += 1;
});

// Copy button handler
copyButton.addEventListener('click', () => {
  const caseNumber = document.getElementById('case-number').textContent;
  const crime = document.getElementById('result-crime').textContent;
  const verdict = document.getElementById('result-verdict').textContent;
  const sentence = document.getElementById('result-sentence').textContent;
  const badge = document.getElementById('result-badge').textContent;
  const punchline = document.getElementById('narrative-punchline').textContent;

  const text = `${caseNumber}
Crime: ${crime}
Veredito: ${verdict}
Sentença: ${sentence}
Badge: ${badge}

${punchline}`;

  navigator.clipboard.writeText(text).then(() => {
    copyButton.textContent = '✅ Copiado!';
    setTimeout(() => {
      copyButton.textContent = '📋 Copiar veredicto';
    }, 2000);
  });
});

// Reset button handler
resetButton.addEventListener('click', () => {
  form.reset();
  resultCard.classList.add('hidden');
  durationBtns.forEach(btn => btn.classList.remove('active'));
  durationBtns[1].classList.add('active');
  meetingTypeBtns.forEach(btn => btn.classList.remove('active'));
  meetingTypeBtns[0].classList.add('active');
  chipBtns.forEach(btn => btn.classList.remove('active'));
  document.getElementById('duration-value').value = '30';
  document.getElementById('meeting-type-value').value = 'Update';
  document.getElementById('traits-value').value = '';
  copyButton.textContent = '📋 Copiar veredicto';
});
