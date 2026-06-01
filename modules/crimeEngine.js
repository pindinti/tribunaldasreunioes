const HUMOR_PRIORITY = [
  'PowerPoint Manslaughter',
  'Buzzword Abuse',
  'Executive Summon',
  'First Degree Overplanning',
  'Objective Negligence',
  'Decision Avoidance',
  'Meeting That Should Have Been An Email',
  'Serial Follow-Up Scheduling',
  'Meeting Inflation',
  'Reckless Use of Synergy',
];

export default function selectPrimaryCrime(crimes) {
  const triggered = crimes.filter((crime) => crime.triggered);
  if (triggered.length === 0) {
    return null;
  }

  let selected = triggered.slice();
  const highestSeverity = Math.max(...selected.map((crime) => crime.severity));
  selected = selected.filter((crime) => crime.severity === highestSeverity);

  if (selected.length > 1) {
    const highestConfidence = Math.max(...selected.map((crime) => crime.confidence));
    selected = selected.filter((crime) => crime.confidence === highestConfidence);
  }

  if (selected.length > 1) {
    selected.sort((a, b) => HUMOR_PRIORITY.indexOf(a.name) - HUMOR_PRIORITY.indexOf(b.name));
  }

  return selected[0];
}
