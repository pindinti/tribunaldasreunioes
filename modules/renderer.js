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

  // UX: tornar o identificador mais memorável e alinhado com tom corporativo
  caseNumber.textContent = `Autos da Reunião Improdutiva #${payload.caseNumber}`;
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

export function createExportCard(payload) {
  const wrapper = document.createElement('section');
  wrapper.className = 'card export-card';
  wrapper.style.width = '1600px';
  wrapper.style.height = '900px';

  // Export version: vertical reading order to prioritize veredito
  wrapper.innerHTML = `
    <div class="result-header">
      <div>
        <h2 class="result-title">⚖️ Tribunal das Reuniões</h2>
        <span class="case-number">Autos da Reunião Improdutiva #${payload.caseNumber}</span>
      </div>
      <span class="badge">${payload.badge}</span>
    </div>

    <div class="crime-section">
      <p class="section-label">Crime</p>
      <h3>${payload.crime}</h3>
    </div>

    <div class="verdict-hero">
      <p class="section-label">Veredito</p>
      <p class="verdict-text">${payload.verdict}</p>
    </div>

    <div class="sentence-section">
      <p class="section-label">Sentença</p>
      <p class="sentence-text">${payload.sentence}</p>
    </div>

    <div class="metrics-grid">
      <div class="metric-item">
        <span class="metric-title">Chance de conversa paralela no whats</span>
        <span class="metric-value">${payload.metrics.InstagramProbability}%</span>
        <span class="metric-subtext">Alguém já digitou "estão vendo isso também?" no grupo sem o chefe.</span>
      </div>
      <div class="metric-item">
        <span class="metric-title">Chance de virar e-mail</span>
        <span class="metric-value">${payload.metrics.EmailPotential}%</span>
        <span class="metric-subtext">Essa reunião já nasceu no inbox.</span>
      </div>
      <div class="metric-item">
        <span class="metric-title">Chance de fingir que entendeu</span>
        <span class="metric-value">${payload.metrics.BuzzwordToxicity}%</span>
        <span class="metric-subtext">Jargão alto, foco baixo.</span>
      </div>
      <div class="metric-item">
        <span class="metric-title">Chance de metade não precisar estar aqui</span>
        <span class="metric-value">${payload.metrics.CollectiveSufferingIndex}%</span>
        <span class="metric-subtext">Metade da sala podia estar no café.</span>
      </div>
    </div>

    <div class="narrative-block">
      <p class="narrative-line">${payload.narrative.accusation}</p>
      <p class="narrative-line">${payload.narrative.evidence}</p>
      <p class="narrative-line narrative-punchline">${payload.narrative.punchline}</p>
    </div>
  `;

  return wrapper;
}
