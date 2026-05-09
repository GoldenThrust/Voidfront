const TAU = Math.PI * 2;


export function clamp(value, min, max = null) {
  return Math.max(max ? min : -min, Math.min(max ?? min, value))
}

export function normalizeAngle(angle) {
  return ((angle % TAU) + TAU) % TAU;
}

export function shortestAngleDist(a, b) {
  return ((b - a + Math.PI * 3) % TAU) - Math.PI;
}

export function clampAngle(angle, min, max) {
  angle = normalizeAngle(angle);
  min = normalizeAngle(min);
  max = normalizeAngle(max);

  const range = (max - min + TAU) % TAU;
  const relative = (angle - min + TAU) % TAU;

  // Inside range
  if (relative <= range) {
    return angle;
  }

  // Clamp to nearest edge
  const toMin = shortestAngleDist(angle, min);
  const toMax = shortestAngleDist(angle, max);

  return Math.abs(toMin) < Math.abs(toMax)
    ? min
    : max;
}