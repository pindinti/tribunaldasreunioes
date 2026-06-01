const SENTENCES = {
  'Assassinato por PowerPoint': 'Sem slide sem alma na próxima reunião.',
  'Abuso de Buzzwords': 'Hora da desintoxicação de jargão.',
  'Agendamento Serial de Follow-ups': 'Pare de empurrar reunião para cima de reunião.',
  'Homicídio por Apresentação': 'Proibido usar slides como substituto de conteúdo.',
  'Uso Imprudente de Sinergia': 'Faça um mini glossário de buzzwords para sobreviver.',
  'Planejamento Excessivo de Primeiro Grau': 'Uma decisão só na próxima, por favor.',
  'Negligência de Objetivo': 'Defina objetivo claro antes do próximo convite.',
  'Evasão de Decisão': 'Traga uma decisão concreta na próxima vez.',
  'Inflação de Reuniões': 'Resumo de uma frase ganha o dia.',
  'Convocação Executiva': 'Escalado para revisão da liderança com todo mundo olhando.',
  'Reunião que Deveria Ser um Email': 'Essa deveria ter virado só uma mensagem mesmo.',
};

export default function determineSentence(primaryCrime, verdict) {
  if (!primaryCrime) {
    return 'Sem sentença, o tribunal não encontrou crime.';
  }

  if (verdict === 'Caso Arquivado') {
    return 'Sem sentença, o tribunal não encontrou crime.';
  }

  return SENTENCES[primaryCrime.name] || 'O tribunal profere uma penalidade moderada.';
}
