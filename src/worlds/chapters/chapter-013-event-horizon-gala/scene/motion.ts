export type MutablePoint = [number, number, number];

const INFALL_DURATION = 8;

export function getInfallingMatterPosition(
  index: number,
  time: number,
  out: MutablePoint = [0, 0, 0],
): MutablePoint {
  const progress = ((time / INFALL_DURATION + index * 0.13) % 1 + 1) % 1;
  const radius = 5.8 - progress * 4.35;
  const angle = index * 1.71 + progress * Math.PI * 5.5;

  out[0] = Math.cos(angle) * radius;
  out[1] = Math.sin(angle * 0.47) * (0.34 - progress * 0.2);
  out[2] = Math.sin(angle) * radius;
  return out;
}
