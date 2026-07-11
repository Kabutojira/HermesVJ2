export type QualityTier = 'low' | 'medium' | 'high';

export const detectQualityTier = (): QualityTier => {
  if (typeof window === 'undefined') return 'high';
  if (window.innerWidth < 640) return 'low';
  if (window.innerWidth < 1200) return 'medium';
  return 'high';
};
