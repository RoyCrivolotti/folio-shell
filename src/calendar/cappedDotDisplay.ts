export const DEFAULT_STACKED_DOT_CAP = 3

export function cappedDotDisplay(
  count: number,
  maxDots: number = DEFAULT_STACKED_DOT_CAP,
): { dots: number; overflow: number } {
  if (count <= 0) return { dots: 0, overflow: 0 }
  if (count <= maxDots) return { dots: count, overflow: 0 }
  return { dots: maxDots, overflow: count - maxDots }
}
