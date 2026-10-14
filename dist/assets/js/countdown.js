export const WEDDING_DATE = new Date('2027-05-23T16:00:00-03:00');
// Fixed origin keeps the sand level consistent between visits and devices.
export const COUNTDOWN_START = new Date('2026-10-14T00:00:00-03:00');

export function getCountdownState(now = new Date(), end = WEDDING_DATE, start = COUNTDOWN_START) {
  const remaining = Math.max(0, end.getTime() - now.getTime());
  const duration = Math.max(1, end.getTime() - start.getTime());
  const fraction = Math.max(0, Math.min(1, remaining / duration));
  return {
    days: Math.ceil(remaining / 86400000),
    fraction,
    finished: remaining === 0,
    // Each chamber is triangular; square roots map area (sand) to height.
    topY: 78 - 56 * Math.sqrt(fraction),
    bottomY: 84 + 56 * Math.sqrt(fraction),
  };
}
