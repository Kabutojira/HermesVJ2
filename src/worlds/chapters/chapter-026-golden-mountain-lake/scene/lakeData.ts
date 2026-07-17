import type { QualityTier } from '../../../../lib/performance';

export const lakeBudget = {
  low: { ridgeSegments: 12, shoreStones: 8 },
  medium: { ridgeSegments: 24, shoreStones: 14 },
  high: { ridgeSegments: 40, shoreStones: 22 },
} satisfies Record<QualityTier, { ridgeSegments: number; shoreStones: number }>;

export function shouldUseWater(capabilities: Pick<{ waterSize: 0 | 512 | 1024 }, 'waterSize'>, reducedMotion: boolean): boolean {
  return capabilities.waterSize > 0 && !reducedMotion;
}

export function ridgeHeight(index: number, segments: number): number {
  const x = index / Math.max(1, segments - 1);
  const splitPeak = Math.max(0, 1 - Math.abs(x - 0.5) * 2.8);
  const cleft = Math.exp(-Math.pow((x - 0.5) * 18, 2)) * 0.24;
  return 2.2 + splitPeak * 6.2 - cleft * 6.2 + Math.sin(index * 2.17) * 0.28;
}
