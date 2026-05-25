export default function renderResult(payload) {
  const caseNumber = document.getElementById('case-number');
  const badge = document.getElementById('result-badge');
  const crime = document.getElementById('result-crime');
  const verdict = document.getElementById('result-verdict');
  const sentence = document.getElementById('result-sentence');
  const metricInstagram = document.getElementById('metric-instagram');
  const metricEmail = document.getElementById('metric-email');
  const metricBuzzword = document.getElementById('metric-buzzword');
  const metricSuffering = document.getElementById('metric-suffering');
  const accusation = document.getElementById('narrative-accusation');
  const evidence = document.getElementById('narrative-evidence');
  const punchline = document.getElementById('narrative-punchline');

  caseNumber.textContent = `Caso #${payload.caseNumber}`;
  badge.textContent = payload.badge;
  crime.textContent = payload.crime;
  verdict.textContent = payload.verdict;
  sentence.textContent = payload.sentence;
  metricInstagram.textContent = `${payload.metrics.InstagramProbability}%`;
  metricEmail.textContent = `${payload.metrics.EmailPotential}%`;
  metricBuzzword.textContent = `${payload.metrics.BuzzwordToxicity}%`;
  metricSuffering.textContent = `${payload.metrics.CollectiveSufferingIndex}%`;
  accusation.textContent = payload.narrative.accusation;
  evidence.textContent = payload.narrative.evidence;
  punchline.textContent = payload.narrative.punchline;
}
