import readInputs from './modules/inputs.js';
import computeMetrics from './modules/metrics.js';
import { evaluateCrimes } from './modules/crimes.js';
import selectPrimaryCrime from './modules/crimeEngine.js';
import determineVerdict from './modules/verdictEngine.js';
import selectBadge from './modules/badgeEngine.js';
import determineSentence from './modules/sentenceEngine.js';
import buildNarrative from './modules/narrativeEngine.js';
import renderResult, { createExportCard } from './modules/renderer.js';
import { nextFrame } from './modules/utils.js';

const form = document.getElementById('meeting-form');
const resultCard = document.getElementById('result-card');
const durationBtns = document.querySelectorAll('.duration-btn');
const meetingTypeBtns = document.querySelectorAll('.meeting-type-btn');
const chipBtns = document.querySelectorAll('.chip');
const shareButton = document.getElementById('share-button');
const downloadButton = document.getElementById('download-button');
const resetButton = document.getElementById('reset-button');
let caseIndex = 1;
let lastPayload = null;
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
const PAUTA_CERTA_URL = 'https://pautacerta.com.br';
const ctaCard = document.getElementById('cta-card');
const ctaLink = document.getElementById('cta-link');

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function() { window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

function trackEvent(eventName, params = {}) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, { ...params, send_to: GA_MEASUREMENT_ID });
}

ctaLink.href = PAUTA_CERTA_URL;
ctaLink.addEventListener('click', () => {
  trackEvent('cta_clicked');
});

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
  lastPayload = payload;
  resultCard.classList.remove('hidden');
  ctaCard.classList.remove('hidden');
  trackEvent('analysis_completed');
  caseIndex += 1;
});

// Share button handler
shareButton.addEventListener('click', async () => {
  trackEvent('share_clicked');
  const caseNumber = document.getElementById('case-number').textContent;
  const crime = document.getElementById('result-crime').textContent;
  const verdict = document.getElementById('result-verdict').textContent;
  const sentence = document.getElementById('result-sentence').textContent;
  const badge = document.getElementById('result-badge').textContent;
  const punchline = document.getElementById('narrative-punchline').textContent;

  const text = `Tribunal das Reuniões\n${caseNumber}\nCrime: ${crime}\nVeredito: ${verdict}\nSentença: ${sentence}\nBadge: ${badge}\n\n${punchline}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Tribunal das Reuniões',
        text,
      });
      shareButton.textContent = '✅ Compartilhado!';
      setTimeout(() => {
        shareButton.textContent = '🔗 Compartilhar julgamento';
      }, 2000);
      return;
    } catch (error) {
      const cancelMessage = /abort|cancel|denied/i.test(error?.name || error?.message || '');
      if (cancelMessage) {
        shareButton.textContent = '🔗 Compartilhamento cancelado';
        setTimeout(() => {
          shareButton.textContent = '🔗 Compartilhar julgamento';
        }, 2500);
        return;
      }
      // segue para fallback clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    shareButton.textContent = '✅ Copiado para área de transferência';
  } catch (error) {
    shareButton.textContent = '⚠️ Não foi possível compartilhar';
  }

  setTimeout(() => {
    shareButton.textContent = '🔗 Compartilhar julgamento';
  }, 2500);
});

// Download button handler — export card as PNG 16:9
downloadButton.addEventListener('click', async () => {
  if (!lastPayload) {
    downloadButton.textContent = '⚠️ Gere um veredicto primeiro';
    setTimeout(() => { downloadButton.textContent = '⬇️ Baixar card do julgamento'; }, 2500);
    return;
  }

  const filename = `tribunal-das-reunioes-caso-${lastPayload.caseNumber.padStart(3, '0')}.png`;
  const exportWrapper = document.createElement('div');
  exportWrapper.id = 'export-card-wrapper';
  exportWrapper.style.position = 'absolute';
  exportWrapper.style.left = '-9999px';
  exportWrapper.style.top = '0';
  exportWrapper.style.width = '1600px';
  exportWrapper.style.height = '900px';
  exportWrapper.style.overflow = 'hidden';
  exportWrapper.style.opacity = '0';
  exportWrapper.style.pointerEvents = 'none';

  const exportCard = createExportCard(lastPayload);
  exportWrapper.appendChild(exportCard);
  document.body.appendChild(exportWrapper);

  await nextFrame();
  await nextFrame();

  try {
    const htmlToImage = await import('https://unpkg.com/html-to-image?module');
    const dataUrl = await htmlToImage.toPng(exportCard, {
      width: 1600,
      height: 900,
      style: {
        transform: 'scale(1)',
      },
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    trackEvent('download_png');
    downloadButton.textContent = '✅ Baixado!';
  } catch (err) {
    console.error(err);
    try {
      const caseNumber = lastPayload.caseNumber;
      const crime = lastPayload.crime;
      const verdict = lastPayload.verdict;
      const sentence = lastPayload.sentence;
      const badge = lastPayload.badge;
      const punchline = lastPayload.narrative.punchline;
      const text = `Tribunal das Reuniões\nCaso #${caseNumber}\nCrime: ${crime}\nVeredito: ${verdict}\nSentença: ${sentence}\nBadge: ${badge}\n\n${punchline}`;
      await navigator.clipboard.writeText(text);
      downloadButton.textContent = '✅ Copiado (fallback)';
    } catch (err2) {
      console.error(err2);
      downloadButton.textContent = '⚠️ Falha ao exportar';
    }
  } finally {
    if (exportWrapper.parentNode) {
      exportWrapper.parentNode.removeChild(exportWrapper);
    }
    setTimeout(() => { downloadButton.textContent = '⬇️ Baixar card do julgamento'; }, 2500);
  }
});

// Reset button handler
resetButton.addEventListener('click', () => {
  form.reset();
  resultCard.classList.add('hidden');
  ctaCard.classList.add('hidden');
  durationBtns.forEach(btn => btn.classList.remove('active'));
  durationBtns[1].classList.add('active');
  meetingTypeBtns.forEach(btn => btn.classList.remove('active'));
  meetingTypeBtns[0].classList.add('active');
  chipBtns.forEach(btn => btn.classList.remove('active'));
  document.getElementById('duration-value').value = '30';
  document.getElementById('meeting-type-value').value = 'Update';
  document.getElementById('traits-value').value = '';
  downloadButton.textContent = '⬇️ Baixar card do julgamento';
  shareButton.textContent = '🔗 Compartilhar julgamento';
});
