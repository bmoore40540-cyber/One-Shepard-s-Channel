export interface FilterResult {
  passes: boolean;
  reasons: string[];
}

export function evaluateMessage(
  body: string | null,
  practicalNextSteps: string | null
): FilterResult {
  const reasons: string[] = [];
  let score = 0;

  if (!practicalNextSteps || practicalNextSteps.trim().length < 20) {
    return {
      passes: false,
      reasons: ['Practical Next Steps are missing or too brief. Concrete actions are required for notification.'],
    };
  }
  score += 2;

  const text = `${body || ''} ${practicalNextSteps}`.toLowerCase();

  const godAnchors = [
    'god', 'christ', 'jesus', 'lord', 'father', 'kingdom', 'holy spirit',
    'scripture', 'bible', 'word of god', 'shepherd', 'mammon', 'repent',
    'obedience', 'truth', 'love', 'mercy', 'justice', 'repair'
  ];
  const hasAnchor = godAnchors.some(term => text.includes(term));
  if (hasAnchor) score += 2;
  else reasons.push('Message appears to lack clear anchoring in God or Christ.');

  const practicalIndicators = [
    'do ', 'can ', 'should ', 'begin ', 'start ', 'practice ', 'step',
    'action', 'change', 'examine', 'repent', 'forgive', 'repair',
    'give', 'serve', 'pray', 'stop ', 'release', 'share'
  ];
  if (practicalIndicators.some(term => text.includes(term))) score += 1;

  const passes = score >= 3 && hasAnchor;
  if (!passes && reasons.length === 0) {
    reasons.push('Message did not meet the medium threshold for livable weight and practical direction.');
  }

  return { passes, reasons };
}
