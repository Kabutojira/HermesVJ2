import type { QualityTier } from '../../../../lib/performance';

export const galleryBudget = {
  low: { columns: 4, bevelSegments: 1 },
  medium: { columns: 6, bevelSegments: 2 },
  high: { columns: 8, bevelSegments: 3 },
} satisfies Record<QualityTier, { columns: number; bevelSegments: number }>;

export function shouldUsePhysicalGlass(quality: QualityTier): boolean {
  return quality !== 'low';
}
