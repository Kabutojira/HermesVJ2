import type { QualityTier } from '../../../../lib/performance';

export interface CanyonBudget {
  layerCount: number;
  wallSegments: number;
  dustCount: number;
}

export interface CanyonLayer {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

const BUDGETS: Record<QualityTier, CanyonBudget> = {
  low: { layerCount: 8, wallSegments: 2, dustCount: 36 },
  medium: { layerCount: 12, wallSegments: 2, dustCount: 68 },
  high: { layerCount: 16, wallSegments: 3, dustCount: 104 },
};

const ROCK_COLORS = ['#7d3626', '#9b482d', '#b85f38', '#ce7847'];

export function getCanyonBudget(qualityTier: QualityTier): CanyonBudget {
  return BUDGETS[qualityTier];
}

export function createCanyonLayers(qualityTier: QualityTier): CanyonLayer[] {
  const { layerCount } = getCanyonBudget(qualityTier);
  return Array.from({ length: layerCount }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const depth = Math.floor(index / 2);
    const variation = Math.sin((index + 1) * 2.173);
    return {
      position: [side * (8.1 + Math.abs(variation) * 1.1), 3.5 + (depth % 3) * 0.55, 1 - depth * 9.2],
      rotation: [variation * 0.08, side * (0.1 + variation * 0.1), variation * 0.035],
      scale: [4.2 + Math.abs(variation) * 1.1, 5.8 + (depth % 3) * 1.25, 3.1 + Math.abs(variation) * 0.8],
      color: ROCK_COLORS[(depth + (side > 0 ? 1 : 0)) % ROCK_COLORS.length],
    };
  });
}

export function createCanyonDust(qualityTier: QualityTier): Float32Array {
  const { dustCount } = getCanyonBudget(qualityTier);
  const positions = new Float32Array(dustCount * 3);
  let state = 0x6d2b79f5;
  const random = () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
  for (let index = 0; index < dustCount; index += 1) {
    positions[index * 3] = (random() - 0.5) * 12;
    positions[index * 3 + 1] = 0.4 + random() * 7;
    positions[index * 3 + 2] = 14 - random() * 58;
  }
  return positions;
}
