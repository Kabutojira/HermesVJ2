import { Vector2 } from 'three';
import type { QualityTier } from '../../../../lib/performance';

export interface StudioBudget {
  profilePoints: number;
  radialSegments: number;
}

const BUDGETS: Record<QualityTier, StudioBudget> = {
  low: { profilePoints: 8, radialSegments: 32 },
  medium: { profilePoints: 11, radialSegments: 56 },
  high: { profilePoints: 14, radialSegments: 80 },
};

export function getStudioBudget(qualityTier: QualityTier): StudioBudget {
  return BUDGETS[qualityTier];
}

export function createHeroProfile(qualityTier: QualityTier): Vector2[] {
  const { profilePoints } = getStudioBudget(qualityTier);
  return Array.from({ length: profilePoints }, (_, index) => {
    if (index === 0) return new Vector2(0, 0.08);
    if (index === profilePoints - 1) return new Vector2(0, 5.45);
    const t = (index - 1) / (profilePoints - 3);
    const shoulder = 0.17 * Math.exp(-Math.pow((t - 0.72) * 5, 2));
    const radius = 1.08 - t * 0.36 + Math.sin(t * Math.PI) * 0.13 + shoulder;
    return new Vector2(radius, 0.16 + t * 5.08);
  });
}
