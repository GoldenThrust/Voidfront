export function clamp(value, min, max = null) {
  return Math.max(max ? min : -min, Math.min(max ?? min, value))
}