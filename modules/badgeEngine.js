export default function selectBadge(primaryCrime, metrics, input) {
  if (primaryCrime?.name === 'Assassinato por PowerPoint') {
    return 'Paria do PowerPoint';
  }

  if (primaryCrime?.name === 'Abuso de Buzzwords' || primaryCrime?.name === 'Uso Imprudente de Sinergia') {
    return 'Campeão de Buzzwords';
  }

  if (primaryCrime?.name === 'Reunião que Deveria Ser um Email' || primaryCrime?.name === 'Inflação de Reuniões') {
    return 'Reincidente em Reuniões';
  }

  if (metrics.EmailPotential >= 70 && primaryCrime?.name !== 'Reunião que Deveria Ser um Email') {
    return 'Artista da Fuga por Email';
  }

  if (metrics.InstagramProbability >= 70) {
    return 'Criador de Memes de Reunião';
  }

  if (input.circleBackCount >= 1) {
    return 'Especialista em Circle-Back Estratégico';
  }

  if (input.participantCount >= 6 && input.decisionCount <= 1) {
    return 'Especialista em Aceno Profissional';
  }

  if (primaryCrime?.name === 'Planejamento Excessivo de Primeiro Grau') {
    return 'Arqueólogo de Agenda';
  }

  if (input.buzzwordCount >= 5 && input.durationMinutes >= 45) {
    return 'Exibicionista de Apresentações';
  }

  if (input.durationMinutes >= 60 && input.decisionCount <= 2) {
    return 'Sobrevivente do Trimestre';
  }

  return 'Viajante de Veredictos';
}

