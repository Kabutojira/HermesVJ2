import type { QualityTier } from '../../../../lib/performance';

export const cityBudget = {
  low: { buildings: 12, rain: 90 },
  medium: { buildings: 22, rain: 210 },
  high: { buildings: 34, rain: 420 },
} satisfies Record<QualityTier, { buildings: number; rain: number }>;

export interface CityBlock {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  tone: number;
}

export function createCityBlocks(count: number, seed = 2519): CityBlock[] {
  let state = seed >>> 0;
  const random = () => ((state = (state * 1664525 + 1013904223) >>> 0) / 0x100000000);
  const blocks: CityBlock[] = [];
  for (let index = 0; index < count; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const lane = Math.floor(index / 2);
    blocks.push({
      x: side * (4.8 + random() * 3.1),
      z: 5 - lane * 2.2 + (random() - 0.5) * 0.55,
      width: 2.2 + random() * 2.1,
      depth: 1.5 + random() * 1.8,
      height: 3.4 + random() * 7.5,
      tone: random(),
    });
  }
  return blocks;
}

export function createRain(count: number, seed = 811): Float32Array {
  let state = seed >>> 0;
  const random = () => ((state = (state * 1103515245 + 12345) >>> 0) / 0x100000000);
  const points = new Float32Array(count * 6);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 6;
    const x = (random() - 0.5) * 22;
    const y = random() * 13;
    const z = (random() - 0.5) * 24;
    points[offset] = x;
    points[offset + 1] = y;
    points[offset + 2] = z;
    points[offset + 3] = x - 0.035;
    points[offset + 4] = y - 0.34;
    points[offset + 5] = z + 0.018;
  }
  return points;
}
