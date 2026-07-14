import { useEffect, useState } from 'react';

export type QualityTier = 'low' | 'medium' | 'high';

interface DeviceProfile {
  width: number;
  devicePixelRatio: number;
  hardwareConcurrency: number;
}

export const classifyQualityTier = ({ width, devicePixelRatio, hardwareConcurrency }: DeviceProfile): QualityTier => {
  if (width < 640 || hardwareConcurrency <= 4) return 'low';
  if (width < 1200 || devicePixelRatio > 2) return 'medium';
  return 'high';
};

export const detectQualityTier = (): QualityTier => {
  if (typeof window === 'undefined') return 'high';
  return classifyQualityTier({
    width: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
  });
};

export function useQualityTier(): QualityTier {
  const [tier, setTier] = useState(detectQualityTier);

  useEffect(() => {
    const update = () => setTier(detectQualityTier());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return tier;
}
