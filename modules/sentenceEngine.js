const SENTENCES = {
  'Assassinato por PowerPoint': 'Nenhuma apresentação sem script claro na próxima reunião.',
  'Abuso de Buzzwords': 'Este time deve desintoxicar do jargão por uma sessão.',
  'Agendamento Serial de Follow-ups': 'Evite agendar reuniões adicionais esta semana.',
  'Homicídio por Apresentação': 'Apresentações são proibidas na próxima sessão.',
  'Uso Imprudente de Sinergia': 'Escreva um pequeno glossário de termos exagerados.',
  'Planejamento Excessivo de Primeiro Grau': 'Apenas uma decisão na próxima reunião.',
  'Negligência de Objetivo': 'Declare o objetivo claramente antes do próximo convite.',
  'Evasão de Decisão': 'Apresente uma decisão concreta antes da próxima reunião.',
  'Inflação de Reuniões': 'Faça um resumo de uma frase em vez de outro update.',
  'Convocação Executiva': 'Escalem este caso para revisão da liderança.',
  'Reunião que Deveria Ser um Email': 'Nenhuma reunião sem agenda real.',
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
