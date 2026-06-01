export default function determineVerdict(primaryCrime, input, metrics) {
  if (!primaryCrime) {
    return 'Caso Arquivado';
  }

  if (primaryCrime.name === 'Convocação Executiva') {
    return 'Escalado para Tribunal Executivo';
  }

  if (primaryCrime.name === 'Agendamento Serial de Follow-ups' && input.decisionCount === 0) {
    return 'Adiado para Follow-Up';
  }

  if (primaryCrime.severity === 3) {
    return 'Culpado';
  }

  if (primaryCrime.severity === 2 && metrics.ObjectiveClarityScore >= 70 && input.decisionCount >= 2) {
    return 'Culpado Mas Necessário';
  }

  if (primaryCrime.severity === 2) {
    return 'Culpado';
  }

  return 'Inocente';
}
