export type MutablePoint = [number, number, number];

const FLIGHT_DURATION = 12;

export function getCometFlightPosition(
  index: number,
  time: number,
  out: MutablePoint = [0, 0, 0],
): MutablePoint {
  const progress = ((time / FLIGHT_DURATION + index * 0.2) % 1 + 1) % 1;
  const lane = index - 2;

  out[0] = 7 - progress * 14;
  out[1] = 1.1 + lane * 0.72 + Math.sin(progress * Math.PI * 2 + index) * 0.25;
  out[2] = -1.8 + index * 0.9 + Math.sin(progress * Math.PI * 2) * 0.35;
  return out;
}
