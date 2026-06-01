export default function selectBadge(primaryCrime, metrics, input) {
  if (primaryCrime?.name === 'Assassinato por PowerPoint') {
    return 'Campeão do PowerPoint sem alma';
  }

  if (primaryCrime?.name === 'Abuso de Buzzwords' || primaryCrime?.name === 'Uso Imprudente de Sinergia') {
    return 'Rei do “vamos alinhar”';
  }

  if (primaryCrime?.name === 'Reunião que Deveria Ser um Email' || primaryCrime?.name === 'Inflação de Reuniões') {
    return 'Serial de Reunião Desnecessária';
  }

  if (metrics.EmailPotential >= 70 && primaryCrime?.name !== 'Reunião que Deveria Ser um Email') {
    return 'Lenda do Follow-up oculto';
  }

  if (metrics.InstagramProbability >= 70) {
    return 'Criador de Memes de Reunião';
  }

  if (input.circleBackCount >= 1) {
    return 'Especialista em Circular em vez de decidir';
  }

  if (input.participantCount >= 6 && input.decisionCount <= 1) {
    return 'Sobrevivente do Expresso Corporativo';
  }

  if (primaryCrime?.name === 'Planejamento Excessivo de Primeiro Grau') {
    return 'Lenda do Follow-up';
  }

  if (input.buzzwordCount >= 5 && input.durationMinutes >= 45) {
    return 'Showman de slides sem alma';
  }

  if (input.durationMinutes >= 60 && input.decisionCount <= 2) {
    return 'Sobrevivente do Expresso Corporativo';
  }

  return 'Navegante de Veredictos';
}
